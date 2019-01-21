const AWS = require('aws-sdk');
const Telegraf = require('telegraf');

AWS.config.update({ region: 'eu-west-2' });
AWS.config.setPromisesDependency(Promise);

const QUEUE_URL = 'https://sqs.eu-west-2.amazonaws.com/035313854880/task';

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.on('text', ctx => ctx.reply(`echo: ${ctx.message.text}`));

/*
Task Schema:
  type: 'REPLY'
  chatId: String
  text: String
  data: Object

*/

module.exports = async (event, context) => {
  if (event.body) {
    try {
      const update = JSON.parse(event.body);

      await sqs
        .sendMessage({
          MessageAttributes: {},
          MessageBody: JSON.stringify({
            type: 'REPLY',
            chatId: update.message.chat.id,
            text: update.message.text,
            data: update
          }, null, ''),
          QueueUrl: QUEUE_URL,
        })
        .promise();

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
