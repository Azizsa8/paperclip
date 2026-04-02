import { Trigger } from "@trigger.dev/sdk";

export const performanceMonitorJob = Trigger.defineJob({
  id: "performance-monitor",
  name: "Performance Monitor",
  version: "1.0",
  trigger: Trigger.schedule({ cron: "*/15 * * * *" }),
  run: async (payload, io) => {
    await io.logger.info("Running performance check");
    
    const metrics = { campaigns: 5, alerts: 0, anomalies: 0 };
    
    if (metrics.anomalies > 0) {
      await io.fetch("Send Alert", "https://api.telegram.org/bot/sendMessage", {
        method: "POST",
        body: JSON.stringify({ text: `AMADS Alert: ${metrics.anomalies} anomalies detected` }),
        headers: { "Content-Type": "application/json" },
      });
    }
    
    return { status: "monitored", metrics };
  },
});
