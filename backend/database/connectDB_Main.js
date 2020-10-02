const mongoose = require("mongoose");
const insertData = require("./seeder");
const User = require("../app/models/userModel");
const ErrorClass = require("../app/utils/ErrorClass");
const CatchAsync = require("../app/utils/CatchAsync");

//  @Connect Mongo

const withSeeding = false;
const databaseConnectApp = process.env.MONGO_URL;
const environment = process.env.NODE_ENV;
let host = "";
const connectDataBase = async () => {
  connection = await mongoose.connect(databaseConnectApp, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  host = connection.connection.host;
};

const connectDB = CatchAsync.CatchAsync(async (next) => {
  if (environment === "development") {
    await connectDataBase();
  } else if (environment === "development_eric") {
    await connectDataBase();
  } else {
    await connectDataBase();
  }
  console.log(`Database Connected: ${host}`);
  if (withSeeding) {
    insertData("./database/users.json", User);
  }
}, 500);

module.exports = connectDB;
//Connect Mongoose=============================
