function AuthError(message = "") {
    this.name = "NotImplementedError";
    this.message = message;
}

AuthError.prototype = Error.prototype;
