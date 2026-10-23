import mongoose from "mongoose";

// Only `url` reaches the client. The rest is Cloudinary bookkeeping: select: false keeps it out
// of every query (lean and populate too), and the toJSON transform keeps it out of documents
// sent straight from memory. Code that needs publicId asks for it: `+avatar.publicId`.
// An inclusive select that names the whole object ("avatar") brings every field back, so
// select "avatar.url" instead.
const hidden = { select: false };

const mediaSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            default: "",
        },
        publicId: {
            type: String,
            default: "",
            ...hidden,
        },
        originalName: {
            type: String,
            default: "",
            ...hidden,
        },
        directory: {
            type: String,
            default: "",
            ...hidden,
        },
        format: {
            type: String,
            default: "",
            ...hidden,
        },
        bytes: {
            type: Number,
            default: 0,
            ...hidden,
        },
    },
    {
        _id: false, // Prevents creating an _id for embedded documents
    }
);

mediaSchema.set("toJSON", {
    transform: (_doc, ret: Record<string, unknown>) => ({ url: ret.url }),
});

export default mediaSchema;
