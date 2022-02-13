const handleRegister = (req, res, db, bcrypt) => {
  console.log("handleRegister");

  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json("Incorrect form submission.");
  }

  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    trx
      .insert(
        {
          hash,
          email,
        },
        "email"
      )
      .into("login")
      .then((emails) => {
        trx
          .insert(
            {
              email: emails[0].email,
              name,
              joined: new Date(),
            },
            "*"
          )
          .into("users")
          .then((users) => {
            res.json(users[0]);
          })
          .catch((err) => res.status(400).json("Unable to register"));
      })
      .then(trx.commit)
      .catch((err) => {
        trx.rollback();
        res.status(400).json("Unable to register");
      });
  });
};

module.exports = {
  handleRegister,
};
