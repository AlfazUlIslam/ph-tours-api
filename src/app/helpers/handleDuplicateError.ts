import { IGenericErrorResponse } from "../interfaces/error.types";

const handleDuplicateError = (err: any): IGenericErrorResponse => {
    const matchedArray = err.message.match(/"([^"]*)"/);

    return {
        statusCode: 400,
        message: `${matchedArray[1]} already exists`
    };
};

export default handleDuplicateError;