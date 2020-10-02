const express = require("express");
const formData = require("express-form-data");
const apiRoutes = require("./app/routers");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const ErrorHandling = require("./app/utils/ErrorHandling");

dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//  @Database Connection
const connectDB = require("./database/connectDB_Main");
connectDB();

app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use("/static",express.static("prices"))
app.use(cors());
//  @apiRoutes

app.use("/api", apiRoutes);

app.use(ErrorHandling);

app.get("/", (req, res) => res.send("Hello World with Express"));
const port = process.env.PORT || 8888;
app.listen(port, () => console.log("Running RestHub on port " + port));
