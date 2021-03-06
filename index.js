// implement your API here
const express = require("express");
const cors = require("cors");

const server = express();
const db = require("./data/db.js");

server.use(express.json());
server.use(cors());

const PORT = process.env.PORT || 8080;

server.get("/api/users/", (req, res) => {
  //console.log(res)
  db.find()
    .then(result => res.json(result))
    .catch(err =>
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." })
    );
});

server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then(user => {
      if (!user)
        res
          .status(404)
          .json({ error: "The user with the specified ID does not exist." });
      else res.json(user);
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." })
    );
});

server.post("/api/users/", (req, res) => {
  if (!req.body.name || !req.body.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else
    db.insert(req.body)
      .then(newUser => res.status(201).json(newUser))
      .catch(err =>
        res.status(500).json({
          error: "There was an error while saving the user to the database."
        })
      );
});

server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  db.remove(id)
    .then(user => {
      if (!user)
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exists." });
      else res.json(user);
    })
    .catch(err =>
      res.status(500).json({ error: "The user could not be removed." })
    );
});

server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;

  if (!req.body.name && !req.body.bio) {
    console.log("Wrong info");
    res
      .status(400)
      .json({ errorMessage: "Please provide a name or bio for the user." });
  } else
    db.update(id, req.body)
      .then(user => {
        console.log("In request");
        if (!user)
          res.status(404).json({
            message: "The user with the specified ID does not exists. "
          });
        res.json(user);
      })
      .catch(err =>
        res
          .status(500)
          .json({ error: "The user information could not be modified." })
      );
});

// only runs in productions
if (process.env.NODE_ENV === "production") {
  // Express will serve up production assests
  // like our main.js file or main.css
  try {
    server.use(express.static("user-app/build"));

    // Express will serve up the index.html file
    // if it doesn't recognize the route
    const path = require("path");
    server.get("*", (req, res) => {
      console.log("Made it here");
      res.sendFile(path.resolve(__dirname, "user-app", "build", "index.html"));
    });
  } catch (err) {
    console.log(err);
  }
}

server.listen(PORT, () => {
  console.log("Starting server...");
});
