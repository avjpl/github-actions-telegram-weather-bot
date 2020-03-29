require('dotenv').config();
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

const {
  TELEGRAM_TOKEN,
  WEATHER_API_TOKEN,
  TELEGRAM_CHAT_ID,
} = process.env;

const bot = new TelegramBot(TELEGRAM_TOKEN);
const weatherToken = WEATHER_API_TOKEN;
const weatherURL = new URL('https://api.openweathermap.org/data/2.5/weather');
weatherURL.searchParams.set('lat', 51.402166);
weatherURL.searchParams.set('lon', -0.165843);
weatherURL.searchParams.set('units', 'metric');
weatherURL.searchParams.set('appid', weatherToken);

const getWeatherData = async () => {
  return await axios({
    method: 'get',
    url: weatherURL.toString()
  });
};

const generateWeatherMessage = ({ name, weather, main: { temp, temp_min, temp_max } }) => {
  const { description } = weather[0];

  return `The weather in ${name}: ${description}. Current temperature is ${temp}, with a low temp of ${temp_min} and hight of ${temp_max}`;
};

const main = async () => {
  const { data } = await getWeatherData();
  const weatherString = generateWeatherMessage(data);
  bot.sendMessage(TELEGRAM_CHAT_ID, weatherString);
};

main();
