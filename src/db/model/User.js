import { model, Schema } from "mongoose";
import { v4 } from "uuid";

const roles = ["unverified", "user", "admin", "ban"];

const Auth = new Schema({
  emailVerified: { type: Boolean, default: false },
  emailUrl: { type: Number, default: 0 },

  roles: { type: [{ enum: roles }], default: [roles[0]] },
  token: { type: String, default: "" },
});

const Profile = new Schema({
  username: { type: String, required: true, unique: true },
  ingamename: { type: String, required: true, unique: true },
  register_ts: { type: Number, required: true, default: Date.now() },
  avatar: { type: String, default: "" },
});

const User = new Schema({
  id: { type: String, default: v4(), unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  auth: Auth,
  profile: Profile,
});

export default model("User", User);
