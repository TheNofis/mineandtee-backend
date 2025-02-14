import { model, Schema } from "mongoose";

const Answer = new Schema({
  content: { type: String, required: true },
  users: { type: [String] },
});

const Pool = new Schema({
  id: { type: String, required: true, unique: true },

  title: { type: String, required: true },
  description: { type: String, required: true },
  answers: {
    type: [Answer],
    required: true,
  },
  create_ts: { type: Number, required: true },
  close_ts: { type: Number, required: true },
});

export default model("Pool", Pool);
