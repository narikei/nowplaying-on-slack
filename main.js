const electron = require('electron');
const request = require('request');
const playback = require('playback');

const app = electron.app;

const token = process.env.SLACK_API_TOKEN;

const sendToSlack = (message) => {
  request({
    url: 'https://slack.com/api/users.profile.set',
    method: 'POST',
    form: {
      token,
      profile: JSON.stringify({
        status_text: message,
        status_emoji: ':musical_note:',
      }),
    },
  }, (error, response, body) => {
    if (!error) {
      return;
    }

    console.error(error, response, body);
  });
};

const watchiTunes = () => {
  let nowplaying;

  setInterval(() => {
    playback.currentTrack((res) => {
      if (!res) {
        return;
      }

      const message = `${res.name} - ${res.artist}`;
      if (nowplaying === message) {
        return;
      }

      console.log(message);
      sendToSlack(message);

      nowplaying = message;
    });
  }, 3000);
};

app.on('ready', () => {
  if (!token) {
    console.log('token ga naiyo');
    return;
  }

  watchiTunes();
});
