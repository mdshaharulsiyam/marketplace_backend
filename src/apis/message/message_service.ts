import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { io } from "../../socket";
import Aggregator from "../../utils/Aggregator";
import { QueryKeys, SearchKeys } from "../../utils/Queries";
import { IAuth } from "../Auth/auth_types";
import { conversation_model } from "../conversation/conversation_model";
import { conversation_service } from '../conversation/conversation_service';
import { service_model } from "../Service/service_model";
import { message_model } from "./message_model";

async function create(data: { [key: string]: string }) {
  const [result, conversation] = await Promise.all([
    message_model.create(data),
    conversation_model.findById(data?.conversation_id) as any,
  ]);
  if (conversation?.blockedBy?.length > 0) {
    throw new Error("conversation blocked");
  }
  setImmediate(() => {
    const receiver_id = conversation?.users?.filter(
      (user: any) => user !== data?.sender,
    );

    receiver_id?.map((user: any) =>
      io.emit(
        `new-message::${data?.conversation_id}-${user?.toString()}`,
        result,
      ),
    );

    io.emit(`new-conversation-message::${data?.conversation_id}`, result);
  });

  return {
    success: true,
    message: "message created successfully",
    data: result,
  };
}

async function get_all(
  queryKeys: QueryKeys,
  searchKeys: SearchKeys,

) {
  const [data, conversation]: [any, any] = await Promise.all([
    Aggregator(message_model, queryKeys, searchKeys, []),
    conversation_service.get_all({ _id: queryKeys.conversation_id }, {}),
  ])

  return {
    conversation: conversation?.data?.[0],
    ...data,
  };
}

async function update(id: string, data: { [key: string]: string }) {
  const result = await message_model.findByIdAndUpdate(
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
    message: "message updated successfully",
    data: result,
  };
}

async function delete_message(
  id: string,
  data: { [key: string]: string },
  auth: IAuth,
) {
  const is_exists = await message_model.findOne({ _id: id, name: data?.name });

  if (!is_exists) throw new Error("message not found");

  const is_pass_mass = await bcrypt.compare(data?.password, auth?.password);

  if (!is_pass_mass) throw new Error("password doesn't match");

  const session = await mongoose.startSession();
  try {
    const result = await session.withTransaction(async () => {
      const [result] = await Promise.all([
        message_model.findByIdAndDelete(id, { session }),
        service_model.deleteMany({ message: id }, { session }),
      ]);
      return result;
    });
    return {
      success: true,
      message: "message deleted successfully",
      data: result,
    };
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
}

export const message_service = Object.freeze({
  create,
  get_all,
  update,
  delete_message,
});
