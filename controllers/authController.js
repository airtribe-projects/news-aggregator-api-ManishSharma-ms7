const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const bcrypt = require("bcryptjs");

const signToken = (id) => {
	return jwt.sign(
		{
			id,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_EXPIRES_IN,
		}
	);
};

exports.register = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
	});

	const token = signToken(newUser._id);
	res.status(201).json({
		status: "success",
		token,
		data: {
			user: newUser,
		},
	});
});

exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	// check if email and password exist
	if (!email || !password) {
		return next(new AppError("Please provide email and password!", 400));
	}

	const user = await User.findOne({ email }).select("+password");
	const correct = await user.correctPassword(password, user.password);

	if (!user || !correct) {
		return next(new AppError("Incorrect email or password provided!", 401));
	}

	const token = signToken(user._id);
	res.status(200).json({
		status: "success",
		token,
	});
});

exports.protect = catchAsync((req, res, next) => {
	const {authorization} = req.headers;
	console.log(authorization);
	let token;

	if (authorization && authorization.startsWith("Bearer")) {
		token = authorization.split(" ")[1];
	}

	if (!token) {
		return next(new AppError("You are not logged in. Please log in to get access.", 401));
	}
	next();
});
