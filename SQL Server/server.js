const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database");
const cors = require("cors");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const auth = require("./Middleware/Auth");

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ ErrorType: "Field", ErrorMessage: "All blanks must be filled." });
  }

  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {
      if (err) {
        console.error("Error querying SQLite database:", err.message);
        return res
          .status(500)
          .json({ ErrorType: "Database", ErrorMessage: "Database error." });
      }

      if (!user) {
        return res.status(400).json({
          ErrorType: "Field",
          ErrorMessage: "Please enter a valid username, password",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          ErrorType: "Field",
          ErrorMessage: "Please enter a valid password",
        });
      }

      const token = jwt.sign({ id: user.id }, "melih");
      res.json({
        success: true,
        user: { id: user.id, username: user.username },
        token: token,
      });
    }
  );
});

app.post("/register", async (req, res) => {
  const { mail, username, password } = req.body;

  if (!mail || !username || !password) {
    return res
      .status(400)
      .json({
        ErrorType: "Field",
        ErrorMessage: "Please enter a valid email, username, password",
      });
  }

  // Şifreyi hashleme
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  // Veritabanında email kontrolü
  db.get("SELECT * FROM users WHERE email = ?", [mail], (err, existingUser) => {
    if (err) {
      console.error("Error querying SQLite database:", err.message);
      return res
        .status(500)
        .json({ ErrorType: "Database", ErrorMessage: "Database error." });
    }

    if (existingUser) {
      db.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, existingUsername) => {
          if (err) {
            console.error("Error querying SQLite database:", err.message);
            return res
              .status(500)
              .json({ ErrorType: "Database", ErrorMessage: "Database error." });
          }

          if (existingUsername) {
            return res.status(400).json([
              { ErrorType: "Email", ErrorMessage: "Email already taken." },
              {
                ErrorType: "Username",
                ErrorMessage: "The username is already taken.",
              },
            ]);
          } else {
            return res
              .status(400)
              .json({
                ErrorType: "Email",
                ErrorMessage: "Email already taken.",
              });
          }
        }
      );
    } else {
      // Veritabanında username kontrolü
      db.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, existingUsername) => {
          if (err) {
            console.error("Error querying SQLite database:", err.message);
            return res
              .status(500)
              .json({ ErrorType: "Database", ErrorMessage: "Database error." });
          }

          if (existingUsername) {
            return res
              .status(400)
              .json({
                ErrorType: "Username",
                ErrorMessage: "The username is already taken.",
              });
          } else {
            // Kullanıcı kaydı ekleme
            db.run(
              "INSERT INTO users (email, username, password) VALUES (?, ?, ?)",
              [mail, username, passwordHash],
              function (err) {
                if (err) {
                  console.error(
                    "Error inserting into SQLite database:",
                    err.message
                  );
                  return res
                    .status(500)
                    .json({
                      ErrorType: "Database",
                      ErrorMessage: "Database error.",
                    });
                }

                return res.json({ success: true, id: this.lastID });
              }
            );
          }
        }
      );
    }
  });
});

app.get("/log", auth, (req, res) => {
  const userId = req.user; // auth middleware'den gelen kullanıcı ID'si

  if (!userId) {
    return res
      .status(400)
      .json({ ErrorType: "Auth", ErrorMessage: "Invalid user ID." });
  }

  // SQLite'dan kullanıcıyı ID'ye göre sorgulama
  db.get("SELECT * FROM users WHERE id = ?", [userId], (err, user) => {
    if (err) {
      console.error("Error querying SQLite database:", err.message);
      return res
        .status(500)
        .json({ ErrorType: "Database", ErrorMessage: "Database error." });
    }

    if (!user) {
      return res
        .status(404)
        .json({ ErrorType: "NotFound", ErrorMessage: "User not found." });
    }

    // Kullanıcı bilgilerini döndürme
    res.json({
      Id: user.id,
      EMail: user.email,
      username: user.username,
    });
  });
});
app.post("/loggedIn", async (req, res) => {
  try {
    const token = req.header("x-auth-token");

    if (!token) return res.json(false);

    jwt.verify(token, "melih");

    res.send(true);
  } catch (err) {
    res.json(false);
  }
});

app.get("/", async (req, res) => {
  res.send("API Working");
});

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});
