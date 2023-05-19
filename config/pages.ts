import { MainNavItem, SidebarNavItem } from "types"

export const pages = {
  signup: {
    title: "Sign Up",
    href: "/register",
  },
  login: {
    title: "Login",
    href: "/login",
  },
  posts: {
    title: "Overview",
    href: "/dashboard",
    icon: "barChart",
  },
  proList: {
    title: "Find Professionals",
    href: "/professionals",
  },
  jobs: {
    title: "Browse Jobs",
    href: "/jobs",
  },
  apiKeys: {
    title: "Api Keys",
    href: "/dashboard/api-keys",
  } as MainNavItem,
  dashboard: {
    title: "Dashboard",
    href: "/dashboard",
  } as MainNavItem,
  support: {
    title: "Support",
    href: "/support",
    disabled: true,
  } as MainNavItem,
  billing: {
    title: "Billing",
    href: "/dashboard/billing",
    icon: "billing",
  } as MainNavItem,
  settings: {
    title: "Settings",
    href: "/dashboard/settings",
    icon: "settings",
  } as MainNavItem,

  // marketing
  features: {
    title: "Features",
    href: "/#features",
  } as MainNavItem,

  marketplace: {
    title: "Marketplace",
    href: "/marketplace",
  } as MainNavItem,

  productReviews: {
    title: "Product Reviews",
    href: "/#product-reviews",
  } as MainNavItem,

  // docs
  gettingStartedDocs: {
    title: "Getting Started",
    items: [
      {
        title: "Introduction",
        href: "/docs",
      },
    ],
  } as SidebarNavItem,
  documentationDocs: {
    title: "Documentation",
    items: [
      {
        title: "Introduction",
        href: "/docs/documentation",
      },
      {
        title: "Contentlayer",
        href: "/docs/in-progress",
        disabled: true,
      },
      {
        title: "Components",
        href: "/docs/documentation/components",
      },
      {
        title: "Code Blocks",
        href: "/docs/documentation/code-blocks",
      },
      {
        title: "Style Guide",
        href: "/docs/documentation/style-guide",
      },
      {
        title: "Search",
        href: "/docs/in-progress",
        disabled: true,
      },
    ],
  } as SidebarNavItem,
  blogDocs: {
    title: "Blog",
    items: [
      {
        title: "Introduction",
        href: "/docs/in-progress",
        disabled: true,
      },
      {
        title: "Build your own",
        href: "/docs/in-progress",
        disabled: true,
      },
      {
        title: "Writing Posts",
        href: "/docs/in-progress",
        disabled: true,
      },
    ],
  } as SidebarNavItem,
  dashboardDocs: {
    title: "Dashboard",
    items: [
      {
        title: "Introduction",
        href: "/docs/in-progress",
        disabled: true,
      },
      {
        title: "Layouts",
        href: "/docs/in-progress",
        disabled: true,
      },
      {
        title: "Server Components",
        href: "/docs/in-progress",
        disabled: true,
      },
      {
        title: "Authentication",
        href: "/docs/in-progress",
        disabled: true,
      },
      {
        title: "Database with Prisma",
        href: "/docs/in-progress",
        disabled: true,
      },
      {
        title: "API Routes",
        href: "/docs/in-progress",
        disabled: true,
      },
    ],
  } as SidebarNavItem,
  marketingDocs: {
    title: "Marketing Site",
    items: [
      {
        title: "Introduction",
        href: "/docs/in-progress",
        disabled: true,
      },
      {
        title: "File Structure",
        href: "/docs/in-progress",
        disabled: true,
      },
      {
        title: "Tailwind CSS",
        href: "/docs/in-progress",
        disabled: true,
      },
      {
        title: "Typography",
        href: "/docs/in-progress",
        disabled: true,
      },
    ],
  } as SidebarNavItem,
}
