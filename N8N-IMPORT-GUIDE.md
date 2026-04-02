# n8n Workflow Import Guide

## Manual Import Steps

1. Go to https://n8n-prim.up.railway.app/
2. Login with your credentials
3. Click **Workflows** → **Add Workflow** → **Import from File**
4. Import each workflow file:

### Workflows to Import

| File | Webhook URL |
|------|-------------|
| `workflows/master-campaign-workflow.json` | https://n8n-prim.up.railway.app/webhook/amads/master-campaign |
| `workflows/research-pipeline.json` | (triggered by master) |
| `workflows/creative-pipeline.json` | (triggered by master) |
| `workflows/publishing-scheduler.json` | (cron: daily 9am) |
| `workflows/analytics-collector.json` | (cron: hourly) |
| `workflows/daily-report-generator.json` | (cron: daily 9am) |

### After Import

1. Open each workflow
2. Click **Activate** toggle to enable
3. For webhook workflows, copy the webhook URL
4. Test with: `curl -X POST https://n8n-prim.up.railway.app/webhook/amads/master-campaign -H "Content-Type: application/json" -d '{"productName":"Test Product"}'`

### Workflow Files Location

```
amads/workflows/
├── master-campaign-workflow.json
├── research-pipeline.json
├── creative-pipeline.json
├── publishing-scheduler.json
├── analytics-collector.json
└── daily-report-generator.json
```
