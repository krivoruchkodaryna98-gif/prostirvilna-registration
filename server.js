const express = require("express");
const bodyParser = require("body-parser");
const TelegramBot = require("node-telegram-bot-api");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const fs = require("fs");

const TOKEN = process.env.TOKEN;
const SHEET_ID = "1hbpFgrCAECIYSLkgYzXUe2OgV_3FxI3NWvEwUxyizQE";
const KEY_FILE = "key.json";

const bot = new TelegramBot(TOKEN, { polling: true });
const app = express();
app.use(bodyParser.json());

let userState = {};

const LIMIT = 15;

/* ===============================
START MESSAGE
================================ */

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    "🤍 Вітаємо у боті Простору «Вільна»\n\nНатисніть кнопку Реєстрація."
  );

  bot.sendKeyboard(chatId, {
    reply_markup: {
      keyboard: [[{ text: "Реєстрація" }]],
      resize_keyboard: true
    }
  });
});

/* ===============================
REGISTRATION FLOW
================================ */

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "Реєстрація") {
    userState[chatId] = { step: 1 };

    return bot.sendMessage(chatId, "Введіть ПІБ");
  }

  if (!userState[chatId]) return;

  let state = userState[chatId];

  if (state.step === 1) {
    state.name = text;
    state.step = 2;

    return bot.sendMessage(chatId, "Введіть телефон (380XXXXXXXXX)");
  }

  if (state.step === 2) {
    state.phone = text;
    state.step = 3;

    return bot.sendMessage(chatId, "Введіть Telegram username або ID");
  }

  if (state.step === 3) {
    state.telegramId = chatId;

    if (registrations.length >= LIMIT) {
      delete userState[chatId];
      return bot.sendMessage(chatId, "Місця закінчились");
    }

    registrations.push(state);

    bot.sendMessage(chatId, "Ви успішно зареєстровані 💛");

    delete userState[chatId];
  }
});

app.listen(3000, () => console.log("Server running"));
