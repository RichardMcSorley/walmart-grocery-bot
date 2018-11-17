let browserProcess = null;
const { logger, screen } = require("./utils");
const moment = require("moment");
const prefixes = {
  "!search": {
    match: "search", // used to match type, useful if we have multiple for same function
    value: "!search ", // what the user typed
    lang: "en" // maybe use to respond in another language
  },
  "!add": {
    match: "add", // used to match type, useful if we have multiple for same function
    value: "!add ", // what the user typed
    lang: "en" // maybe use to respond in another language
  },
  "!cart": {
    match: "cart", // used to match type, useful if we have multiple for same function
    value: "!cart ", // what the user typed
    lang: "en" // maybe use to respond in another language
  }
};

const allCommands = () => Object.keys(prefixes).join(", ");

const getPrefix = text => {
  const firstword = text.split(" ")[0]; //
  if (firstword in prefixes) {
    return prefixes[firstword];
  } else {
    return null;
  }
};

const addToCart = async query => {
  logger("entered addToCart");
  const { searchProduct } = require("./search");
  const page = await browserProcess.newPage();
  logger("Opened a new page");
  await page.goto("https://grocery.walmart.com");
  logger("Going to grocery homepage");
  await login(page);
  const { title, wholeUnits, partialUnits, image } = await searchProduct(
    page,
    query,
    true
  );
  logger("Logged in");
  page.close();
  logger("Close page");
  return {
    text: `Added ${title} to your cart. $${wholeUnits}.${partialUnits}`,
    image
  };
};

const searchProduct = async query => {
  const { searchProduct } = require("./search");
  const page = await browserProcess.newPage();
  logger("opening new page");
  await page.goto("https://grocery.walmart.com");
  logger("navigating to grocery homepage");
  await login(page);
  const { title, wholeUnits, partialUnits, image } = await searchProduct(
    page,
    query
  );
  logger("done searching");
  page.close();
  logger("closed page");
  return {
    text: `I found ${title}. $${wholeUnits}.${partialUnits}\nText !add ${query} to add to your cart.`,
    image
  };
};

const getCart = async query => {
  const page = await browserProcess.newPage();
  logger("opening new page");
  await page.goto("https://grocery.walmart.com");
  logger("navigating to grocery homepage");
  await login(page);
  await page.waitForSelector(`[data-automation-id="cartSidebar"]`);
  const cart = await page.$(`[data-automation-id="cartSidebar"]`);
  const filename = moment().format("X");
  await cart.screenshot({
    path: `./screenshots/${filename}.png`
  });
  page.close();
  logger("closed page");
  return {
    text: `Here is your cart`,
    image: process.env.SERVER_URL + filename + ".png"
  };
};

const puppeteer = require("puppeteer");
const { login } = require("./login");
(async () => {
  browserProcess = await puppeteer.launch({
    userDataDir: "data",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      `--remote-debugging-port=5000`
    ],
    defaultViewport: { width: 1200, height: 1080 }
  });
  logger("opened new browser");
  const page = await browserProcess.newPage();
  logger("opening new page");
  await page.goto("https://grocery.walmart.com");
  logger("navigating to grocery homepage");
  await login(page);
  logger("logged in");
  await page.close();
})();

module.exports = {
  getPrefix,
  addToCart,
  searchProduct,
  getCart,
  allCommands
};
