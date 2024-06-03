require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000

const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
})

app.get("/", (req,res) => { 
    res.send("Success")
})


app.get('/contact', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM contact'); // replace with your table name
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

app.post("/contact", async(req,res) => { 
    try { 
        const query = 'INSERT INTO "contact" ("FirstName", "LastName", "Email", "Phone", "Account") VALUES ($1, $2, $3, $4, $5) RETURNING *';

        const pgQuery = await pool.query(query, ["Lawrence", "Ho", "lho@gmail.com", "123-456-7890", "001Hu00002yZz7tIAC"]);
        console.log(pgQuery.rows[0]);
        res.status(201).send(`Added ${pgQuery.rows.length} contact`)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
})

// delete by ID
app.delete("/contact", async(req,res) => { 
    const id = req.query.id
    if (!id ) { 
        return res.status(400).send("Invalid Id")
    }

    try { 
        const query = 'DELETE FROM "contact" WHERE id = $1'
        const pgQuery = await pool.query(query, [id]);
        if (pgQuery.rowCount === 0) {
            res.status(404).send('Contact not found');
          } else {
            res.status(200).send(`Deleted contact with ID ${id}`);
          }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
})


  app.get('/inventory', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM inventory'); // replace with your table name
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  

app.listen(port, () => { 
    console.log(`Listening on port ${port}`)
})



