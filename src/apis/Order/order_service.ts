import mongoose, { Types } from "mongoose";
import { IOrder, IOrderItem } from "./order_type";
import { order_model } from "./order_model";
import { cart_model } from "../Cart/cart_model";
import Queries, { QueryKeys, SearchKeys } from "../../utils/Queries";

const create_order = async (data: any, user_id: string) => {
  const session = await mongoose.startSession();
  try {
    const result = await session.withTransaction(async () => {
      const {
        items,
        total_amount,
        discount,
        final_amount,
        delivery_address,
        payment_method,
        coupon,
      } = data;

      const product_ids = items.map((item: IOrderItem) => item.product);

      const order_data = {
        user: user_id,
        items,
        total_amount,
        discount,
        final_amount,
        delivery_address,
        payment_method,
      } as { [key: string]: any };

      if (coupon) {
        order_data.coupon = coupon;
        order_data.coupon_applied = true;
      }

      const [order] = await Promise.all([
        order_model.insertMany([order_data], { session }),
        cart_model.findOneAndUpdate(
          { user: user_id },
          { $pull: { items: { product_id: { $in: product_ids } } } },
          { session, new: true },
        ),
      ]);
      return {
        success: true,
        message: "order created successfully",
        data: order,
      };
    });
    return result;
  } catch (error) {
    throw error;
  } finally {
    session.endSession();
  }
};

const get_all = async (
  queryKeys: QueryKeys,
  searchKeys: SearchKeys,
  populatePath?: any,
  selectFields?: string | string[],
  modelSelect?: string,
) => {
  return await Queries(
    order_model,
    queryKeys,
    searchKeys,
    populatePath,
    selectFields,
    modelSelect,
  );
};

const get_order_details = async (id: string) => {
  const order_details = await order_model
    .findById(id)
    .populate({
      path: "user",
      select: "name email img",
    })
    .populate({
      path: "items.product",
      select: "name price img",
    });
  return {
    success: true,
    message: "order data retrieved successfully",
    data: order_details,
  };
};

const update_order = async (id: string, data: any) => {
  const updated_order = await order_model.findByIdAndUpdate(id, data, {
    new: true,
  });

  if (!updated_order) throw new Error("Order not found");

  return {
    success: true,
    message: "Order updated successfully",
    data: updated_order,
  };
};

const delete_order = async (id: string) => {
  const deleted_order = await order_model.findByIdAndDelete(id);

  if (!deleted_order) throw new Error("Order not found");

  return {
    success: true,
    message: "Order deleted successfully",
    data: deleted_order,
  };
};

const update_delivery_status = async (id: string, delivery_status: string) => {
  const updated_order = await order_model.findByIdAndUpdate(
    id,
    { delivery_status },
    { new: true },
  );

  if (!updated_order) throw new Error("Order not found");

  return {
    success: true,
    message: "Order updated successfully",
    data: updated_order,
  };
};

export const order_service = Object.freeze({
  create_order,
  get_all,
  get_order_details,
  update_order,
  delete_order,
  update_delivery_status,
});
