# Walmart Grocery Cart Bot

Login to your Walmart.com/Grocery account, then waits for you to text !add or !search followed by product name. It will select the first item in the results and text you back with details.

### Technologies used:

- nodejs
- hapi
- Twilio
- puppeteer

<p float="left">
  <img src="../master/screenshots/app.jpg" width="500" />
  <img src="../master/screenshots/text.jpg" width="500" />
</p>

### Install

```
npm install
```

### Setup

- Setup a Twilio account with a researved phone number.
- On your phone number's configure tab, update the webhook urls' Message comes in 'Webhook' http://YOURDOMAIN.COM/sms and Primary Handler Fails 'Webhook' to http://YOURDOMAIN.COM/fail
- Rename .env.example to .evn
- Change values in .env to your username and password for your grocery account

### Run Locally

- Install and setup [ngrok](https://ngrok.com/)
- Foward the PORT used in .env

```
npm start
```
