const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 10, // Adjust the limit based on your application's requirements
  host: '172.105.48.130',
  user: 'collegec_mrshospital',
  password: 'm2qgKxu?!~ly',
  database: 'collegec_mrs_hospital',
  multipleStatements: true
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err.sqlMessage || err);
    return;
  }
  console.log('Database successfully connected.');
  connection.release(); // Release the connection back to the pool
});

const connection = pool;
module.exports = connection;