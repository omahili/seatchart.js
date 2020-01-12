class InvalidParameterError extends Error {
    constructor(m: string) {
        super(m);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, InvalidParameterError.prototype);
    }
}

export default InvalidParameterError;
