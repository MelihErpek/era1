const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require("bcryptjs");
const auth = require("./Middleware/Auth");
var jwt = require("jsonwebtoken");
const Event = require("./Models/Events");

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 100000000,
  })
);
let port = 5001;
const url =
  "mongodb+srv://melihnode:meliherpek1@cluster0.g1oel.mongodb.net/osi?&w=majority";
mongoose.set("strictQuery", true);
mongoose.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      throw err;
    }
    console.log("Mongoose ile bağlantı kuruldu.");
  }
);

app.get("/", async (req, res) => {
  res.send("API Working");
});

app.post("/eventadd", async (req, res) => {
  const { eventName, eventDate, eventDescription, url, id } = req.body;

  const date = new Date(eventDate);

  // Gün, ay ve yılı formatla
  const day = String(date.getDate()).padStart(2, "0"); // 2 haneli gün
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Aylar 0'dan başlar, bu yüzden +1 eklenir
  const year = date.getFullYear();

  // İstediğiniz formatta birleştir
  const formattedDate = `${day}-${month}-${year}`;
  if (!eventName || !eventDate || !eventDescription || !url) {
    res.status(400);
    res.json({
      ErrorType: "Field",
      ErrorMessage: "All blanks must be filled.",
    });
  } else {
    await Event.create({
      eventName,
      eventDate: formattedDate,
      eventDescription,
      url,
      owner: id,
    });
    res.json({ success: true });
  }
});
app.get("/events", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});
app.post("/myevents", async (req, res) => {
  const { id } = req.body;
  const events = await Event.find({ owner: id });

  res.json(events);
});
app.post("/findevent", async (req, res) => {
  const { id } = req.body;
  const event = await Event.findById(id);

  if (event) {
    res.json(event);
  } else {
    res.status(400);
    res.json({
      ErrorType: "EventDontExist",
      ErrorMessage: "There is no event with that name.",
    });
  }
});

app.post("/eventupdate", async (req, res) => {
  const { eventName, eventDate, eventDescription, url, id } = req.body;
  if (!eventName || !eventDate || !eventDescription || !url) {
    res.status(400);
    res.json({
      ErrorType: "Field",
      ErrorMessage: "All blanks must be filled.",
    });
  }

  await Event.findByIdAndUpdate(id, {
    eventName,
    eventDate,
    eventDescription,
    url,
  });
  res.json({ success: true });
});
app.post("/eventremove", async (req, res) => {
  const { id } = req.body;

  await Event.findByIdAndRemove(id);

  res.json({ success: true });
});

app.post("/addcomment", async (req, res) => {
  const { id, newComment, username } = req.body;
  const event = await Event.findById(id.id);
  if (event) {
    // Yeni bir yorum nesnesi ekliyoruz
    event.comments.push({
      username,
      comment: newComment,
    });
    await event.save();
    console.log("Comment added:", event);
  } else {
    console.log("Event not found");
  }
  res.json({ success: true });
});
app.post("/getcomment", async (req, res) => {
  const { id } = req.body;
  const event = await Event.findById(id.id);
  const comments = event.comments;
  res.json({ comments });
});

app.post("/addpart", async (req, res) => {
  const { id, cid } = req.body;
  const event = await Event.findById(id);
  if (event) {
    // Yeni bir yorum nesnesi ekliyoruz
    event.participants.push({
      cid,
    });
    await event.save();
    console.log("Comment added:", event);
  } else {
    console.log("Event not found");
  }
  res.json({ success: true });
});

app.post("/getpart", async (req, res) => {
  const { id, cid } = req.body;
  const event = await Event.findById(id);
  const parts = event.participants;
  let boolean = false;
  parts.map((index) => {
    if (index.cid === cid) {
      boolean = true;
    }
  });
  if (boolean) {
    res.json({ success: true });
  }
  // res.json({ comments });
});

app.listen(port);
