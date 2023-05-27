import puppeteerDev from "puppeteer"
import puppeteerProd from "puppeteer-core"

export default process.env.NODE_ENV === "production"
  ? puppeteerProd
  : puppeteerDev
