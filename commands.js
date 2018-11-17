let browserProcess = null;
let page = null;
const puppeteer = require("puppeteer");
const { login, goToHomepage } = require("./login");
const { logger } = require("./utils");
const moment = require("moment");
const $cart = `[data-automation-id="cartSidebar"]`;

const addToCart = async (query, shouldShowImage) => {
  const { searchProduct } = require("./search");
  await login(page);
  const { title, dollars, cents, image } = await searchProduct(
    page,
    query,
    true,
    shouldShowImage
  );
  return {
    text: `Added ${title} to your cart. $${dollars}.${cents}`,
    image
  };
};

const searchProduct = async query => {
  const { searchProduct } = require("./search");
  await login(page);
  const { title, cents, dollars, image } = await searchProduct(page, query);
  logger("done searching");
  return {
    text: `I found ${title}. $${dollars}.${cents}\nText !add and I'll add it to your cart.`,
    image
  };
};

const getCart = async () => {
  await login(page);
  await page.waitForSelector($cart);
  const cart = await page.$($cart);
  const filename = `cart-${moment().format("X")}.png`;
  await cart.screenshot({
    path: `./screenshots/${filename}`
  });
  return {
    text: `Here is your cart`,
    image: process.env.SERVER_URL + filename
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
  page = await browserProcess.newPage();
  logger("opening new page");
  await goToHomepage(page);
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
