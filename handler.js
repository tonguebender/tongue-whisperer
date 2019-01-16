const AWS = require('aws-sdk');
const Telegraf = require('telegraf');

AWS.config.update({ region: 'eu-west-2' });

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.on('text', ctx => ctx.reply(`echo: ${ctx.message.text}`));

module.exports.input = async (event, context) => {
  if (event.body) {
    try {
      const update = JSON.parse(event.body);

      sqs.sendMessage(
        {
          MessageAttributes: {},
          MessageBody: JSON.stringify(update, null, ''),
          QueueUrl: 'https://sqs.eu-west-2.amazonaws.com/035313854880/task',
        },
        (err, data) => {
          if (err) {
            console.log(err);
          }
        },
      );

      await bot.handleUpdate(update);
    } catch (e) {
      console.log(e);
    }
  }

  return {
    statusCode: 200,
    body: ``,
  };
};

module.exports.output = async (event, context) => {
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
