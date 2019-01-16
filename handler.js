const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.hears('hi', ctx => ctx.reply('Hey there2!'));

module.exports.hello = async (event, context) => {
  const update = JSON.parse(event.body);
  try {
    await bot.handleUpdate(update);

    return {
      statusCode: 200,
      body: ``,
    };
  } catch (e) {
    return {
      statusCode: 200,
      body: `'Error: ${e}`,
    };
  }
};
