export default class ResponseModule {
  startTime = null;
  start() {
    this.startTime = Date.now();
  }

  getTime() {
    return Date.now() - this.startTime;
  }

  error(error = "Not error", code = 200) {
    console.error(error);
    return {
      status: "Error",
      error,
      code,
      time: this.getTime(),
    };
  }
  success(content = "Not content", code = 100) {
    return {
      status: "Success",
      content,
      code,
      time: this.getTime(),
    };
  }
}
