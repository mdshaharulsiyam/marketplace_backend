import auth_model from "../Auth/auth_model";
import { payment_model } from "../Payment/payment_model";

async function get_overview(year_user?: string, year_payment?: string) {
  const current_year_user = year_user
    ? Number(year_user)
    : new Date().getFullYear();

  const current_year_payment = year_payment
    ? Number(year_payment)
    : new Date().getFullYear();

  const [
    user,
    professionals,
    total_earning,
    earning,
    users,
    users_year,
    payment_year,
  ] = await Promise.all([
    auth_model.countDocuments({ role: "USER" }),
    auth_model.countDocuments({ role: "PROFESSIONAL" }),
    payment_model.aggregate([
      {
        $match: {
          status: true,
        },
      },
      {
        $group: {
          _id: null,
          total_amount: { $sum: "$amount" },
        },
      },
    ]),
    payment_model.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${current_year_payment}-01-01`),
            $lte: new Date(`${current_year_payment}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total_amount: { $sum: "$amount" },
        },
      },
    ]),
    auth_model.aggregate([
      {
        $match: {
          $and: [{ role: { $ne: "ADMIN" } }, { role: { $ne: "SUPER_ADMIN" } }],

          createdAt: {
            $gte: new Date(`${current_year_user}-01-01`),
            $lte: new Date(`${current_year_user}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total_amount: { $sum: 1 },
        },
      },
    ]),
    auth_model.aggregate([
      {
        $group: {
          _id: { $year: "$createdAt" },
        },
      },
      {
        $group: {
          _id: null,
          years: { $addToSet: "$_id" },
        },
      },
    ]),
    payment_model.aggregate([
      {
        $group: {
          _id: { $year: "$createdAt" },
        },
      },
      {
        $group: {
          _id: null,
          years: { $addToSet: "$_id" },
        },
      },
    ]),
  ]);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const earningGrowth = [...Array(12).keys()].map((i) => {
    const findMonth = earning?.find((item) => item?._id == i + 1);
    return findMonth ? findMonth?.total_amount : 0;
  });

  const userGrowth = [...Array(12).keys()].map((i) => {
    const findMonth = users?.find((item) => item?._id == i + 1);
    return findMonth ? findMonth?.total_amount : 0;
  });

  return {
    user,
    professionals,
    total_earning: total_earning ? total_earning?.[0]?.total_amount : 0,
    earningGrowth: {
      data: earningGrowth,
      monthNames,
    },
    userGrowth: {
      data: userGrowth,
      monthNames,
    },
    users_year: users_year?.[0]?.years,
    payment_year: payment_year?.[0]?.years,
  };
}

export const overview_service = Object.freeze({
  get_overview,
});
