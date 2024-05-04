var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("question.ejs", { title: " Eternal Wellness" });
});

module.exports = router;
