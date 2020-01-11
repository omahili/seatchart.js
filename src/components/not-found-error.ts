class NotFoundError extends Error {
    constructor(m: string) {
        super(m);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

export {
    NotFoundError,
};