import ResponseModule from "../../utils/module/Response.Module.js";
import User from "../../db/model/User.js";

class controller {
  async users(req, res) {
    const Response = new ResponseModule();
    try {
      Response.start();
      const users = await User.find(
        { emailVerified: true },
        {
          _id: false,
          id: true,
          role: true,
          profile: true,
        },
      )
        .sort({ role: -1 })
        .lean();

      if (users.length === 0 || !users)
        return res.json(
          Response.error("Users not found", "Пользователи не найденs"),
        );

      return res.json(Response.success(users));
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }

  async actions(req, res) {
    const Response = new ResponseModule();
    try {
      Response.start();
      const { id } = req.params;
      const { action } = req.body;
      const user = await User.findOne({ id });
      if (user === null)
        return res.json(
          Response.error("User not found", "Пользователь не найден"),
        );
      if (action === "approve") user.role = "user";
      if (action === "ban") user.role = "ban";

      await user.save();

      return res.json(
        Response.success(
          await User.find(
            { emailVerified: true },
            {
              _id: false,
              id: true,
              role: true,
              profile: true,
            },
          )
            .sort({ role: -1 })
            .lean(),
          "Пользователь обновлен",
        ),
      );
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }
}

export default new controller();
