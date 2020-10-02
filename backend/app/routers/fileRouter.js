const fileController = require("../controller/fileController")

const CreateMailRoutes = router => {
    router.route("/getLogo/:logo").get(fileController.getLogo);
    router.route("/getPrices/:prices").get(fileController.getPrices);
    return router;
};

// Export API routes
module.exports = CreateMailRoutes;
