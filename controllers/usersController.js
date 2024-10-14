const AppError = require("../utils/appError");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");

exports.getPreferences = catchAsync(async (req, res, next) => {
	const { email } = req.body;
	if (!email) {
		return next(new AppError("Invalid email", 400));
	}
	const user = await User.findOne({ email });
	console.log(user);
	res.status(200).json({
		status: "success",
		data: { user.preferences },
	});
});

exports.updatePreferences = (req, res, next) => {
	console.log("From updatePreference");
};
