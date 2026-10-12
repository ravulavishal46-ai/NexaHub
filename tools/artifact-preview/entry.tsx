/**
 * Entry point of the single-file preview build.
 * Maps URLs to the real NexaHub page components (same code as the Next.js app).
 */
import { Component, StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { Providers } from "@/components/shared/providers";
import { RouterProvider, useRouterContext } from "./shims/router";

import MarketingLayout from "@/app/(marketing)/layout";
import HomePage from "@/app/(marketing)/page";
import ServicesPage from "@/app/(marketing)/services/page";
import AboutPage from "@/app/(marketing)/about/page";
import ContactPage from "@/app/(marketing)/contact/page";
import { ServiceDetail } from "@/features/services/service-detail";

import AuthLayout from "@/app/(auth)/layout";
import LoginPage from "@/app/(auth)/login/page";
import RegisterPage from "@/app/(auth)/register/page";
import ForgotPage from "@/app/(auth)/forgot-password/page";
import ResetPage from "@/app/(auth)/reset-password/page";

import DashboardLayout from "@/app/dashboard/layout";
import DashboardPage from "@/app/dashboard/page";
import DashServicesPage from "@/app/dashboard/services/page";
import MyRequestsPage from "@/app/dashboard/requests/page";
import NewRequestPage from "@/app/dashboard/requests/new/page";
import { UserRequestDetail } from "@/features/dashboard/request-detail";
import HistoryPage from "@/app/dashboard/history/page";
import NotificationsPage from "@/app/dashboard/notifications/page";
import ProfilePage from "@/app/dashboard/profile/page";
import DashSettingsPage from "@/app/dashboard/settings/page";
import SavedPage from "@/app/dashboard/saved/page";

import AdminLayout from "@/app/admin/layout";
import AdminPage from "@/app/admin/page";
import AdminUsersPage from "@/app/admin/users/page";
import AdminServicesPage from "@/app/admin/services/page";
import AdminRequestsPage from "@/app/admin/requests/page";
import AdminAnalyticsPage from "@/app/admin/analytics/page";
import AdminActivityPage from "@/app/admin/activity/page";
import AdminSettingsPage from "@/app/admin/settings/page";

import NotFound from "@/app/not-found";
import ErrorPage from "@/app/error";

type Group = "marketing" | "auth" | "dashboard" | "admin" | "none";
type Match = { group: Group; page: ReactNode };

const fixed: Record<string, Match> = {
  "/": { group: "marketing", page: <HomePage /> },
  "/services": { group: "marketing", page: <ServicesPage /> },
  "/about": { group: "marketing", page: <AboutPage /> },
  "/contact": { group: "marketing", page: <ContactPage /> },
  "/login": { group: "auth", page: <LoginPage /> },
  "/register": { group: "auth", page: <RegisterPage /> },
  "/forgot-password": { group: "auth", page: <ForgotPage /> },
  "/reset-password": { group: "auth", page: <ResetPage /> },
  "/dashboard": { group: "dashboard", page: <DashboardPage /> },
  "/dashboard/services": { group: "dashboard", page: <DashServicesPage /> },
  "/dashboard/saved": { group: "dashboard", page: <SavedPage /> },
  "/dashboard/requests": { group: "dashboard", page: <MyRequestsPage /> },
  "/dashboard/requests/new": { group: "dashboard", page: <NewRequestPage /> },
  "/dashboard/history": { group: "dashboard", page: <HistoryPage /> },
  "/dashboard/notifications": { group: "dashboard", page: <NotificationsPage /> },
  "/dashboard/profile": { group: "dashboard", page: <ProfilePage /> },
  "/dashboard/settings": { group: "dashboard", page: <DashSettingsPage /> },
  "/admin": { group: "admin", page: <AdminPage /> },
  "/admin/users": { group: "admin", page: <AdminUsersPage /> },
  "/admin/services": { group: "admin", page: <AdminServicesPage /> },
  "/admin/requests": { group: "admin", page: <AdminRequestsPage /> },
  "/admin/analytics": { group: "admin", page: <AdminAnalyticsPage /> },
  "/admin/activity": { group: "admin", page: <AdminActivityPage /> },
  "/admin/settings": { group: "admin", page: <AdminSettingsPage /> },
};

function match(pathname: string): Match {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (fixed[path]) return fixed[path];
  let m = path.match(/^\/services\/([^/]+)$/);
  if (m) return { group: "marketing", page: <ServiceDetail slug={decodeURIComponent(m[1])} /> };
  m = path.match(/^\/dashboard\/requests\/([^/]+)$/);
  if (m) return { group: "dashboard", page: <UserRequestDetail id={decodeURIComponent(m[1])} /> };
  return { group: "none", page: <NotFound /> };
}

/** Shows the app's own error screen if a page crashes, instead of a blank page. */
class ErrorBoundary extends Component<{ children: ReactNode; resetKey: string }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidUpdate(prev: { resetKey: string }) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }
  componentDidCatch(error: Error) {
    console.error("[NexaHub preview] page error:", error);
  }
  render() {
    if (this.state.error) return <ErrorPage error={this.state.error} reset={() => this.setState({ error: null })} />;
    return this.props.children;
  }
}

function App() {
  const { location } = useRouterContext();
  const { group, page } = match(location.pathname);
  const keyed = (
    <ErrorBoundary resetKey={location.pathname}>
      <div key={location.pathname} style={{ display: "contents" }}>
        {page}
      </div>
    </ErrorBoundary>
  );
  if (group === "marketing") return <MarketingLayout>{keyed}</MarketingLayout>;
  if (group === "auth") return <AuthLayout>{keyed}</AuthLayout>;
  if (group === "dashboard") return <DashboardLayout>{keyed}</DashboardLayout>;
  if (group === "admin") return <AdminLayout>{keyed}</AdminLayout>;
  return keyed;
}

createRoot(document.getElementById("nexahub-root")!).render(
  <StrictMode>
    <RouterProvider>
      <Providers>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("main")?.focus();
            document.getElementById("main")?.scrollIntoView();
          }}
        >
          Skip to content
        </a>
        <App />
      </Providers>
    </RouterProvider>
  </StrictMode>,
);
