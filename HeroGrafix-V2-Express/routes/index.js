var express = require("express");
var router = express.Router();
const pool = require("./db"); // Import the pool object from the file where you defined the database connection

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: " Eternal Wellness" });
});

router.get("/example", (req, res) => {
  // Execute a database query
  pool.query("SELECT * FROM questions", (err, result) => {
    if (err) {
      console.error("Error executing query", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    // Send the first question back to the client
    if (result.rows.length > 0) {
      console.log(result.rows[0].text);
      res.send(result.rows[0].text);
    } else {
      res.status(404).send("No questions found");
    }
  });
});
module.exports = router;
