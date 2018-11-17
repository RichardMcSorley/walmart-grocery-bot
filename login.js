const { dataAutoClick } = require("./utils");
const login = async page => {
  try {
    await page.waitForSelector('[data-automation-id="accountLink"]');
  } catch (error) {
    await page.goto("https://grocery.walmart.com");
    await page.waitForSelector('[data-automation-id="signInLink"]');
    await dataAutoClick(page, "signInLink");
    await page.waitForSelector("#email");
    await page.type("#email", process.env.WM_E);
    await page.waitForSelector("#password");
    await page.type("#password", process.env.WM_P);
    await dataAutoClick(page, "signin-submit-btn");
    await page.waitForSelector(
      '[data-automation-id="driverTippingCloseModal"]'
    );
    await dataAutoClick(page, "driverTippingCloseModal");
  }
};

module.exports = {
  login
};
