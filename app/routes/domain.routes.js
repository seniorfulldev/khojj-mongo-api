const { authJwt } = require("../middleware");
const controller = require("../controllers/domain.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/domain/leads-email", controller.leadsEamil);

  app.post("/api/domain/crawl-email", controller.crawlEamil);

  // app.post(
  //   "/api/domain/crawl-email",
  //   [authJwt.verifyToken],
  //   controller.crawlEamil
  // );
};
