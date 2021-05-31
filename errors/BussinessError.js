function BusinessError(message = "") {
    this.name = "NotImplementedError";
    this.message = message;
}

BusinessError.prototype = Error.prototype;
