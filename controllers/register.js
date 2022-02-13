const handleRegister = (req, res, db, bcrypt) => {
  console.log("handleRegister 1");

  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json("Incorrect form submission.");
  }

  const hash = bcrypt.hashSync(password);
  console.log("handleRegister 2");
  db.transaction((trx) => {
    console.log("handleRegister 3");
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
        console.log("handleRegister 4");
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
            console.log("handleRegister 5");
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
