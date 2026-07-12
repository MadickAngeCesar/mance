export const DASHBOARD_DATA_EVENT = "dashboard:data-changed";

export type DashboardDataDomain =
  | "messages"
  | "subscribers"
  | "blogs"
  | "projects"
  | "services"
  | "sectors"
  | "profile";

export function emitDashboardDataChanged(domain: DashboardDataDomain) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(DASHBOARD_DATA_EVENT, { detail: { domain } }));
}
