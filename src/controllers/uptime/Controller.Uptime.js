class controller {
  ping(_, res) {
    try {
      return res.status(200).json({ text: "pong!" });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: { message: error } });
    }
  }
}
export default new controller();
