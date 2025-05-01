import { setting_model, WebsiteSettingModel } from "./setting_model";
import { ISetting, IWebsiteSetting } from "./setting_type";

async function create(data: ISetting) {
  const result = await setting_model.findOneAndUpdate(
    { name: data?.name },
    { desc: data?.desc },
    { new: true, upsert: true },
  );

  return { success: true, message: `${data?.name} updated successfully` };
}

async function get(name: string) {
  const result = await setting_model
    .findOne({ name })
    .select("-_id name desc")
    .lean();
  if (result) {
    return {
      success: true,
      message: `${name} retrieve successfully`,
      data: { ...result },
    };
  } else {
    return {
      success: true,
      message: `${name} retrieve successfully`,
      data: { name: name, desc: "" },
    };
  }
}

const create_web_setting = async (data: IWebsiteSetting) => {
  const exist = await WebsiteSettingModel.findOne();
  if (!exist) {
    await WebsiteSettingModel.create(data);
  } else {
    await WebsiteSettingModel.updateOne(
      { _id: exist?._id },
      {
        $set: {
          ...data,
        },
      },
    );
  }
  return {
    success: true,
    message: "web setting updated successfully",
  };
};

async function get_web_setting() {
  const result = await WebsiteSettingModel.findOne().lean();

  return {
    success: true,
    message: `web setting retrieve successfully`,
    data: { ...result },
  };
}

export const setting_service = Object.freeze({
  create,
  get,
  create_web_setting,
  get_web_setting,
});
