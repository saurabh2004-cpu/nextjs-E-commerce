class ApiError extends Error {
    public statusCode: number;
    public data: any; // Adjust type as needed for additional contextual data
    public message: string;
    public success: boolean;
    public errors: any[]; // Adjust type as needed for additional errors

    constructor(
        statusCode: number,
        message: string = "something went wrong",
        errors: any[] = [],
        stack: string = ""
    ) {
        super(message); // Calls the constructor of the superclass (Error class)

        // Initialize properties specific to ApiError
        this.statusCode = statusCode;
        this.data = null; // Can be used to attach additional contextual data to the error object
        this.message = message;
        this.success = false; // Default to false for errors
        this.errors = errors;

        // Customize stack trace handling
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
