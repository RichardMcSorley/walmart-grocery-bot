const { dataAutoClick, logger, screen } = require("./utils");
const homepageUrl = "https://grocery.walmart.com";
const moment = require("moment");
const login = async page => {
  try {
    await page.waitForSelector('[data-automation-id="accountLink"]');
    logger("logged in already");
  } catch (error) {
    await goToHomepage(page);
    await page.waitForSelector('[data-automation-id="signInLink"]');
    logger("found sign in link");
    await dataAutoClick(page, "signInLink");
    logger("clicked link");
    await page.waitForSelector("#email");
    logger("found email form");
    await page.type("#email", process.env.WM_E);
    logger("typed email");
    await page.waitForSelector("#password");
    logger("found password input");
    await page.type("#password", process.env.WM_P);
    logger("typed password");
    await dataAutoClick(page, "signin-submit-btn");
    logger("clicked signin button");
    await tryTippingModal(page);
  }
  await screen(page, moment().format("X"));
};
const goToHomepage = async page => {
  const url = await page.url();
  if (!url || !url.startsWith(homepageUrl)) {
    logger("going to homepage");
    return await page.goto(homepageUrl);
  } else {
    return logger("already on site");
  }
};
const tryTippingModal = async page => {
  try {
    logger("checking if tipping modal exists");
    await page.waitForSelector(
      '[data-automation-id="driverTippingCloseModal"]'
    );
    await dataAutoClick(page, "driverTippingCloseModal");
  } catch (error) {
    logger("no tipping modal");
  }
};

module.exports = {
  login,
  tryTippingModal,
  goToHomepage
};
