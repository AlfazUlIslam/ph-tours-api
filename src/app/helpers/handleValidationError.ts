import { IErrorSources, IGenericErrorResponse } from "../interfaces/error.types";

const handleValidationError = (err: any): IGenericErrorResponse => {
    const errorSources: IErrorSources[] = [];
    const errors = Object.values(err.errors);

    errors.forEach((errorObject: any) => errorSources.push({
        path: errorObject.path,
        message: errorObject.message
    }));
    
    return {
        statusCode: 400,
        message: "Validation error",
        errorSources
    };
};

export default handleValidationError;