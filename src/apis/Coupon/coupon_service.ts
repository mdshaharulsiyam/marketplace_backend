import Queries, { SearchKeys } from "../../utils/Queries";
import { product_model } from "../Product/product_model";
import { coupon_model } from "./coupon_model";
import ICoupon from "./coupon_type";

const create = async (data: ICoupon) => {
  const result = await coupon_model.create(data);

  return {
    success: true,
    message: "coupon created successfully",
    data: result,
  };
};

const update = async (id: string, data: ICoupon) => {
  const result = await coupon_model.findByIdAndUpdate(
    id,
    {
      $set: {
        ...data,
      },
    },
    { new: true },
  );

  return {
    success: true,
    message: "coupon updated successfully",
    data: result,
  };
};

const delete_coupon = async (id: string) => {
  const result = await coupon_model.findByIdAndDelete(id);

  return {
    success: true,
    message: "coupon deleted successfully",
    data: result,
  };
};

const check_coupon = async (name: string, id: string) => {
  const [coupon, product] = await Promise.all([
    coupon_model.findOne({ name }),
    product_model.findOne({ "coupon.coupon_code": name, _id: id }),
  ]);

  if (!coupon?._id) throw new Error(`coupon not found`);

  if (coupon?.total_available == 0)
    throw new Error(`this coupon limit has been ended`);

  if (!product?._id)
    throw new Error(`you can't apply that coupon in this product`);

  return {
    success: true,
    message: "coupon applied successfully",
    data: coupon,
  };
};

const get_all = async (queryKeys: SearchKeys, searchKeys: SearchKeys) => {
  return await Queries(coupon_model, queryKeys, searchKeys);
};

export const coupon_service = Object.freeze({
  create,
  update,
  delete_coupon,
  check_coupon,
  get_all,
});
