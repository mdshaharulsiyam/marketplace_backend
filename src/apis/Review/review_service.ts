import mongoose from "mongoose";
import Queries, { QueryKeys, SearchKeys } from "../../utils/Queries";
import { review_model } from "./review_model";

async function create(data: { [key: string]: string }) {
  let business = null;
  let issue = null;
  let review_for = "WEBSITE";
  const { is_approved, id, rating, description, img, user } = data;

  const session = await mongoose.startSession();
  try {
    const result = await session.withTransaction(async () => {
      const [result] = await Promise.all([
        review_model.insertMany(
          [
            {
              description,
              img,
              business,
              issue,
              review_for,
              rating: Number(rating),
              user,
            },
          ],
          { session },
        ),
      ]);
      return {
        success: true,
        message: "review created successfully",
        data: result,
      };
    });
    return result;
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
}
async function delete_review(id: string) {
  const result = await review_model.findByIdAndDelete({ _id: id });
  return {
    success: true,
    message: "review deleted successfully",
    data: result,
  };
}

async function approve(id: string) {
  const result = await review_model
    .findOneAndUpdate(
      { _id: id },
      [
        {
          $set: {
            is_approved: {
              $cond: {
                if: { $eq: ["$is_approved", false] },
                then: true,
                else: false,
              },
            },
          },
        },
      ],
      { new: true },
    )
    .lean();
  return {
    success: true,
    message: `review ${result?.is_approved} successfully`,
    data: result,
  };
}

async function get_all(
  queryKeys: QueryKeys,
  searchKeys: SearchKeys,
  populatePath?: string | string[],
  selectFields?: string | string[],
  modelSelect?: string,
) {
  return await Queries(
    review_model,
    queryKeys,
    searchKeys,
    populatePath,
    selectFields,
    modelSelect,
  );
}

export const review_service = Object.freeze({
  create,
  delete_review,
  approve,
  get_all,
});
