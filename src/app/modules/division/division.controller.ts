import { Request, Response } from "express";
import { asyncHandler, sendResponse } from "../../utils";
import { createDivisionService, getAllDivisionsService, updateDivisionService, deleteDivisionService, getSingleDivisionService } from "./division.service";

export const createDivision = asyncHandler(async (req: Request, res: Response) => {
    const result = await createDivisionService(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Division created",
        data: result,
    });
});

export const getAllDivisions = asyncHandler(async (req: Request, res: Response) => {
    const result = await getAllDivisionsService();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Divisions retrieved",
        data: result.data,
        meta: result.meta,
    });
});

export const getSingleDivision = asyncHandler(async (req: Request, res: Response) => {
    const slug = req.params.slug
    const result = await getSingleDivisionService(slug);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Divisions retrieved",
        data: result.data,
    });
});
export const updateDivision = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await updateDivisionService(id, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Division updated",
        data: result,
    });
});

export const deleteDivision = asyncHandler(async (req: Request, res: Response) => {
    const result = await deleteDivisionService(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Division deleted",
        data: result,
    });
});