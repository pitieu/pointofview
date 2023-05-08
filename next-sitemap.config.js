/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXTAUTH_URL || "https://localhost.com:3000",
  generateRobotsTxt: true, // (optional)
  changefreq: "daily",
  priority: 0.7,
  //   sitemapSize: 5000,
}
