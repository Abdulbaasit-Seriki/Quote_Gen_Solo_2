const companyController = require("../controller/companyController");
const { protect } = require("../middleware/auth");
const { adminMiddle } = require("../middleware/admin");

const CreateCompanyRoutes = (router) => {
  router.route("/company").post(companyController.new);
  router.route("/company/:id").get(adminMiddle, companyController.company);
  router.route("/companies").get(adminMiddle, companyController.companies);
  router.route("/company/profile").post(companyController.profile);
  router
    .route("/company/resendValidateEmail")
    .post(protect, companyController.resendValidateEmail);
  router.route("/company/updatePrices").post(companyController.updatePrices);
  router
    .route("/company/sendTestEmail")
    .post(protect, companyController.sendTestEmail);
router.route("/company/increase").post(protect, companyController.increase);

  return router;
};

// Export API routes
module.exports = CreateCompanyRoutes;
