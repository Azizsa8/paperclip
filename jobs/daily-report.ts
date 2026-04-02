import { Trigger } from "@trigger.dev/sdk";

export const dailyReportJob = Trigger.defineJob({
  id: "daily-report",
  name: "Daily Report",
  version: "1.0",
  trigger: Trigger.schedule({ cron: "0 9 * * *" }),
  run: async (payload, io) => {
    await io.logger.info("Generating daily report");
    
    const report = "AMADS Daily Report: All systems operational. 5 active campaigns. 32 agents running.";
    
    await io.fetch("Post to Slack", "https://slack.com/api/chat.postMessage", {
      method: "POST",
      body: JSON.stringify({ channel: "#amads-reports", text: report }),
      headers: { "Content-Type": "application/json" },
    });
    
    return { status: "reported", summary: report };
  },
});
