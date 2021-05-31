function TechnicalError(message = "") {
    this.name = "NotImplementedError";
    this.message = message;
}

TechnicalError.prototype = Error.prototype;
