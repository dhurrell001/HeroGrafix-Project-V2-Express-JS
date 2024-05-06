var express = require("express");
var router = express.Router();
const pool = require("./db"); // Import the pool object from the file where you defined the database connection
const { getUser, setCurrentUser } = require("./userFunctions"); // Import getUser and setCurrentUser from userFunctions

router.use(setCurrentUser); //get user from middleware function in userFunctions

router.get("/", function (req, res, next) {
  const firstQuestionId = 1;
  res.redirect(`/users/answer/${firstQuestionId}`);
});

// router.get("/answer", (req, res) => {
//   // Execute a database query
//   console.log(req.currentUser.email);
//   pool.query("SELECT * FROM questions", (err, result) => {
//     if (err) {
//       console.error("Error executing query", err);
//       res.status(500).send("Internal Server Error");
//       return;
//     }
//     // Send the first question back to the client
//     if (result.rows.length > 0) {
//       console.log(result.rows[0].text);
//       res.render("question.ejs", {
//         title: " Eternal Wellness",
//         question: result.rows[1].text,
//         questionId: result.rows[1].id,
//       });
//     } else {
//       res.status(404).send("No questions found");
//     }
//   });
// });

router.get("/answer/:questionId", (req, res) => {
  const { questionId } = req.params; // extract the question ID from url
  console.log("here");
  // Execute a database query to get the question text
  pool.query(
    "SELECT * FROM questions WHERE id = $1",
    [questionId],
    (err, result) => {
      if (err) {
        console.error("Error executing query", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      // Send the question text back to the client
      if (result.rows.length > 0) {
        const questionText = result.rows[0].text;
        res.render("question.ejs", {
          title: "Eternal Wellness",
          question: questionText,
          questionId: questionId,
        });
      } else {
        res.status(404).send("Question not found");
      }
    }
  );
});
router.post("/answer/:questionId", (req, res) => {
  //extract details for request body
  const { answer, questionId } = req.body;
  // Convert questionId to an integer (assuming it's supposed to be an integer)
  const questionIdInt = parseInt(questionId);

  // Check if the conversion was successful
  if (isNaN(questionIdInt)) {
    // If conversion failed, return an error response
    res.status(400).send("Invalid question ID");
    return;
  }
  //create a new db query to add answer to answer table
  pool.query(
    "INSERT INTO answers (question_id, user_id,text) VALUES ($1,$2,$3)",
    [questionId, 5, answer],
    (err, result) => {
      if (err) {
        console.error("Error inserting answer", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      // Redirect to the next question page
      const nextQuestionId = questionIdInt + 1; // Assuming the next question ID follows a sequential order
      if (nextQuestionId > 2) {
        console.log(nextQuestionId);
        res.redirect("/");
      } else {
        res.redirect(`/users/answer/${nextQuestionId}`);
      }
    }
  );
});
module.exports = router;
