# Walmart Grocery Cart Bot

Bot will open a headless chrome browser and navigate walmart.com/grocery. It will login for you and add things to your cart by sending a message like `!add milk`. No more trying to remember everything, just add things to your cart as soon as you run out.

#### Available commands:

- `!add` - Adds product first product in search to your cart.
- `!search` - Returns first item's info from search.
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
- Rename .env.example to .evn
- Change values in .env to your username and password for your grocery account

### Run Locally

- Install and setup [ngrok](https://ngrok.com/)
- Foward the PORT used in .env

```
npm start
```
