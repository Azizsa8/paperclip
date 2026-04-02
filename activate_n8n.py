"""Activate already-imported AMADS workflows."""
import json
import urllib.request
import urllib.error

N8N_URL = "https://n8n-prim.up.railway.app"
N8N_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MzM1MTkyMC0yZmRkLTRiN2UtODJkMi03MWQ0ZDczN2IzYTYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNWFiNjdjZmItOGY0My00NmM5LWExNWQtNGFhNGE4ZGQ0ZDQ2IiwiaWF0IjoxNzc1MTYxMDcxfQ.q5EjPBgO33OX7zl7Z34Wr9PGVyuYrxTiXHHIGSuZmJo"

WORKFLOW_IDS = [
    ("master-campaign-workflow",  "VI8KspcjvJnlptaZ"),
    ("research-pipeline",         "MNopDAjusEdpb0rP"),
    ("creative-pipeline",         "PfjPvJPoAP6eibxt"),
    ("publishing-scheduler",      "nlvAHNNZqTGW5BZq"),
    ("analytics-collector",       "IiDlZNerUlqaWCyJ"),
    ("daily-report-generator",    "zlxyxW6Trhc0vpM9"),
]


def api(method, path, body=None):
    url = f"{N8N_URL}/api/v1{path}"
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(
        url, data=data, method=method,
        headers={"X-N8N-API-KEY": N8N_KEY, "Content-Type": "application/json", "Accept": "application/json"},
    )
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, json.loads(r.read())
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode(errors="replace")


print("Activating AMADS workflows...\n")
for name, wf_id in WORKFLOW_IDS:
    # Try POST /activate first
    status, resp = api("POST", f"/workflows/{wf_id}/activate")
    if status in (200, 201):
        active = resp.get("active", "?") if isinstance(resp, dict) else "?"
        print(f"  [OK] {name} — active={active}")
        continue

    # Fallback: fetch workflow, set active=true, PUT it back
    get_status, wf = api("GET", f"/workflows/{wf_id}")
    if get_status != 200:
        print(f"  [FAIL] {name} — could not GET workflow: HTTP {get_status}")
        continue

    if isinstance(wf, dict):
        wf["active"] = True
        put_status, put_resp = api("PUT", f"/workflows/{wf_id}", wf)
        if put_status in (200, 201):
            print(f"  [OK via PUT] {name}")
        else:
            print(f"  [FAIL PUT] {name} HTTP {put_status}: {str(put_resp)[:200]}")
    else:
        print(f"  [FAIL] {name} — unexpected response: HTTP {status}: {str(resp)[:200]}")

print("\nDone.")
