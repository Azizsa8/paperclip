"""
Transform and import AMADS workflows into n8n.
The workflow files have a simplified connections format that needs to be
converted to n8n's actual format before import via the REST API.
"""

import json
import os
import sys
import urllib.request
import urllib.error

N8N_URL = "https://n8n-prim.up.railway.app"
N8N_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MzM1MTkyMC0yZmRkLTRiN2UtODJkMi03MWQ0ZDczN2IzYTYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNWFiNjdjZmItOGY0My00NmM5LWExNWQtNGFhNGE4ZGQ0ZDQ2IiwiaWF0IjoxNzc1MTYxMDcxfQ.q5EjPBgO33OX7zl7Z34Wr9PGVyuYrxTiXHHIGSuZmJo"

WORKFLOWS_DIR = os.path.join(os.path.dirname(__file__), "workflows")

WORKFLOW_FILES = [
    "master-campaign-workflow.json",
    "research-pipeline.json",
    "creative-pipeline.json",
    "publishing-scheduler.json",
    "analytics-collector.json",
    "daily-report-generator.json",
]


def fix_connections(raw_connections):
    """
    Convert simplified connections format to n8n's actual format.

    Input:  { "NodeA": [{ "node": "NodeB", "type": "main", "index": 0 }] }
    Output: { "NodeA": { "main": [[{ "node": "NodeB", "type": "main", "index": 0 }]] } }
    """
    fixed = {}
    for source_node, targets in raw_connections.items():
        if isinstance(targets, dict):
            # Already in correct format
            fixed[source_node] = targets
            continue
        # targets is a list of connection objects
        # Group by (type, index) to build the nested structure
        by_type = {}
        for conn in targets:
            conn_type = conn.get("type", "main")
            conn_index = conn.get("index", 0)
            if conn_type not in by_type:
                by_type[conn_type] = {}
            if conn_index not in by_type[conn_type]:
                by_type[conn_type][conn_index] = []
            by_type[conn_type][conn_index].append({
                "node": conn["node"],
                "type": conn_type,
                "index": conn_index,
            })
        # Convert to array-of-arrays format
        result = {}
        for conn_type, index_map in by_type.items():
            max_idx = max(index_map.keys())
            arr = []
            for i in range(max_idx + 1):
                arr.append(index_map.get(i, []))
            result[conn_type] = arr
        fixed[source_node] = result
    return fixed


def fix_nodes(nodes):
    """Add typeVersion and fix deprecated node types."""
    fixed = []
    for node in nodes:
        n = dict(node)
        # Add typeVersion if missing
        if "typeVersion" not in n:
            node_type = n.get("type", "")
            if node_type == "n8n-nodes-base.webhook":
                n["typeVersion"] = 1
            elif node_type in ("n8n-nodes-base.function", "n8n-nodes-base.functionItem"):
                # Migrate to code node (n8n 1.x+)
                n["type"] = "n8n-nodes-base.code"
                n["typeVersion"] = 2
                params = n.get("parameters", {})
                # functionCode → jsCode
                if "functionCode" in params:
                    n["parameters"] = {
                        "jsCode": params["functionCode"],
                        "mode": "runOnceForAllItems",
                    }
            elif node_type == "n8n-nodes-base.httpRequest":
                n["typeVersion"] = 4
            elif node_type == "n8n-nodes-base.cron":
                n["type"] = "n8n-nodes-base.scheduleTrigger"
                n["typeVersion"] = 1
            else:
                n["typeVersion"] = 1
        fixed.append(n)
    return fixed


def transform_workflow(raw):
    """Transform raw workflow JSON into valid n8n API payload."""
    return {
        "name": raw.get("name", "Imported Workflow"),
        "nodes": fix_nodes(raw.get("nodes", [])),
        "connections": fix_connections(raw.get("connections", {})),
        "settings": raw.get("settings", {}),
        "staticData": raw.get("staticData", None),
    }


def api_request(method, path, body=None):
    """Make an authenticated request to the n8n REST API."""
    url = f"{N8N_URL}/api/v1{path}"
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "X-N8N-API-KEY": N8N_KEY,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        return e.code, body


def activate_workflow(workflow_id):
    """Activate a workflow by ID."""
    # n8n v1 API uses POST /workflows/{id}/activate
    status, resp = api_request("POST", f"/workflows/{workflow_id}/activate")
    if status not in (200, 201):
        # Fallback: PUT with active flag
        status, resp = api_request("PUT", f"/workflows/{workflow_id}", {"active": True})
    return status, resp


def main():
    print(f"{'='*60}")
    print("AMADS n8n Workflow Import")
    print(f"{'='*60}\n")

    # Test connectivity
    status, resp = api_request("GET", "/workflows?limit=5")
    if status != 200:
        print(f"[ERROR] Cannot reach n8n API: HTTP {status}")
        print(resp)
        sys.exit(1)
    print(f"[OK] Connected to n8n — {len(resp.get('data', []))} existing workflows\n")

    imported_ids = []

    for filename in WORKFLOW_FILES:
        filepath = os.path.join(WORKFLOWS_DIR, filename)
        print(f"--- {filename} ---")

        with open(filepath, "r", encoding="utf-8-sig") as f:
            raw = json.load(f)

        payload = transform_workflow(raw)
        print(f"  Nodes: {len(payload['nodes'])}  Connections: {len(payload['connections'])}")

        status, resp = api_request("POST", "/workflows", payload)
        if status in (200, 201):
            wf_id = resp.get("id") or resp.get("data", {}).get("id")
            print(f"  [IMPORTED] id={wf_id}")
            imported_ids.append(wf_id)
        else:
            print(f"  [FAILED] HTTP {status}")
            print(f"  {resp[:300] if isinstance(resp, str) else json.dumps(resp)[:300]}")
            print()
            continue

        # Activate
        act_status, act_resp = activate_workflow(wf_id)
        if act_status in (200, 201):
            print(f"  [ACTIVATED]")
        else:
            print(f"  [ACTIVATE FAILED] HTTP {act_status}: {act_resp}")
        print()

    print(f"{'='*60}")
    print(f"Done. {len(imported_ids)}/{len(WORKFLOW_FILES)} workflows imported.")
    if imported_ids:
        print(f"Workflow IDs: {imported_ids}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
