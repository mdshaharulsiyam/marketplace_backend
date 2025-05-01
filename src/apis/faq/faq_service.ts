import faq_model from "./faq_model";
import { IFaq } from "./faq_types";

async function create(data: Partial<IFaq>) {
  await faq_model.create(data);
  return {
    success: true,
    message: "faq created successfully",
  };
}

async function get_all() {
  const result = await faq_model.find().lean();
  return {
    success: true,
    message: "faq retrieve successfully",
    data: result,
  };
}

async function update(id: string, data: Partial<IFaq>) {
  await faq_model.findOneAndUpdate({ _id: id }, { $set: data }, { new: true });
  return {
    success: true,
    message: "faq updated successfully",
  };
}

async function delete_faq(id: string) {
  await faq_model.findOneAndDelete({ _id: id });
  return {
    success: true,
    message: "faq deleted successfully",
  };
}

export const faq_service = Object.freeze({
  create,
  get_all,
  update,
  delete_faq,
});
