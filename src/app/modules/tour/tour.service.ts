import { QueryBuilder } from "../../utils/QueryBuilder";
import { tourSearchableFields } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";

export const createTourService = async (payload: ITour) => {
    const existingTour = await Tour.findOne({ title: payload.title });
    if (existingTour) {
        throw new Error("A tour with this title already exists.");
    }

    // const baseSlug = payload.title.toLowerCase().split(" ").join("-")
    // let slug = `${baseSlug}`

    // let counter = 0;
    // while (await Tour.exists({ slug })) {
    //     slug = `${slug}-${counter++}` // dhaka-division-2
    // }

    // payload.slug = slug;

    const tour = await Tour.create(payload)

    return tour;
};

export const getAllToursService = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Tour.find(), query)

    const tours = await queryBuilder
        .search(tourSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate()

    // const meta = await queryBuilder.getMeta()

    const [data, meta] = await Promise.all([
        tours.build(),
        queryBuilder.getMeta()
    ])


    return {
        data,
        meta
    }
};

export const updateTourService = async (id: string, payload: Partial<ITour>) => {

    const existingTour = await Tour.findById(id);

    if (!existingTour) {
        throw new Error("Tour not found.");
    }

    // if (payload.title) {
    //     const baseSlug = payload.title.toLowerCase().split(" ").join("-")
    //     let slug = `${baseSlug}`

    //     let counter = 0;
    //     while (await Tour.exists({ slug })) {
    //         slug = `${slug}-${counter++}` // dhaka-division-2
    //     }

    //     payload.slug = slug
    // }

    if (payload.images && payload.images.length > 0 && existingTour.images && existingTour.images.length) {
        payload.images = [...payload.images, ...existingTour.images];
    };

    if (payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0) {
        const restDBImages = existingTour.images.filter(
            (imageUrl) => !payload.deleteImages?.includes(imageUrl)
        );

        const updatedPayloadImages = (payload.images || [])
            .filter((imageUrl) => !payload.deleteImages?.includes(imageUrl))
            .filter((imageUrl) => !restDBImages.includes(imageUrl));

        payload.images = [...restDBImages, ...updatedPayloadImages];
    };

    const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });

    if (payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0) {
        await Promise.all(payload.deleteImages.map(
            (imageUrl) => deleteImageFromCloudinary(imageUrl)
        ));
    };

    return updatedTour;
};

export const deleteTourService = async (id: string) => {
    return await Tour.findByIdAndDelete(id);
};

export const createTourTypeService = async (payload: ITourType) => {
    // const existingTourType = await TourType.findOne({ name: payload.name });
    const existingTourType = await TourType.findOne({ name: payload });

    if (existingTourType) {
        throw new Error("Tour type already exists.");
    }

    // return await TourType.create({ name: payload.name });
    return await TourType.create({ name: payload });
};

export const getAllTourTypesService = async () => {
    return await TourType.find();
};

export const updateTourTypeService = async (id: string, payload: ITourType) => {
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }

    const updatedTourType = await TourType.findByIdAndUpdate(id, payload, { new: true });
    return updatedTourType;
};

export const deleteTourTypeService = async (id: string) => {
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }

    return await TourType.findByIdAndDelete(id);
};