export default class ResponseModule {
  startTime = null;
  start() {
    this.startTime = Date.now();
  }

  getTime() {
    return Date.now() - this.startTime;
  }

  error(error = "Not error", message = "Error not message") {
    console.error(error);
    return {
      status: "Error",
      error,
      message,
      time: this.getTime(),
    };
  }
  success(content = "Not content", message = "Success not message") {
    return {
      status: "Success",
      content,
      message,
      time: this.getTime(),
    };
  }
}
