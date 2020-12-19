class AppError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.error = message
        Error.captureStackTrace(this, this.constructor);
    }
}

class HttpError extends AppError {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}

class HttpBadRequestError extends HttpError {
    constructor(message) {
        super(400, message);
    }
}

class HttpNotFoundError extends HttpError {
    constructor(message) {
        super(404, message);
    }
}

class HttpNotAuthenticatedError extends HttpError {
    constructor(message) {
        super(401, message);
    }
}

module.exports = { AppError, HttpError, HttpBadRequestError, HttpNotFoundError, HttpNotAuthenticatedError }
