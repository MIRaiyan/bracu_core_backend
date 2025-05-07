const express = require("express");
const router = express.Router();
const thesisCtrl = require("../controllers/thesisController");
const auth = require("../middleware/authMiddleware");

console.log("Registering thesis routes...");

router.get("/", thesisCtrl.getAllThesisGroups);
console.log("Registered GET /api/thesis");

router.get("/by-gsuite", auth, thesisCtrl.getThesisByGsuite); // New route
console.log("Registered GET /api/thesis/by-gsuite");

router.get("/search/domain", thesisCtrl.searchByDomain);
console.log("Registered GET /api/thesis/search/domain");

router.post("/", auth, thesisCtrl.addThesisGroup);
console.log("Registered POST /api/thesis");

router.put("/:id", auth, thesisCtrl.updateThesisGroup);
console.log("Registered PUT /api/thesis/:id");

router.delete("/:id", auth, thesisCtrl.deleteThesisGroup);
console.log("Registered DELETE /api/thesis/:id");

module.exports = router;