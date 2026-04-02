import { Trigger } from "@trigger.dev/sdk";
import { z } from "zod";

const inputSchema = z.object({
  productName: z.string(),
  productDescription: z.string(),
  targetAudience: z.string(),
  goal: z.string(),
  budget: z.number().optional(),
});

export const campaignLauncherJob = Trigger.defineJob({
  id: "campaign-launcher",
  name: "Campaign Launcher",
  version: "1.0",
  trigger: Trigger.webhook({
    event: "product.submitted",
  }),
  run: async (payload, io) => {
    const input = inputSchema.parse(payload);
    
    await io.logger.info("Creating campaign", { productName: input.productName });
    
    const response = await io.fetch("Create Campaign", "http://paperclip-groq.railway.internal:3100/api/campaigns", {
      method: "POST",
      body: JSON.stringify(input),
      headers: { "Content-Type": "application/json" },
    });
    
    const campaign = await response.json();
    await io.logger.info("Campaign created", { campaignId: campaign.id });
    
    await io.fetch("Spawn CEO Agent", "http://openclaw.railway.internal:8080/v1/agents/ceo-agent/run", {
      method: "POST",
      body: JSON.stringify({ campaignId: campaign.id }),
      headers: { "Content-Type": "application/json" },
    });
    
    return { campaignId: campaign.id, status: "launched" };
  },
});
