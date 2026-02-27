const express = require("express");
const bodyParser = require("body-parser");
const TelegramBot = require("node-telegram-bot-api");

const TOKEN = process.env.TOKEN;
const LIMIT = 15;

const bot = new TelegramBot(TOKEN);
const app = express();
app.use(bodyParser.json());

let registrations = [];

app.post("/register", (req, res) => {
  const { name, phone, telegramId } = req.body;

  if (registrations.length >= LIMIT) {
    return res.json({ success: false, message: "Місця закінчились" });
  }

  registrations.push({ name, phone, telegramId });

  bot.sendMessage(
    telegramId,
    "Ви успішно зареєстровані 💛 Чекаємо вас на заході!"
  );

  res.json({ success: true });
});

app.post("/broadcast", (req, res) => {
  const { message } = req.body;

  registrations.forEach((user) => {
    bot.sendMessage(user.telegramId, message);
  });

  res.json({ success: true });
});

app.listen(3000, () => console.log("Server running"));
