const express = require("express");
const cors = require("cors");
const app = express();
const rateLimit = require("express-rate-limit");
const axios = require("axios");
require("dotenv").config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 1 minutes
  max: 20,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(
  cors({
    origin: process.env.HOST_URL,
  })
);
app.use(express.json());
app.use(limiter);
app.route("/api");

app.post("/subscribe", (req, res) => {
  const { email } = req.body;
  const text = `New entry: *${email}*`;

  try {
    axios.post(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.CHAT_ID,
        text: text,
        parse_mode: "markdown",
      }
    );
    return res.status(201).json({ msg: "success", code: 201 });
  } catch (err) {
    console.log(err.body);
    return res.status(500).json({ status: "error", code: 500 });
  }
});

app.listen(4000, () => {
  console.log("APP STARTED");
});
