import { Trigger } from "@trigger.dev/sdk";
import { z } from "zod";

export const contentGeneratorJob = Trigger.defineJob({
  id: "content-generator",
  name: "Content Generator",
  version: "1.0",
  trigger: Trigger.schedule({ cron: "0 2 * * *" }),
  run: async (payload, io) => {
    await io.logger.info("Starting content generation batch");
    
    const response = await io.fetch("Generate Content", "https://api.lumalabs.ai/v1/generate", {
      method: "POST",
      body: JSON.stringify({ prompt: "Marketing content for AMADS campaign" }),
      headers: { "Content-Type": "application/json" },
    });
    
    const result = await response.json();
    await io.logger.info("Content generated", { assets: result });
    
    return { status: "generated", assets: result };
  },
});
