const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
	console.log("UNCAUGHT EXCEPTION! Shutting down...");
	console.log(err.name, err.message);
	process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

const password = process.env.DATABASE_PASSWORD;
const DB = process.env.DATABASE.replace("<db_password>", password);

mongoose.connect(DB).then((con) => {
	// console.log(con.connections);
	console.log("DB connection successfully!!");
});

const port = process.env.PORT || 8000;

const server = app.listen(port, (err) => {
	if (err) {
		return console.log("Something bad happened", err);
	}
	console.log(`Server is listening on ${port}`);
});

process.on("unhandledRejection", (err) => {
	console.log("UNHANDLED REJECTION! Shutting down...");
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});
