class NotFoundError extends Error {
    constructor(m: string) {
        super(m);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
class InvalidParameter extends Error {
    constructor(m: string) {
        super(m);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, InvalidParameter.prototype);
    }
}

export {
    NotFoundError,
    InvalidParameter,
};