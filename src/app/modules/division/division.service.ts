import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";

export const createDivisionService = async (payload: IDivision) => {

    const existingDivision = await Division.findOne({ name: payload.name });
    if (existingDivision) {
        throw new Error("A division with this name already exists.");
    }

    // const baseSlug = payload.name.toLowerCase().split(" ").join("-")
    // let slug = `${baseSlug}-division`

    // let counter = 0;
    // while (await Division.exists({ slug })) {
    //     slug = `${slug}-${counter++}` // dhaka-division-2
    // }

    // payload.slug = slug;

    const division = await Division.create(payload);

    return division
};

export const getAllDivisionsService = async () => {
    const divisions = await Division.find({});
    const totalDivisions = await Division.countDocuments();
    return {
        data: divisions,
        meta: {
            total: totalDivisions
        }
    }
};

export const getSingleDivisionService = async (slug: string) => {
    const division = await Division.findOne({ slug });
    return {
        data: division,
    }
};

export const updateDivisionService = async (id: string, payload: Partial<IDivision>) => {
    const existingDivision = await Division.findById(id);
    if (!existingDivision) {
        throw new Error("Division not found.");
    }

    const duplicateDivision = await Division.findOne({
        name: payload.name,
        _id: { $ne: id },
    });

    if (duplicateDivision) {
        throw new Error("A division with this name already exists.");
    }

    // if (payload.name) {
    //     const baseSlug = payload.name.toLowerCase().split(" ").join("-")
    //     let slug = `${baseSlug}-division`

    //     let counter = 0;
    //     while (await Division.exists({ slug })) {
    //         slug = `${slug}-${counter++}` // dhaka-division-2
    //     }

    //     payload.slug = slug
    // }

    const updatedDivision = await Division.findByIdAndUpdate(id, payload, { new: true, runValidators: true });

    if (payload.thumbnail && existingDivision.thumbnail) {
        await deleteImageFromCloudinary(existingDivision.thumbnail);
    };

    return updatedDivision;
};

export const deleteDivisionService = async (id: string) => {
    await Division.findByIdAndDelete(id);
    return null;
};