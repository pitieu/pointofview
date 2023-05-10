import { DocsConfig } from "types"
import { pages } from "./pages"

export const docsConfig: DocsConfig = {
  mainNav: [],
  sidebarNav: [
    pages.gettingStartedDocs,
    pages.documentationDocs,
    pages.blogDocs,
    pages.dashboardDocs,
    pages.marketingDocs,
  ],
}
