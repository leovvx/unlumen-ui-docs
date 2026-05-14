export const ANALYTICS_EVENTS = [
  "registry_pull",
  "cli_install_pull",
  "install_command_copy",
  "source_code_copy",
  "source_file_download",
  "source_zip_download",
  "premium_auth_failed",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];

export type AnalyticsEventInput = {
  event: AnalyticsEventName;
  component?: string | null;
  file?: string | null;
  source?: string | null;
  packageManager?: string | null;
  premium?: boolean | null;
  cli?: boolean | null;
  authorized?: boolean | null;
  path?: string | null;
  metadata?: Record<string, unknown> | null;
};

export function isAnalyticsEvent(value: string): value is AnalyticsEventName {
  return (ANALYTICS_EVENTS as readonly string[]).includes(value);
}
