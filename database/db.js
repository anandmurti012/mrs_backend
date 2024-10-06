const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//   } else {
//     console.log('Connected to MySQL');
//   }
// });

// module.exports = connection;

const pool = mysql.createPool({
  connectionLimit: 10, // Adjust the limit based on your application's requirements
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err.sqlMessage || err);
    return;
  }
  console.log("Database successfully connected.");
  connection.release(); // Release the connection back to the pool
});

const connection = pool;
module.exports = connection;
