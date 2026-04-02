import { Trigger } from "@trigger.dev/sdk";

export const analyticsSyncJob = Trigger.defineJob({
  id: "analytics-sync",
  name: "Analytics Sync",
  version: "1.0",
  trigger: Trigger.schedule({ cron: "0 * * * *" }),
  run: async (payload, io) => {
    await io.logger.info("Starting hourly analytics sync");
    
    const ga4Data = await io.fetch("Fetch GA4", "https://analyticsreporting.googleapis.com/v4/reports:batchGet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    
    const data = await ga4Data.json();
    await io.logger.info("Analytics synced", { records: data });
    
    return { status: "synced", records: data };
  },
});
