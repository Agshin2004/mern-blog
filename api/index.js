import express, { json } from 'express';
import { configDotenv } from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import User from './models/UserModel.js';
import Post from './models/PostModel.js';
import { handleFileSave } from './utils/utils.js';

const app = express();
configDotenv();

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

// parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Must set credentials to true so cookie will be sent with every request without any issue
app.use(cors({ credentials: true, origin: 'http://localhost:3000/' }));
app.use(cookieParser());

// TODO: Write better solution \\public - BAD PRACTICE
app.use(express.static(path.join(__dirname + '\\public'))); // Serving static files
const uploadMiddleware = multer({ dest: 'public/uploads' });

mongoose.connect(
    'mongodb+srv://lenaklenke31:mFEyvAzwty6lAtNL@cluster0.61zkc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
);

const secretKey = 'mySecretKey';

app.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, 10),
        });

        res.json({
            data: userDoc,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username: username });

    if (userDoc && bcrypt.compareSync(password, userDoc.password)) {
        // Log in user
        const jsonToken = jwt.sign(
            {
                id: userDoc._id,
                username,
            },
            secretKey
        );

        const maxAge = 14 * 24 * 60 * 60 * 1000; // 14 days
        return res.cookie('jsonwebtoken', jsonToken, { maxAge }).json({
            id: userDoc._id,
            username: userDoc.username,
        });
    }

    res.status(400).json({ message: 'username or password is wrong.' });
});

app.get('/profile', (req, res) => {
    // Getting token from the client that sent the request
    const { jsonwebtoken } = req.cookies;

    if (!jsonwebtoken) {
        res.json('not logged in');
    }
    // jwt token can only be verified using the secret key that was assigned when creating it thus can only be verified on backend
    jwt.verify(jsonwebtoken, secretKey, {}, (err, info) => {
        if (err) throw err;

        // Since this view is gonna be called with each request, we send back user's data if logged in
        // So it can be saved in context
        res.json(info);
    });
});

app.post('/logout', (req, res) => {
    // res.cookie('jsonwebtoken', 'loggedout');
    res.clearCookie('jsonwebtoken');
    res.status(200).json({ status: 'success' });
});

app.get('/post', async (req, res) => {
    try {
        const posts = await Post.find({})
            .populate({
                path: 'author',
                select: '-password',
            })
            .limit(20)
            .sort({ createdAt: 'desc' }); // criteria can be asc, desc, ascending, descending, 1, or -1

        res.status(200).json(posts);
    } catch (err) {
        res.json(err);
    }
});

app.post('/post', uploadMiddleware.single('photo'), async (req, res) => {
    // Handling File
    const fileExt = handleFileSave(req);

    const { jsonwebtoken } = req.cookies;

    jwt.verify(jsonwebtoken, secretKey, {}, async (err, info) => {
        if (err) throw err;

        const { title, summary, content } = req.body;

        const createdPost = await Post.create({
            title,
            summary,
            content,
            // TODO: Refactor to better solution
            img: `uploads/${req.file.filename}.${fileExt}`,
            author: info.id,
        });

        res.status(200).json({ post: createdPost });
    });
});

app.get('/post/:id', async (req, res) => {
    const { id: postId } = req.params;

    try {
        //  Same as .find({ _id: postId })
        const post = await Post.findById(postId).populate({
            path: 'author',
            select: '-password',
        });

        res.json({
            post,
        });
    } catch (err) {
        res.json(err);
    }
});

app.patch('/post/:id', uploadMiddleware.single('photo'), async (req, res) => {
    let newFile = false;
    let filename = null;
    let fileExt = null;
    if (req.file) {
        fileExt = handleFileSave(req);
        filename = req.file.filename;
        newFile = true;
    }

    const { jsonwebtoken } = req.cookies;
    jwt.verify(jsonwebtoken, secretKey, {}, async (err, info) => {
        if (err) throw err;

        const { id, title, summary, content } = req.body;
        const postDoc = await Post.findById(id);
        // postDoc.author is id reference to UserModel
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id); // wrapper to JSON.stringify() because postDoc.author return ObjectId instance

        if (!isAuthor) {
            res.status(400).json({
                status: 'fail',
                message: 'You are not OP.',
            });
        }

        await postDoc.updateOne({
            title,
            summary,
            content,
            // TODO: Write better solution
            img: newFile ? `uploads/${filename}.${fileExt}` : postDoc.img,
        });

        res.json(postDoc);
    });
});

app.delete('/post/:id', async (req, res) => {
    try {
        const { id: postId } = req.params;

        // TODO: Verify document belongs to user
        await Post.findByIdAndDelete(postId);

        res.status(204).json({ status: 'success' });
    } catch (err) {
        res.status(400).json(err);
    }
});

app.listen(process.env.PORT, () => console.log(`Running on port ${process.env.PORT}`));
