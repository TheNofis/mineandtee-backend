import { model, Schema } from "mongoose";
import { v4 } from "uuid";

const roles = ["user", "admin", "ban"];

const Auth = new Schema({
  verified: { type: Boolean, default: false },

  emailVerified: { type: Boolean, default: false },
  emailCode: { type: Number, default: 0 },

  roles: { type: [{ enum: roles }], default: [roles[0]] },
  token: { type: String, default: "" },
});

const Profile = new Schema({
  username: { type: String, require: true, unique: true },
  ingamename: { type: String, require: true, unique: true },
  register: { type: Number, require: true },
  avatar: { type: String, default: "" },
});

const User = new Schema({
  id: { type: String, default: v4(), unique: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },

  auth: Auth,
  profile: Profile,
});

export default model("User", User);
