const pool = require("./db");

// Function to retrieve the user from the database. The async/await mens that a result
// will not be returnded until the database query has finshed. I must use a async/await on the function call
// to make sure the 'promise' is completd before continuing the program
const getUser = async (userId) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);
    console.log("Result:", result.rows);
    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error retrieving user from the database:", error);
    throw error;
  }
};
// create a middleware function that adds the retrieved database user to the request object
// in the handler. this is then passed to request route i.e /answers
const setCurrentUser = async (req, res, next) => {
  try {
    const currentUser = await getUser(5); // Assuming you're retrieving user with id 5
    req.currentUser = currentUser;
    next();
  } catch (error) {
    console.error("Error retrieving current user:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { getUser, setCurrentUser };
