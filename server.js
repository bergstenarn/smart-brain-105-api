const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const DB_USER = process.env.DB_USER || "dummy_db_user";
const DB_PASSWORD = process.env.DB_PASSWORD || "dummy_db_password";

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: DB_USER,
    password: DB_PASSWORD,
    database: "smart-brain-105-db",
  },
});

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("I'm here");
});

app.post("/signin", (req, res) => signin.handleSignin(req, res, db, bcrypt));
app.post("/register", (req, res) =>
  register.handleRegister(req, res, db, bcrypt)
);
app.get("/profile/:id", (req, res) => profile.handleProfileGet(res, req, db));
app.put("/image", (req, res) => image.handleImage(req, res, db));
app.post("/imageurl", (req, res) => image.handleApiCall(req, res));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
