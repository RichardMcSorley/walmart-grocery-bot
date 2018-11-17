const buildDataAtr = s => `[data-automation-id="${s}"]`;
const dataAutoClick = async (page, s) => {
  try {
    const divs = await page.$$eval(buildDataAtr(s), divs => {
      console.log(`found elements: `, divs);
      if (divs[0]) {
        divs[0].click();
      }
      return divs.length;
    });
    if (divs) {
      console.log(`Clicked ${buildDataAtr(s)}`);
    }
  } catch (e) {
    console.log(`Could not find ${buildDataAtr(s)}`, e);
  }
};

module.exports = {
  dataAutoClick
};
