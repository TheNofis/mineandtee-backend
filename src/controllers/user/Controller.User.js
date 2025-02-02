import ResponseModule from "../../utils/module/Response.Module.js";
import User from "../../db/model/User.js";

class controller {
  async profile(req, res) {
    const Response = new ResponseModule();
    try {
      Response.start();
      const { id } = req?.user;
      const user = await User.findOne(
        { id },
        {
          _id: false,
          profile: true,
          role: true,
        },
      );

      if (!user)
        return res.json(
          Response.error("User not found", "Пользователь не найден"),
        );

      return res.json(Response.success(user));
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }
}

export default new controller();
