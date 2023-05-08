import { DashboardConfig } from "types"
import { pages } from "./pages"

export const dashboardConfig: DashboardConfig = {
  mainNav: [pages.dashboard, pages.support],
  sidebarNav: [pages.billing, pages.settings],
}
