// const searchProduct = async (page, query) => {
//   await page.goto("https://grocery.walmart.com/search/?query=" + query);
//   await page.waitForSelector(`[id^="item-"]`);
//   const [first] = await page.$$(`[id^="item-"]`);
//   if (!first) {
//     return;
//   }
//   return await first.screenshot();
// };

const searchProduct = async (page, query, shouldClick = false) => {
  console.log("begin search");
  await page.goto("https://grocery.walmart.com/search/?query=" + query);
  await page.waitForSelector(`[id^="item-"]`);
  const [first] = await page.$$(`[id^="item-"]`);
  if (!first) {
    return;
  }
  // const text = await (await firstTitle.getProperty("aria-label")).jsonValue();
  const button = await first.$(`[data-automation-id="addToCartBtn"]`);
  const title = await first.$eval('[data-automation-id="name"]', element => {
    return element.innerHTML;
  });
  const image = await first.$eval('[data-automation-id="image"]', element => {
    return element.src;
  });

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
  if (shouldClick) {
    await button.click();
  }

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
