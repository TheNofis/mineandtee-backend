import jwt from "jsonwebtoken";
import ResponseModule from "../../utils/module/Response.Module.js";

class controller {
  async getToken(req, res) {
    const Response = new ResponseModule();
    try {
      const {} = req.query;
      Response.start();
      return res.json(Response.success(jwt.verify(token, process.env.JWT_KEY)));
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }
}
export default new controller();
