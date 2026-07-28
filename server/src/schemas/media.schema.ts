import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            default: "",
        },
        publicId: {
            type: String,
            default: "",
        },
        originalName: {
            type: String,
            default: "",
        },
        directory: {
            type: String,
            default: "",
        },
        format: {
            type: String,
            default: "",
        },
        bytes: {
            type: Number,
            default: 0,
        },
    },
    {
        _id: false, // Prevents creating an _id for embedded documents
    }
);

export default mediaSchema;