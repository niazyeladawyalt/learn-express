import mysql from 'mysql2';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'learn_express',
});

export default pool.promise();
