# Walmart Grocery Cart Bot

Use the Official google assistant app:

- Just say: “OK Google, talk to Walmart.”
https://techcrunch.com/2019/04/02/walmart-partners-with-google-on-voice-enabled-grocery-shopping/

Bot will open a headless chrome browser and navigate walmart.com/grocery. It will login for you and add things to your cart by sending a text message like `!add milk`. No more trying to remember everything, just add things to your cart as soon as you run out.

#### Available commands:

- `!add` - Adds first product in the search to your cart.
- `!search` - Returns first item's info from the search.
- `!cart` - returns a screenshot of your current cart.

### Technologies used:

- nodejs
- hapi
- Twilio
- puppeteer

<p float="left">
  <img src="../master/screenshots/text.jpg"  width="300"/>
  <img src="../master/screenshots/app.jpg" width="300" />
</p>

### Install

```
npm install
```

### Setup

- Setup a Twilio account with a researved phone number.
- On your phone number's configure tab, update the webhook urls' Message comes in 'Webhook' http://YOURDOMAIN.COM/sms and Primary Handler Fails 'Webhook' to http://YOURDOMAIN.COM/fail
- Rename .env.example to .env
- Change values in .env to your username and password for your grocery account

### Run Locally

- Install and setup [ngrok](https://ngrok.com/)
- Foward the PORT used in .env

```
npm start
```
