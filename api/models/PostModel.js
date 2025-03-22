import { Schema, model } from 'mongoose';

const PostSchema = Schema(
    {
        title: String,
        summary: String,
        content: String,
        img: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true,
    }
);

const Post = model('Post', PostSchema);

export default Post;
