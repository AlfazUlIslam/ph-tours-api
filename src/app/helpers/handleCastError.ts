import { IGenericErrorResponse } from "../interfaces/error.types";

const handleCastError = (err: any): IGenericErrorResponse => {
    return {
        statusCode: 400,
        message: "Invalid MongoDB ObjectID. Please provide a valid id."
    };
};

export default handleCastError;