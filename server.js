const express = require('express');
const app = express();
const port = 3600;
const cors = require('cors');
const mysql = require('mysql2');
app.use(express.json());
app.use(cors());

// MySQL Database connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Update with your MySQL username
  password: 'S@nju0909', // Update with your MySQL password
  database: 'libraryApp', // Update with your database name
});

const promisePool = pool.promise(); // Enable promise support

// Endpoint for admin signup (storing in DB)
app.post('/admin/Signup', async (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).send('Signup unsuccessful, need name, email, and role');
  }

  try {
    const [rows] = await promisePool.query(
      'INSERT INTO ignup (id, name, email, role) VALUES (?, ?, ?, ?)',
      [name, email, role]
    );
    console.log('Admin registered with ID:', rows.insertId);
    res.status(201).send({ message: 'Signup Successful', id: rows.insertId });
  } catch (error) {
    console.error('Error inserting admin into DB:', error);
    res.status(500).send('Internal server error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
