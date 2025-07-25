import { Request, Response } from "express";
import { asyncHandler, sendResponse } from "../../utils";
import { createTourService, getAllToursService, updateTourService, deleteTourService, getAllTourTypesService, createTourTypeService, updateTourTypeService, deleteTourTypeService } from "./tour.service";
import { ITour } from "./tour.interface";

export const createTour = asyncHandler(async (req: Request, res: Response) => {
    const payload: ITour = {
        ...req.body,
        images: (req.files as Express.Multer.File[]).map(
            (file) => file.path
        )
    };
    
    const result = await createTourService(payload);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour created successfully',
        data: result,
    });
});

export const getAllTours = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query
    const result = await getAllToursService(query as Record<string, string>);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tours retrieved successfully',
        data: result.data,
        meta: result.meta,
    });
});

export const updateTour = asyncHandler(async (req: Request, res: Response) => {
    const payload: ITour = {
        ...req.body,
        images: (req.files as Express.Multer.File[]).map(
            (file) => file.path
        )
    };
    
    const result = await updateTourService(req.params.id, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour updated successfully',
        data: result,
    });
});

export const deleteTour = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await deleteTourService(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour deleted successfully',
        data: result,
    });
});

export const getAllTourTypes = asyncHandler(async (req: Request, res: Response) => {
    const result = await getAllTourTypesService();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour types retrieved successfully',
        data: result,
    });
});

export const createTourType = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.body;
    const result = await createTourTypeService(name);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour type created successfully',
        data: result,
    });
});

export const updateTourType = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    const result = await updateTourTypeService(id, name);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type updated successfully',
        data: result,
    });
});

export const deleteTourType = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await deleteTourTypeService(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type deleted successfully',
        data: result,
    });
});