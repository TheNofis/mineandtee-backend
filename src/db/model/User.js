import { model, Schema } from "mongoose";

const roles = ["user", "admin", "ban"];

const Auth = new Schema({
  roles: { type: [{ enum: roles }], default: [roles[0]] },
  token: { type: String, default: "" },
});

const Profile = new Schema({
  firstname: { type: String, default: "" },
  lastname: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  avatar: { type: String, default: "" },
  birthday: { type: String, default: "" },
  register: { type: Number, requred: true },
  online: { type: Number, default: Date.now() },
});

const User = new Schema({
  id: { type: Number, requred: true, unique: true },
  auth: Auth,
  profile: Profile,
});

export default model("User", User);
