import { model, Schema } from "mongoose";

const roles = ["unverified", "user", "admin", "ban"];

const Profile = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    ingamename: { type: String, required: true, unique: true },
    register_ts: { type: Number, required: true },
    avatar: { type: String, default: "" },
  },
  { _id: false },
);

const User = new Schema({
  id: { type: String, required: true, unique: true },

  emailVerified: { type: Boolean, default: false },
  emailCode: { type: String, default: "" },

  password: { type: String, required: true },
  role: { type: String, enum: roles, default: roles[0] },

  profile: Profile,
});

export default model("User", User);
