const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

/*
MessageSchema:
  chatId: String|Number
  text: String

  todo: img
  todo: audio
  todo: buttons
*/

module.exports = async (event, context) => {
  await Promise.all(
    event.Records.map(async msg => {
      const data = JSON.parse(msg.body);
      console.log(data);
      return bot.telegram.sendMessage(data.chatId, data.text);
    }),
  );

  return {
    statusCode: 200,
    body: ``,
  };
};
