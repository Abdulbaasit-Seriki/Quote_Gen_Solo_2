const userController = require("../controller/mailController");
const { protect } = require("../middleware/auth");

const CreateMailRoutes = (router) => {
  router.route("/mail").post(protect, userController.sendMail);
  router.route("/sendTestMail").post(protect, userController.sendMail);
  return router;
};

// Export API routes
module.exports = CreateMailRoutes;
