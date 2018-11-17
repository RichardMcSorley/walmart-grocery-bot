let browserProcess = null;
const puppeteer = require("puppeteer");
const { login } = require("./login");
const { logger } = require("./utils");
const moment = require("moment");
const homepageUrl = "https://grocery.walmart.com";
const $cart = `[data-automation-id="cartSidebar"]`;

const addToCart = async (query, shouldShowImage) => {
  const { searchProduct } = require("./search");
  const page = await browserProcess.newPage();
  logger("Opened a new page");
  await page.goto(homepageUrl);
  logger("Going to grocery homepage");
  await login(page);
  const { title, dollars, cents, image } = await searchProduct(
    page,
    query,
    true,
    shouldShowImage
  );
  logger("Logged in");
  page.close();
  logger("Close page");
  return {
    text: `Added ${title} to your cart. $${dollars}.${cents}`,
    image
  };
};

const searchProduct = async query => {
  const { searchProduct } = require("./search");
  const page = await browserProcess.newPage();
  logger("opening new page");
  await page.goto(homepageUrl);
  logger("navigating to grocery homepage");
  await login(page);
  const { title, cents, dollars, image } = await searchProduct(page, query);
  logger("done searching");
  page.close();
  logger("closed page");
  return {
    text: `I found ${title}. $${dollars}.${cents}\nText !add and I'll add it to your cart.`,
    image
  };
};

const getCart = async () => {
  const page = await browserProcess.newPage();
  logger("opening new page");
  await page.goto(homepageUrl);
  logger("navigating to grocery homepage");
  await login(page);
  await page.waitForSelector($cart);
  const cart = await page.$($cart);
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

(async () => {
  browserProcess = await puppeteer.launch({
    userDataDir: "data",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      `--remote-debugging-port=5000`
    ],
    defaultViewport: { width: 1200, height: 800 }
  });
  logger("opened new browser");
  const page = await browserProcess.newPage();
  logger("opening new page");
  await page.goto(homepageUrl);
  logger("navigating to grocery homepage");
  await login(page);
  logger("logged in");
  await page.close();
})();

const prefixes = {
  "!search": {
    match: "search", // used to match type, useful if we have multiple for same function
    value: "!search ", // what the user typed
    lang: "en",
    display: false,
    handle: searchProduct
  },
  "!add": {
    match: "add", // used to match type, useful if we have multiple for same function
    value: "!add ", // what the user typed
    lang: "en",
    display: false,
    handle: addToCart
  },
  "!cart": {
    match: "cart", // used to match type, useful if we have multiple for same function
    value: "!cart ", // what the user typed
    lang: "en",
    display: false,
    handle: getCart
  },
  search: {
    match: "search", // used to match type, useful if we have multiple for same function
    value: "search ", // what the user typed
    lang: "en",
    display: true,
    handle: searchProduct
  },
  add: {
    match: "add", // used to match type, useful if we have multiple for same function
    value: "add ", // what the user typed
    lang: "en", // maybe use to respond in another language
    display: true,
    handle: addToCart
  },
  cart: {
    match: "cart", // used to match type, useful if we have multiple for same function
    value: "cart ", // what the user typed
    lang: "en", // maybe use to respond in another language
    display: true,
    handle: getCart
  }
};

const allCommands = () =>
  Object.keys(prefixes)
    .filter(p => prefixes[p].display)
    .join(", ");

const getPrefix = text => {
  const firstword = text.toLowerCase().split(" ")[0]; //
  if (firstword in prefixes) {
    return prefixes[firstword];
  } else {
    return null;
  }
};

module.exports = {
  getPrefix,
  addToCart,
  searchProduct,
  getCart,
  allCommands
};
