import Queries, { QueryKeys, SearchKeys } from "../../utils/Queries";
import { cart_model } from "./cart_model";
import { ICart, ICartItem } from "./cart_type";

const create_or_update = async (user_id: string, items: ICartItem[]) => {
  let total_quantity = items.reduce((acc, item) => acc + item.quantity, 0);
  let total_price = items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0,
  );

  let cart = await cart_model.findOne({ user: user_id });

  if (cart) {
    for (const new_item of items) {
      const existing_item_index = cart.items.findIndex(
        (item) => item.product_id.toString() === new_item.product_id.toString(),
      );

      if (existing_item_index >= 0) {
        cart.items[existing_item_index].quantity += new_item.quantity;
        cart.items[existing_item_index].price = new_item.price;
      } else {
        cart.items.push(new_item);
      }
    }

    cart.total_quantity = cart.items.reduce(
      (acc, item) => acc + item.quantity,
      0,
    );
    cart.total_price = cart.items.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0,
    );

    await cart.save();

    return {
      success: true,
      message: "new item added to cart",
      data: cart,
    };
  } else {
    cart = await cart_model.create({
      user: user_id,
      items,
      total_quantity,
      total_price,
    });
    return {
      success: true,
      message: "cart created successfully",
      data: cart,
    };
  }
};

const get_all = async (
  queryKeys: QueryKeys,
  searchKeys: SearchKeys,
  populatePath?: string | string[],
  selectFields?: string | string[],
  order?: string,
) => {
  const carts = (await Queries(
    cart_model,
    queryKeys,
    searchKeys,
    populatePath,
    selectFields,
  )) as {
    success: boolean;
    data: [{ items: ICartItem[] }];
  };

  if (order) {
    const order_ids = order.split(",");

    const new_item = carts?.data?.[0]?.items?.filter((item: ICartItem) =>
      order_ids.includes(item?.product_id?._id?.toString()),
    );

    const formateData = {
      success: true,
      data: [{ items: new_item }],
    };

    return formateData;
  } else {
    return carts;
  }
};

const update = async (id: string, data: ICart) => {
  const updated_cart = await cart_model.findByIdAndUpdate(id, data, {
    new: true,
  });

  if (!updated_cart) throw new Error("Cart not found");

  return {
    success: true,
    message: "Cart updated successfully",
    data: updated_cart,
  };
};

const delete_cart = async (id: string) => {
  const deletedCart = await cart_model.findByIdAndDelete(id);

  if (!deletedCart) throw new Error("Cart not found");

  return {
    success: true,
    message: "Cart deleted successfully",
    data: deletedCart,
  };
};

const delete_cart_item = async (id: string, user_id: string) => {
  let cart = await cart_model.findOne({ user: user_id });

  if (!cart) throw new Error("Cart not found");

  const targeted_item = cart.items?.find((item) => item?._id?.toString() == id);
  const newItems = cart.items?.filter((item) => item?._id?.toString() != id);

  if (!targeted_item) throw new Error("Item not found");

  cart.items = newItems;
  cart.total_quantity =
    Number(cart.total_quantity) - Number(targeted_item?.quantity);
  cart.total_price = Number(cart.total_price) - Number(targeted_item?.price);

  await cart.save();

  return {
    success: true,
    message: "Item deleted successfully",
    data: cart,
  };
};

export const cart_service = Object.freeze({
  create_or_update,
  get_all,
  update,
  delete_cart,
  delete_cart_item,
});
