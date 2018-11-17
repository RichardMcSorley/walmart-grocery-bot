const { logger, screen } = require("./utils");
const moment = require("moment");
const searchProduct = async (
  page,
  query,
  shouldClick = false,
  shouldShowImage = true
) => {
  await page.goto("https://grocery.walmart.com/search/?query=" + query);
  logger("navigating to search page");
  await page.waitForSelector(`[id^="item-"]`);
  logger("found items");
  const [first] = await page.$$(`[id^="item-"]`);
  if (!first) {
    logger("cant find 1 item");
    return;
  }
  // const text = await (await firstTitle.getProperty("aria-label")).jsonValue();
  const button = await first.$(`[data-automation-id="addToCartBtn"]`);
  const title = await first.$eval('[data-automation-id="name"]', element => {
    return element.innerHTML;
  });
  logger("found title");
  let image = null;
  if (shouldShowImage) {
    image = await first.$eval('[data-automation-id="image"]', element => {
      return element.src;
    });
    logger("found image");
  }

  const wholeUnits = await first.$eval(
    '[data-automation-id="wholeUnits"]',
    element => {
      return element.innerHTML;
    }
  );
  const partialUnits = await first.$eval(
    '[data-automation-id="partialUnits"]',
    element => {
      return element.innerHTML;
    }
  );
  logger("found price");
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
    partialUnits,
    title,
    wholeUnits
  };
};

module.exports = {
  searchProduct
};
