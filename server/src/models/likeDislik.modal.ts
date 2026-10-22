import mongoose from "mongoose";


const likeDislikeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    thumbnailId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thumbnail",
        required: true
    },

}, { timestamps: true });

likeDislikeSchema.index(
    { userId: 1, thumbnailId: 1 },
    { unique: true }
);

export default mongoose.model("LikeDislike", likeDislikeSchema);