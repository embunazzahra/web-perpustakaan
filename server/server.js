const express = require("express");
const app = express();
const { Client } = require("pg");
const bodyparser = require("body-parser");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type,Accept"
  );
  res.header("Access-Control-Allow-Methods", "POST,PUT,DELETE,OPTIONS,GET");
  next();
});

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

const client = new Client({
  host: "ivan-sbd.postgres.database.azure.com",
  user: "ivan_sbd",
  password: "Rahasia90",
  database: "website_perpustakaan",
  port: 5432,
  ssl: true,
});

connect();
async function connect() {
  try {
    await client.connect();
    console.log("connected to database..");
  } catch (e) {
    console.log(e);
  }
}

app.get("/anggota", async (req, res) => {
  try {
    const results = await client.query("SELECT * FROM anggota");
    res.json(results.rows);
    res.end();
  } catch (error) {
    console.log(error);
    res.send("something error");
  }
});

app.listen(4000, () => console.log("listening on port 4000"));
