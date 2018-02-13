const router = require("express").Router();
const testdataController = require("../../controllers/testdataController");

// Matches with "/api/biodiversity"
router.route("/")
  .get(testdataController.findAll)
  .post(testdataController.create);

// Matches with "/api/biodiversity/:id"
router
  .route("/:id")
  .get(testdataController.findById)
  .put(testdataController.update)
  .delete(testdataController.remove);

module.exports = router;