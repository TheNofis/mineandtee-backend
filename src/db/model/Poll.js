import { model, Schema } from "mongoose";
import { v4 } from "uuid";

const InfoSchema = new Schema(
  {
    type: Map,
    of: new Schema(
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
      { _id: false },
    ),
  },
  { _id: false, strict: false }, // Разрешает динамические языковые ключи
);

const AnswerSchema = new Schema(
  {
    id: { type: String, default: () => v4(), unique: true },
    votes_count: { type: Number, required: true, default: 0 },
    users: { type: [String], default: [] },
    local: {
      type: Map,
      of: String,
    },
  },
  { _id: false },
);

const Pool = new Schema({
  id: { type: String, default: () => v4(), unique: true },
  info: { type: InfoSchema, required: true },
  answers: { type: [AnswerSchema], default: [] },
  votes_count: { type: Number, required: true, default: 0 },
  create_ts: { type: Number, required: true, default: () => Date.now() },
  close_ts: { type: Number, required: false },
});

export default model("Pool", Pool);
