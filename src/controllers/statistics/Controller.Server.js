import ResponseModule from "../../utils/module/Response.Module.js";
import fetch from "node-fetch";
import "dotenv/config";

class controller {
  async server(req, res) {
    const Response = new ResponseModule();
    try {
      const response = await fetch(
        `${process.env.STATISTICS_URL}/serverOverview?server=MineAndTee`,
      );
      const data = await response.json();

      return res.json(Response.success(data?.numbers));
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }
}
export default new controller();
