import { DocsConfig } from "types"
import { pages } from "./pages"

export const docsConfig: DocsConfig = {
  mainNav: [pages.documentation, pages.guides],
  sidebarNav: [
    pages.gettingStartedDocs,
    pages.documentationDocs,
    pages.blogDocs,
    pages.dashboardDocs,
    pages.marketingDocs,
  ],
}
