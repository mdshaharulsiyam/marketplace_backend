import { Request, Response } from "express";
import Stripe from "stripe";
import config, { HttpStatus } from "../../DefaultConfig/config";
import { SearchKeys } from "../../utils/Aggregator";
import { sendResponse } from "../../utils/sendResponse";
import auth_model from "../Auth/auth_model";
import { auth_service } from "../Auth/auth_service";
import { IAuth } from "../Auth/auth_types";
import { payment_service } from "./payment_service";
export const stripe = new Stripe(config.SRTRIPE_KEY);
async function create(req: Request, res: Response) {
  const { price_data, purpose, currency } = req.body;

  const is_valid = await payment_service.validate_stripe_country_currency(
    currency,
    "currency",
  );

  if (!is_valid) throw new Error("invalid currency");

  const result = await payment_service.payment_session(
    req,
    price_data,
    currency,
    purpose,
  );

  sendResponse(res, HttpStatus.SUCCESS, result);
}

async function success(req: Request, res: Response) {
  // res.render("success_payment");
  res.status(200).send({ success: true, message: "payment success" });
}

async function cancel(req: Request, res: Response) {
  // res.render("cancel_payment");
  res.status(200).send({ success: false, message: "payment cancel" });
}

async function success_account(req: Request, res: Response) {
  const { id } = req.params;
  const account = await stripe.accounts.update(id, {});

  if (
    account?.requirements?.disabled_reason &&
    account?.requirements?.disabled_reason.indexOf("rejected") > -1
  ) {
    return res.redirect(
      `${req.protocol + "://" + req.get("host")}/payment/refresh_account_connect/${id}`,
    );
  }
  if (
    account?.requirements?.disabled_reason &&
    account?.requirements?.currently_due &&
    account?.requirements?.currently_due?.length > 0
  ) {
    return res.redirect(
      `${req.protocol + "://" + req.get("host")}/payment/refresh_account_connect/${id}`,
    );
  }
  if (!account.payouts_enabled) {
    return res.redirect(
      `${req.protocol + "://" + req.get("host")}/payment/refresh_account_connect/${id}`,
    );
  }
  if (!account.charges_enabled) {
    return res.redirect(
      `${req.protocol + "://" + req.get("host")}/payment/refresh_account_connect/${id}`,
    );
  }
  // if (account?.requirements?.past_due) {
  //     return res.redirect(`${req.protocol + '://' + req.get('host')}/payment/refresh_account_connect/${id}`);
  // }
  if (
    account?.requirements?.pending_verification &&
    account?.requirements?.pending_verification?.length > 0
  ) {
    // return res.redirect(`${req.protocol + '://' + req.get('host')}/payment/refresh_account_connect/${id}`);
  }

  await auth_model.updateOne(
    {
      "stripe.stripe_account_id": id,
    },
    { "stripe.is_account_complete": true },
  );

  res.render("stripe_account_success.ejs");
}

async function refresh_account_connect(req: Request, res: Response) {
  const { id } = req.params;
  const url = await payment_service.update_account_onboarding(id, req);
  res.redirect(url);
}

async function create_account(req: Request, res: Response) {
  if (req?.user?.stripe?.stripe_account_id) {
    if (!req?.user?.stripe?.is_account_complete) {
      const url = await payment_service.update_account_onboarding(
        req?.user?.stripe?.stripe_account_id,
        req,
      );

      return sendResponse(res, HttpStatus.SUCCESS, {
        success: true,
        message: "account created successfully",
        url,
      });
    } else {
      // res.redirect(`${req.protocol + '://' + req.get('host')}/payment/success-account/${req?.user?.stripe?.stripe_account_id}`)
      throw new Error("account already created");
    }
  }
  const is_valid = await payment_service.validate_stripe_country_currency(
    req?.body?.country,
    "country",
  );

  if (!is_valid) throw new Error("invalid country");

  const account_id = await payment_service.create_account(
    req?.body?.email,
    req?.body?.country,
  );

  if (!account_id) throw new Error("account not created");

  await auth_service.update_auth(
    { stripe: { stripe_account_id: account_id, is_account_complete: false } },
    req?.user as IAuth,
  );

  const url = await payment_service.update_account_onboarding(account_id, req);

  return sendResponse(res, HttpStatus.SUCCESS, {
    success: true,
    message: "account created successfully",
    url,
  });
}

async function check_payment_status(req: Request, res: Response) {
  const result = await payment_service.check_payment_status(req?.params?.id);

  sendResponse(res, HttpStatus.SUCCESS, result);
}

async function transfer_balance(req: Request, res: Response) {
  const stripe_account_id = await payment_service.validate_transfer_balance(
    req?.user as IAuth,
    req?.body,
  );

  const result = await payment_service.transfer_balance(
    stripe_account_id,
    Number(req?.body?.amount ?? 0),
    req?.body?.currency ?? "USD",
  );

  return sendResponse(res, HttpStatus.SUCCESS, result);
}

async function webhook(req: Request, res: Response) {
  let event;
  const sig = req.headers["stripe-signature"];
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string | string[],
      config?.WEBHOOK,
    );
  } catch (err) {
    // logger.error(err)
    console.log(err);
    return;
  }
  switch (event.type) {
    case "checkout.session.completed":
      const session_id = event.data.object?.id;

      const payment_intent = event.data.object?.payment_intent;

      const paymentIntent = await stripe.paymentIntents.retrieve(
        payment_intent as string,
      );
      if (!paymentIntent || paymentIntent.amount_received === 0) {
        return console.log("Payment Not Succeeded");
      }
      await payment_service.success_payment(
        { status: true, transaction_id: paymentIntent.id },
        session_id,
      );
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
}

async function refund(req: Request, res: Response) {
  const result = await payment_service.refund(
    req?.body?.payment_intent,
    req?.user?.password as string,
    req?.body?.password as string,
    req?.body?.amount,
  );

  return sendResponse(res, HttpStatus.SUCCESS, result);
}
const get_all = async (req: Request, res: Response) => {
  const { search, ...otherValues } = req?.query;
  const searchKeys: SearchKeys = {};

  if (search) searchKeys.name = search as string;

  const queryKeys = {
    ...otherValues,
  };

  const result = await payment_service.get_all(queryKeys, searchKeys);
  sendResponse(res, HttpStatus.SUCCESS, result);
};
export const payment_controller = Object.freeze({
  create,
  success,
  cancel,
  webhook,
  refresh_account_connect,
  success_account,
  create_account,
  check_payment_status,
  transfer_balance,
  refund,
  get_all,
});
