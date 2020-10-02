const userController = require("../controller/userController");
const {
  adminMiddle
} = require("../middleware/admin");
const { isCompany } = require('../middleware/company')
const {
  protect
} = require("../middleware/auth");

const CreateUserRoutes = (router) => {
  router.route("/users").post(userController.new);
  router.route("/users/resetPassword").post(userController.resetPassword);
  router.route("/users/updatePassword").post(protect, userController.updatePassword);
  router.route("/users/validResetPassword").post(userController.validResetPassword);
  router.route("/users/checkPassword").post(protect, userController.checkPassword);

  router.route("/users").get(adminMiddle, userController.allUsers);
  router.route("/users/login").post(userController.login);
  router.route("/users/logout").post(userController.logout);
  router.route("/users/checkSession").post(userController.checkSession);
  router.route("/users/validate").post(userController.validate);
  router.route("/users/delete").post(protect, userController.delete);
  router.route("/users/deleteuser").post(protect, userController.deleteUser);
  router.route("/users/allEmployees").get(protect, userController.allEmployees);
  router.route("/users/loginViaGmail").post(userController.loginViaGmail);
  router
    .route("/users/createAdmin")
    .post(adminMiddle, userController.createAdmin);
  router
    .route("/users/employee")
    .post(protect, userController.createEmployee);
  router.route("/users/logs").get(isCompany, userController.allLogs);


  return router;
};

// Export API routes
module.exports = CreateUserRoutes;