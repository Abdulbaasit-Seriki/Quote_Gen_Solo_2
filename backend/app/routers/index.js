const router = require("express").Router();
const CreateUserRoutes = require("./userRoutes");
const CreateMailRoutes = require("./mailRouter");
const CreateCompanyRoutes = require("./companyRouter");
const CreateFileRouter = require("./fileRouter");

let allRoutes = CreateUserRoutes(router)
allRoutes = CreateMailRoutes(allRoutes)
allRoutes = CreateCompanyRoutes(allRoutes)
allRoutes = CreateFileRouter(allRoutes)


module.exports = allRoutes;
