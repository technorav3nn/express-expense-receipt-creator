const puppeteer = require("puppeteer");
const { writeFile } = require("fs");

const bsSelector: string = "input[name=text-business]";
const dateSelector: string = "input[name=text-date]";
const timeSelector: string = "input[name=text-time]";
const addressSelector: string = "input[name=text-address]";
const locSelector: string = "input[name=text-location]";
const phoneSelector: string = "input[name=text-telephone]";
const taxSelector: string = "#text3";
const paymentSelector: string = "#text4";

const addItemBtn: string = "#addScnt > i";

const allSelectors = [
  bsSelector,
  dateSelector,
  timeSelector,
  addressSelector,
  locSelector,
  phoneSelector,
  taxSelector,
  paymentSelector,
];

const qtySelector = "#p_qty";
const nameSelector = "#p_scnt";
const priceSelector = "#p_price";

const img = "img[class=img-responsive]";
const submitBtn = "#createmark";

export default async (arrSelector: Array<any>, itemsList: Array<any>) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const imgPage = await browser.newPage();

  await page.setViewport({
    width: 1000,
    height: 1500,
  });

  await page.goto(
    "https://expressexpense.com/make-receipt-online.php?style=Itemized+Receipt",
    { waitUntil: "networkidle2" }
  );
  await page.waitForSelector(bsSelector);

  for (const [index, selector] of allSelectors.entries()) {
    await page.evaluate(
      (selector, index, arrSelector) =>
        (document.querySelector(selector).value = arrSelector[index]),
      selector,
      index,
      arrSelector
    );
  }

  await page.waitForSelector(addItemBtn);

  for (let i = 0; i < itemsList.length - 1; ++i) {
    await page.click(addItemBtn);
  }

  await page.$$eval(
    qtySelector,
    (allEl, itemsList) =>
      allEl.forEach((el, index) => (el.value = itemsList[index].qty)),
    itemsList
  );
  await page.$$eval(
    nameSelector,
    (allEl, itemsList) =>
      allEl.forEach((el, index) => (el.value = itemsList[index].name)),
    itemsList
  );
  await page.$$eval(
    priceSelector,
    (allEl, itemsList) =>
      allEl.forEach((el, index) => (el.value = itemsList[index].price)),
    itemsList
  );
  await page.click(submitBtn);
  await page.waitForSelector(img);

  const imgUrl = await page.$eval(img, (el) => el.src);
  const imgData = await imgPage.goto(imgUrl);

  await browser.close();
  return imgUrl;
};
