let browserProcess = null;
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
  }
};

const getPrefix = text => {
  const firstword = text.split(" ")[0]; //
  if (firstword in prefixes) {
    return prefixes[firstword];
  } else {
    return null;
  }
};

const addToCart = async query => {
  const { searchProduct } = require("./search");
  const page = await browserProcess.newPage();
  await page.goto("https://grocery.walmart.com");
  await login(page);
  const { title, wholeUnits, partialUnits, image } = await searchProduct(
    page,
    query,
    true
  );
  page.close();
  return {
    text: `Added ${title} to your cart. $${wholeUnits}.${partialUnits}`,
    image
  };
};

const searchProduct = async query => {
  const { searchProduct } = require("./search");
  const page = await browserProcess.newPage();
  await page.goto("https://grocery.walmart.com");
  await login(page);
  const { title, wholeUnits, partialUnits, image } = await searchProduct(
    page,
    query
  );
  page.close();
  return {
    text: `I found ${title}. $${wholeUnits}.${partialUnits}\nText !add ${query} to add to your cart.`,
    image
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
    defaultViewport: { width: 1200, height: 500 }
  });
  const page = await browserProcess.newPage();
  await page.goto("https://grocery.walmart.com");
  await login(page);
  await page.close();
})();

module.exports = {
  getPrefix,
  addToCart,
  searchProduct
};
