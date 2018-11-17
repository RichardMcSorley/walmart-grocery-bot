const { logger, screen } = require("./utils");
const moment = require("moment");
const searchURL = "https://grocery.walmart.com/search/?query=";
const $items = `[id^="item-"]`;
const $addtocart = `[data-automation-id="addToCartBtn"]`;
const $itemname = '[data-automation-id="name"]';
const $itemimage = '[data-automation-id="image"]';
const $itempricedollar = '[data-automation-id="wholeUnits"]';
const $itempricecents = '[data-automation-id="partialUnits"]';

const searchProduct = async (
  page,
  query,
  shouldClick = false,
  shouldShowImage = true
) => {
  const url = await page.url();
  const searchQuery = searchURL + encodeURIComponent(query);
  if (!url || url !== searchQuery) {
    logger("navigating to search page");
    await page.goto(searchQuery);
  } else {
    logger("Already on search page");
  }
  await page.waitForSelector($items);
  logger("found items");
  const [first] = await page.$$($items);
  if (!first) {
    logger("cant find 1 item");
    return;
  }
  const button = await first.$($addtocart);

  // scrape item information
  const title = await first.$eval($itemname, element => element.innerHTML);
  logger("found title");
  let image = null;
  if (shouldShowImage) {
    image = await first.$eval($itemimage, element => element.src);
    logger("found image");
  }

  const dollars = await first.$eval(
    $itempricedollar,
    element => element.innerHTML
  );
  const cents = await first.$eval(
    $itempricecents,
    element => element.innerHTML
  );

  logger("found price");
  // click button
  if (shouldClick) {
    if (!button) {
      logger("cant click button, maybe you already added it to the cart");
    } else {
      await button.click();
      logger("clicked add to cart");
    }
  }
  await screen(page, moment().format("X"));
  return {
    image,
    cents,
    title,
    dollars
  };
};

module.exports = {
  searchProduct
};
