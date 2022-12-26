import * as dotenv from 'dotenv'
dotenv.config()

import express from "express";
import cors from "cors";
import multer from "multer";
import mongoose from "mongoose";
import {registerValidation, loginValidation, postCreateValidation} from "./validations/validations.js";
import {checkAuth, handleValidationErrors} from "./utils/index.js";
import {UserController, PostController} from "./controllers/index.js";

mongoose
	.connect(
		`mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@cluster0.uvswtui.mongodb.net/blog?retryWrites=true&w=majority`
	)
	.then(() => console.log('DB ok'))
	.catch((err) => console.log(`DB error ${err}`))

const PORT = process.env.PORT || 5000;
const app = express();

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads');
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	}
})

const upload = multer({storage});

app.use(express.json())
app.use(cors());
app.use('/uploads', express.static('uploads'))

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	})
})

app.get('/posts', PostController.getAll);
app.get('/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);


app.listen(PORT, (err) => {
	if (err) {
		return console.log(err)
	}
	
	console.log(`Server started on PORT: ${PORT}`)
})

