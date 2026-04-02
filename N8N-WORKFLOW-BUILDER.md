# N8N Workflow Builder — Complete Operational Guide

> **How Claude builds, imports, and activates n8n workflows for this stack —
> including credentials, JSON anatomy, testing sequence, and problem resolution.**

---

## Table of Contents

1. [Stack & Credential Map](#1-stack--credential-map)
2. [n8n JSON Workflow Anatomy](#2-n8n-json-workflow-anatomy)
3. [Node Type Reference](#3-node-type-reference)
4. [Connection Format Specification](#4-connection-format-specification)
5. [The Build Workflow (Step-by-Step)](#5-the-build-workflow-step-by-step)
6. [The Import & Activation Sequence](#6-the-import--activation-sequence)
7. [The Testing Sequence](#7-the-testing-sequence)
8. [Problem Resolution Sequence](#8-problem-resolution-sequence)
9. [Full Reference Scripts](#9-full-reference-scripts)

---

## 1. Stack & Credential Map

This is the complete credential and endpoint map for this project.
Every workflow built for this stack must reference these values exactly.

### Live Endpoints

| Service | Public URL | Internal (Railway) URL | Purpose |
|---|---|---|---|
| **n8n** | `https://n8n-prim.up.railway.app` | — | Workflow orchestrator |
| **Paperclip** | `https://paperclip-groq-production.up.railway.app` | `http://paperclip.railway.internal:8080` | AI agent orchestrator |
| **OpenClaw** | `https://openclaw-production-af70.up.railway.app` | `http://openclaw.railway.internal:8080` | Agent runtime |
| **PostgreSQL** | *(external proxy via Railway)*  | `Postgres.railway.internal:5432` | Database |
| **Vercel UI** | `https://ui-five-lime.vercel.app` | — | Admin dashboard |

> **Rule**: In n8n HTTP Request nodes that call Paperclip or OpenClaw, always use the **internal Railway URL** (`.railway.internal`) when both services are on the same Railway project. The internal URL is faster and doesn't leave the private network. Use the public URL only from outside Railway (e.g., from the Vercel UI or local testing).

### n8n API

```
URL:     https://n8n-prim.up.railway.app/api/v1
API Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MzM1MTkyMC0yZmRkLTRiN2UtODJkMi03MWQ0ZDczN2IzYTYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNWFiNjdjZmItOGY0My00NmM5LWExNWQtNGFhNGE4ZGQ0ZDQ2IiwiaWF0IjoxNzc1MTYxMDcxfQ.q5EjPBgO33OX7zl7Z34Wr9PGVyuYrxTiXHHIGSuZmJo
Header:  X-N8N-API-KEY: <key>
```

### Webhook Base URL

```
Production: https://n8n-prim.up.railway.app/webhook/<path>
Test:       https://n8n-prim.up.railway.app/webhook-test/<path>
```

### AMADS Webhook Paths (established)

| Workflow | Webhook Path | Method |
|---|---|---|
| master-campaign-workflow | `amads/master-campaign` | POST |

---

## 2. n8n JSON Workflow Anatomy

Every workflow Claude writes follows this exact top-level structure.
**Do not add extra top-level keys** — the PUT API will reject them with `400 additional properties`.

```json
{
  "name": "workflow-name-kebab-case",
  "nodes": [ ...node objects... ],
  "connections": { ...connection map... },
  "settings": {
    "executionOrder": "v1"
  },
  "staticData": null
}
```

### What NOT to include in the JSON file

These fields come back from the GET API but must be **stripped before PUT**:

```
id, createdAt, updatedAt, active, isArchived, meta, pinData,
versionId, activeVersionId, versionCounter, triggerCount,
shared, tags, activeVersion, description
```

### Node Object Structure

Every node must have all of these fields:

```json
{
  "id": "unique-string-per-node",
  "name": "Human Readable Name",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4,
  "position": [200, 200],
  "parameters": {
    "url": "https://...",
    "method": "POST"
  }
}
```

#### Critical rules:
- `id` — unique within the workflow, can be any string (`"1"`, `"node-abc"`, UUID)
- `typeVersion` — **must match the node type** (see Section 3). Missing this is the #1 cause of import errors
- `position` — `[x, y]` in canvas pixels. Space nodes 220px apart horizontally
- `parameters` — node-specific, see Section 3

---

## 3. Node Type Reference

Complete reference for every node type used in this stack.

### Trigger Nodes

#### Webhook Trigger
```json
{
  "id": "webhook-1",
  "name": "Webhook Trigger",
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 1,
  "webhookId": "GENERATE-A-UUID-HERE",
  "position": [200, 200],
  "parameters": {
    "path": "amads/master-campaign",
    "httpMethod": "POST",
    "responseMode": "onReceived",
    "responseData": "allEntries"
  }
}
```

> **`webhookId` is mandatory.** Without it the workflow can be "active" in the API but the production webhook URL returns 404. Always generate a UUID v4 for this field.

#### Schedule / Cron Trigger
```json
{
  "id": "cron-1",
  "name": "Daily Schedule",
  "type": "n8n-nodes-base.scheduleTrigger",
  "typeVersion": 1,
  "position": [200, 200],
  "parameters": {
    "rule": {
      "interval": [
        {
          "field": "cronExpression",
          "expression": "0 9 * * *"
        }
      ]
    }
  }
}
```

> **Never use `n8n-nodes-base.cron`** — it is deprecated in n8n 1.x. Use `n8n-nodes-base.scheduleTrigger`.

#### Manual Trigger (for testing only)
```json
{
  "id": "manual-1",
  "name": "When clicking Test workflow",
  "type": "n8n-nodes-base.manualTrigger",
  "typeVersion": 1,
  "position": [200, 200],
  "parameters": {}
}
```

---

### Logic / Code Nodes

#### Code Node (JavaScript)
```json
{
  "id": "code-1",
  "name": "Parse Input",
  "type": "n8n-nodes-base.code",
  "typeVersion": 2,
  "position": [420, 200],
  "parameters": {
    "mode": "runOnceForAllItems",
    "jsCode": "const items = $input.all();\nreturn items.map(item => ({\n  json: {\n    campaign_id: 'CMP-' + Math.floor(Math.random() * 1000000),\n    ...item.json\n  }\n}));"
  }
}
```

> **Never use `n8n-nodes-base.function`** — deprecated. Always use `n8n-nodes-base.code` with `typeVersion: 2`.
> `mode` options: `"runOnceForAllItems"` (process all items at once) or `"runOnceForEachItem"` (loop).

#### IF / Branch
```json
{
  "id": "if-1",
  "name": "Check Status",
  "type": "n8n-nodes-base.if",
  "typeVersion": 2,
  "position": [640, 200],
  "parameters": {
    "conditions": {
      "options": { "caseSensitive": true },
      "conditions": [
        {
          "id": "cond-1",
          "leftValue": "={{ $json.status }}",
          "rightValue": "success",
          "operator": { "type": "string", "operation": "equals" }
        }
      ],
      "combinator": "and"
    }
  }
}
```

#### Merge
```json
{
  "id": "merge-1",
  "name": "Merge Results",
  "type": "n8n-nodes-base.merge",
  "typeVersion": 3,
  "position": [860, 200],
  "parameters": {
    "mode": "mergeByPosition"
  }
}
```

---

### HTTP / API Nodes

#### HTTP Request (most used)
```json
{
  "id": "http-1",
  "name": "Call OpenClaw",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4,
  "position": [640, 200],
  "parameters": {
    "url": "http://openclaw.railway.internal:8080/v1/agents/ceo-agent/run",
    "method": "POST",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        { "name": "Content-Type", "value": "application/json" }
      ]
    },
    "sendBody": true,
    "bodyParameters": {
      "parameters": [
        { "name": "campaign_id", "value": "={{ $json.campaign_id }}" },
        { "name": "brief", "value": "={{ $json.brief }}" }
      ]
    }
  }
}
```

For JSON body (instead of form parameters):
```json
"parameters": {
  "url": "http://openclaw.railway.internal:8080/v1/agents/ceo-agent/run",
  "method": "POST",
  "sendBody": true,
  "contentType": "json",
  "jsonBody": "={{ JSON.stringify($json) }}"
}
```

#### Respond to Webhook
```json
{
  "id": "respond-1",
  "name": "Respond",
  "type": "n8n-nodes-base.respondToWebhook",
  "typeVersion": 1,
  "position": [1080, 200],
  "parameters": {
    "respondWith": "json",
    "responseBody": "={{ JSON.stringify({ status: 'queued', campaign_id: $json.campaign_id }) }}"
  }
}
```

---

### Data Nodes

#### PostgreSQL
```json
{
  "id": "pg-1",
  "name": "Store in DB",
  "type": "n8n-nodes-base.postgres",
  "typeVersion": 2,
  "position": [860, 200],
  "parameters": {
    "operation": "insert",
    "schema": "amads",
    "table": "campaigns",
    "columns": "id,status,product_name,market,created_at",
    "additionalFields": {}
  },
  "credentials": {
    "postgres": {
      "id": "CREDENTIAL-ID-FROM-N8N",
      "name": "AMADS PostgreSQL"
    }
  }
}
```

> **Credential IDs**: Postgres credentials must be pre-configured in n8n UI (`Settings → Credentials`). After creating them, GET the credential ID from `GET /api/v1/credentials` and embed it in the node.

#### Set / Assign Variables
```json
{
  "id": "set-1",
  "name": "Format Payload",
  "type": "n8n-nodes-base.set",
  "typeVersion": 3,
  "position": [420, 200],
  "parameters": {
    "mode": "manual",
    "fields": {
      "values": [
        { "name": "campaign_id", "type": "string", "string": "={{ $json.campaign_id }}" },
        { "name": "status", "type": "string", "string": "processing" },
        { "name": "timestamp", "type": "string", "string": "={{ new Date().toISOString() }}" }
      ]
    },
    "options": {}
  }
}
```

---

## 4. Connection Format Specification

This is the most common mistake when building workflow JSON by hand.

### ❌ Wrong (flat array format — will 500 on import)

```json
"connections": {
  "Webhook Trigger": [
    { "node": "Parse Input", "type": "main", "index": 0 }
  ]
}
```

### ✅ Correct (nested object format — what n8n actually stores)

```json
"connections": {
  "Webhook Trigger": {
    "main": [
      [
        { "node": "Parse Input", "type": "main", "index": 0 }
      ]
    ]
  }
}
```

### How to read the structure:

```
connections[sourceName][outputType][outputPortIndex][connectionIndex]
                                   ^^^^^^^^^^^^^^^^^
                                   outer array = output ports (0 = first output, 1 = second, etc.)
                                   inner array = multiple connections from same port
```

### IF node example (two outputs: true / false):

```json
"connections": {
  "Check Status": {
    "main": [
      [
        { "node": "Success Handler", "type": "main", "index": 0 }
      ],
      [
        { "node": "Error Handler", "type": "main", "index": 0 }
      ]
    ]
  }
}
```

Output port 0 = `true` branch, output port 1 = `false` branch.

### Fan-out (one node → multiple parallel nodes):

```json
"connections": {
  "CEO Agent": {
    "main": [
      [
        { "node": "Research Pipeline", "type": "main", "index": 0 },
        { "node": "Creative Pipeline",  "type": "main", "index": 0 },
        { "node": "Strategy Pipeline",  "type": "main", "index": 0 }
      ]
    ]
  }
}
```

---

## 5. The Build Workflow (Step-by-Step)

This is Claude's exact process for building a new n8n workflow from a brief.

### Step 1 — Define the trigger

Decide: **Webhook** (called by something), **Schedule** (time-based), or **Sub-workflow** (called by another workflow with no trigger node).

For AMADS workflows:
- Entry points = Webhook trigger
- Cron jobs = scheduleTrigger
- Sub-workflows = no trigger node (called via HTTP Request from master)

### Step 2 — Map the data flow

Sketch the nodes in order:

```
Trigger → Parse/Validate → [AI Agent Call] → [Branch on result] → [Store / Notify] → Respond
```

Keep it linear when possible. Use IF nodes only when the flow genuinely branches.

### Step 3 — Generate UUIDs for webhook nodes

```python
import uuid
webhook_id = str(uuid.uuid4())
# e.g. "b8acdc55-60c6-4784-ac93-d2b0cdfe081a"
```

Every webhook node in the file must have a unique UUID in `webhookId`.

### Step 4 — Write the JSON

Use this template:

```json
{
  "name": "my-workflow-name",
  "nodes": [
    {
      "id": "1",
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "webhookId": "REPLACE-WITH-UUID",
      "position": [200, 300],
      "parameters": {
        "path": "amads/my-path",
        "httpMethod": "POST"
      }
    },
    {
      "id": "2",
      "name": "Process",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [420, 300],
      "parameters": {
        "mode": "runOnceForAllItems",
        "jsCode": "return $input.all().map(i => ({ json: { ...i.json, processed: true } }));"
      }
    }
  ],
  "connections": {
    "Webhook Trigger": {
      "main": [
        [{ "node": "Process", "type": "main", "index": 0 }]
      ]
    }
  },
  "settings": {
    "executionOrder": "v1"
  },
  "staticData": null
}
```

### Step 5 — Validate before sending

Run this mental checklist:

- [ ] Every node has `id`, `name`, `type`, `typeVersion`, `position`, `parameters`
- [ ] Every webhook node has `webhookId` (UUID)
- [ ] No deprecated node types (`function`, `functionItem`, `cron`)
- [ ] Connections use the nested `{ "main": [[...]] }` format
- [ ] Only allowed top-level keys: `name`, `nodes`, `connections`, `settings`, `staticData`
- [ ] File saved as UTF-8 (no BOM) — or the import script uses `utf-8-sig` encoding

---

## 6. The Import & Activation Sequence

### Phase 1 — Import

```python
import urllib.request, json, uuid

N8N_URL = "https://n8n-prim.up.railway.app"
N8N_KEY = "<api-key>"

def api(method, path, body=None):
    url = f"{N8N_URL}/api/v1{path}"
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers={
        "X-N8N-API-KEY": N8N_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
    })
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, json.loads(r.read())
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()

# Read with BOM-safe encoding
with open("my-workflow.json", "r", encoding="utf-8-sig") as f:
    workflow = json.load(f)

status, response = api("POST", "/workflows", workflow)
# Returns 201 with the created workflow including its assigned ID
workflow_id = response["id"]
print(f"Imported: {workflow_id}")
```

### Phase 2 — Add webhookId (if not already in the file)

```python
wh_id = str(uuid.uuid4())
for node in workflow["nodes"]:
    if node.get("type") == "n8n-nodes-base.webhook":
        node["webhookId"] = wh_id

# Strip read-only fields before PUT
PUT_ALLOWED = {"name", "nodes", "connections", "settings", "staticData"}
body = {k: v for k, v in workflow.items() if k in PUT_ALLOWED}

# Deactivate first (PUT while active can fail)
api("POST", f"/workflows/{workflow_id}/deactivate")

# PUT updated workflow
status, response = api("PUT", f"/workflows/{workflow_id}", body)
print(f"PUT: {status}")
```

### Phase 3 — Activate

```python
status, response = api("POST", f"/workflows/{workflow_id}/activate")
print(f"Active: {response.get('active')}")
```

### Complete one-shot import + activate function

```python
def import_and_activate(filepath):
    """Import a workflow file and activate it. Returns workflow ID."""
    with open(filepath, "r", encoding="utf-8-sig") as f:
        wf = json.load(f)

    # Ensure webhook nodes have IDs
    for node in wf.get("nodes", []):
        if node.get("type") == "n8n-nodes-base.webhook" and "webhookId" not in node:
            node["webhookId"] = str(uuid.uuid4())

    # Import
    status, resp = api("POST", "/workflows", wf)
    if status not in (200, 201):
        raise RuntimeError(f"Import failed HTTP {status}: {resp[:300]}")
    wf_id = resp["id"]
    print(f"  Imported: {wf_id}")

    # PUT with webhookId (stripped of read-only fields)
    PUT_ALLOWED = {"name", "nodes", "connections", "settings", "staticData"}
    body = {k: v for k, v in wf.items() if k in PUT_ALLOWED}
    api("POST", f"/workflows/{wf_id}/deactivate")
    api("PUT", f"/workflows/{wf_id}", body)

    # Activate
    status, resp = api("POST", f"/workflows/{wf_id}/activate")
    if status not in (200, 201):
        print(f"  Activation failed HTTP {status}: {resp[:200]}")
    else:
        print(f"  Active: {resp.get('active')}")

    return wf_id
```

---

## 7. The Testing Sequence

Run these tests in order. Stop at the first failure and resolve it (see Section 8) before continuing.

### T1 — API Connectivity

```python
status, resp = api("GET", "/workflows?limit=1")
assert status == 200, f"n8n API unreachable: {status}"
print(f"T1 PASS — n8n reachable, {len(resp['data'])} workflows exist")
```

### T2 — Workflow Exists and is Active

```python
status, wf = api("GET", f"/workflows/{workflow_id}")
assert status == 200
assert wf["active"] == True, "Workflow not active"
has_webhook_id = any(
    n.get("webhookId") for n in wf["nodes"]
    if n.get("type") == "n8n-nodes-base.webhook"
)
assert has_webhook_id, "Webhook node missing webhookId"
print("T2 PASS — workflow active and webhook node has ID")
```

### T3 — Production Webhook Responds

```python
import urllib.request, json, urllib.error

webhook_path = "amads/master-campaign"  # change to your path
test_payload = json.dumps({"test": True, "source": "T3"}).encode()

req = urllib.request.Request(
    f"https://n8n-prim.up.railway.app/webhook/{webhook_path}",
    data=test_payload, method="POST",
    headers={"Content-Type": "application/json"}
)
try:
    with urllib.request.urlopen(req, timeout=15) as r:
        body = r.read().decode()
        assert r.status == 200, f"Unexpected status: {r.status}"
        print(f"T3 PASS — webhook HTTP 200: {body[:100]}")
except urllib.error.HTTPError as e:
    print(f"T3 FAIL — HTTP {e.code}: {e.read().decode()[:200]}")
```

### T4 — Execution Was Logged

```python
import time
time.sleep(3)  # Give n8n time to log the execution

status, execs = api("GET", f"/executions?workflowId={workflow_id}&limit=1")
assert status == 200
latest = execs.get("data", [])
if latest:
    ex = latest[0]
    print(f"T4 PASS — execution {ex['id']}, status={ex['status']}, mode={ex.get('mode')}")
else:
    print("T4 WARN — no executions found yet (may still be running)")
```

### T5 — Full Payload Round-Trip

Send a realistic payload matching your actual use case:

```python
realistic_payload = {
    "productName": "Test Product KSA",
    "market": "KSA",
    "budget": 10000,
    "targetSegment": "Saudi males 25-35",
    "primaryGoal": "conversions",
}

req = urllib.request.Request(
    "https://n8n-prim.up.railway.app/webhook/amads/master-campaign",
    data=json.dumps(realistic_payload).encode(),
    method="POST",
    headers={"Content-Type": "application/json"}
)
with urllib.request.urlopen(req, timeout=15) as r:
    resp = json.loads(r.read())
    assert "message" in resp or "campaign_id" in resp
    print(f"T5 PASS — round-trip response: {resp}")
```

### T6 — Sub-workflows Reachable (for sub-workflow patterns)

For workflows that are called by HTTP Request rather than triggered:

```python
# These are imported but not activated — verify they exist
SUB_WORKFLOW_IDS = {
    "research-pipeline": "MNopDAjusEdpb0rP",
    "creative-pipeline": "PfjPvJPoAP6eibxt",
}
for name, wf_id in SUB_WORKFLOW_IDS.items():
    status, wf = api("GET", f"/workflows/{wf_id}")
    assert status == 200, f"{name} not found"
    print(f"T6 PASS — {name} exists (active={wf['active']})")
```

### Test Sequence Summary

```
T1 → API reachable
T2 → Workflow active + webhookId present
T3 → Webhook returns 200
T4 → Execution logged in n8n
T5 → Realistic payload accepted
T6 → Sub-workflows exist (if applicable)
```

All 6 passing = workflow is fully operational.

---

## 8. Problem Resolution Sequence

### Error: `HTTP 500 on POST /workflows` (import fails)

**Root causes and fixes in order:**

1. **Wrong connections format** (most common)
   - Symptom: `500 Internal Server Error` with no message body
   - Fix: Convert connections to nested format (see Section 4)

2. **Deprecated node type**
   - Symptom: `500` or `400 unknown node type`
   - Fix: Replace `n8n-nodes-base.function` → `n8n-nodes-base.code` with `typeVersion: 2` and rename `functionCode` → `jsCode`

3. **Missing `typeVersion`**
   - Symptom: `500` on specific node
   - Fix: Add `typeVersion` per the node type reference (Section 3)

4. **UTF-8 BOM in file**
   - Symptom: `JSONDecodeError: Unexpected UTF-8 BOM`
   - Fix: Open file with `encoding="utf-8-sig"` in Python

```python
# Diagnostic: pretty-print what n8n actually receives
import json
with open("my-workflow.json", "r", encoding="utf-8-sig") as f:
    wf = json.load(f)
print(json.dumps(wf, indent=2)[:2000])
```

---

### Error: `HTTP 400 "request/body must NOT have additional properties"` (on PUT)

**Root cause**: Sending read-only API fields in the PUT body.

**Fix**: Strip to allowed fields only:

```python
PUT_ALLOWED = {"name", "nodes", "connections", "settings", "staticData"}
body = {k: v for k, v in workflow.items() if k in PUT_ALLOWED}
```

Fields that commonly cause this: `id`, `active`, `createdAt`, `updatedAt`, `isArchived`, `meta`, `pinData`, `versionId`, `shared`, `tags`.

---

### Error: `HTTP 400 "request/body/active is read-only"` (on PUT)

Same as above — `active` cannot be set via PUT. Use the dedicated endpoints:
- Activate: `POST /workflows/{id}/activate`
- Deactivate: `POST /workflows/{id}/deactivate`

---

### Error: `HTTP 404 webhook "POST path" not registered` (webhook returns 404)

**Root cause**: One of:
1. Workflow is not active
2. Webhook node is missing `webhookId`
3. Workflow was imported/activated before `webhookId` was set

**Fix sequence**:

```python
import uuid

# Step 1: GET the workflow
_, wf = api("GET", f"/workflows/{workflow_id}")

# Step 2: Add webhookId to all webhook nodes
for node in wf.get("nodes", []):
    if node.get("type") == "n8n-nodes-base.webhook":
        if "webhookId" not in node:
            node["webhookId"] = str(uuid.uuid4())
            print(f"Added webhookId to: {node['name']}")

# Step 3: Deactivate
api("POST", f"/workflows/{workflow_id}/deactivate")

# Step 4: PUT with webhookId (stripped)
PUT_ALLOWED = {"name", "nodes", "connections", "settings", "staticData"}
api("PUT", f"/workflows/{workflow_id}", {k: v for k, v in wf.items() if k in PUT_ALLOWED})

# Step 5: Re-activate
_, resp = api("POST", f"/workflows/{workflow_id}/activate")
print(f"Active: {resp.get('active')}")

# Step 6: Test
import urllib.request
req = urllib.request.Request(
    f"https://n8n-prim.up.railway.app/webhook/{your_path}",
    data=b'{"test":true}', method="POST",
    headers={"Content-Type": "application/json"}
)
with urllib.request.urlopen(req, timeout=10) as r:
    print(f"Webhook: HTTP {r.status}")
```

---

### Error: `HTTP 400 "Workflow cannot be activated because it has no trigger node"`

**Root cause**: Workflow has no trigger — this is expected for sub-workflows.

**What to do**: Do not activate it. Sub-workflows (research-pipeline, creative-pipeline) are called by HTTP Request nodes from the master workflow. They don't need to be active to execute.

---

### Error: `HTTP 400 "Cannot publish workflow: node has configuration issues: Missing required credential"`

**Root cause**: A node references a credential (e.g., Postgres, Airtable, OpenAI) that doesn't exist in this n8n instance yet.

**Fix sequence**:

1. Open n8n UI: `https://n8n-prim.up.railway.app`
2. Go to `Settings → Credentials → Add Credential`
3. Create the credential (e.g., PostgreSQL with Railway internal URL)
4. Go to the workflow, open the failing node, select the credential from the dropdown
5. Save and activate via UI toggle

Or via API — get the credential ID first:

```python
status, creds = api("GET", "/credentials")
for c in creds.get("data", []):
    print(c["id"], c["name"], c["type"])
```

Then embed it in the node:

```json
"credentials": {
  "postgres": {
    "id": "abc123",
    "name": "AMADS PostgreSQL"
  }
}
```

---

### Error: `HTTP 422 "The amads-v1 branch has no history in common with master"` (GitHub PR)

Not an n8n error — orphan git branches. Fix: `git merge --allow-unrelated-histories`, resolve conflicts, push to master.

---

### Execution Fails Silently (workflow activates but does nothing)

Check execution history:

```python
status, execs = api("GET", f"/executions?workflowId={workflow_id}&limit=5")
for ex in execs.get("data", []):
    print(f"  {ex['id']} status={ex['status']} startedAt={ex.get('startedAt')}")
    if ex["status"] == "error":
        # GET full execution details
        _, detail = api("GET", f"/executions/{ex['id']}")
        for node_name, node_data in detail.get("data", {}).get("resultData", {}).get("runData", {}).items():
            for run in node_data:
                if run.get("error"):
                    print(f"    Node [{node_name}] error: {run['error'].get('message')}")
```

---

## 9. Full Reference Scripts

### `import_n8n.py` — Transform and batch-import workflows

Handles BOM, wrong connection format, deprecated node types, and UTF-8 encoding.
Location: `amads/import_n8n.py`

**Key transforms it applies:**
- `connections` flat array → nested `{ "main": [[...]] }` format
- `n8n-nodes-base.function` → `n8n-nodes-base.code` with `typeVersion: 2`
- `n8n-nodes-base.cron` → `n8n-nodes-base.scheduleTrigger`
- Adds `typeVersion: 1` to any node missing it
- Opens files with `utf-8-sig` to strip BOM

### `activate_n8n.py` — Activate imported workflows by ID

Takes known workflow IDs, tries `POST /activate`, falls back to full GET→PUT→activate cycle.
Location: `amads/activate_n8n.py`

---

## Quick Reference Card

```
IMPORT A WORKFLOW
─────────────────
POST /api/v1/workflows          body = { name, nodes, connections, settings, staticData }

FIX WEBHOOK (after import)
──────────────────────────
POST /api/v1/workflows/{id}/deactivate
PUT  /api/v1/workflows/{id}     body = strip to PUT_ALLOWED only, add webhookId UUID to webhook nodes
POST /api/v1/workflows/{id}/activate

TEST WEBHOOK
────────────
curl -X POST https://n8n-prim.up.railway.app/webhook/amads/master-campaign \
  -H "Content-Type: application/json" \
  -d '{"productName":"Test","market":"KSA"}'

CHECK EXECUTIONS
────────────────
GET /api/v1/executions?workflowId={id}&limit=5
GET /api/v1/executions/{execId}

NODE TYPEVERSION CHEAT SHEET
────────────────────────────
webhook           → 1
scheduleTrigger   → 1
manualTrigger     → 1
code              → 2
httpRequest       → 4
if                → 2
merge             → 3
set               → 3
postgres          → 2
respondToWebhook  → 1

DEPRECATED → REPLACEMENT
─────────────────────────
function      → code (typeVersion 2, jsCode param)
functionItem  → code (mode: runOnceForEachItem)
cron          → scheduleTrigger

PUT_ALLOWED FIELDS ONLY
────────────────────────
name, nodes, connections, settings, staticData
```

---

*Last updated: 2026-04-03 | Stack: n8n on Railway + Paperclip + OpenClaw + PostgreSQL + Vercel*
