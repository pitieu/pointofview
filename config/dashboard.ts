import { DashboardConfig } from "types"

import { pages } from "./pages"

export const dashboardConfig: DashboardConfig = {
  mainNav: [pages.proList, pages.jobs],
  sidebarNav: [pages.dashboard, pages.myJobs, pages.billing, pages.settings],
}
