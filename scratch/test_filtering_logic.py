import json
import re

with open(r"c:\Users\itzju\OneDrive\Apps\Desktop\mitra\frontend\js\app.js", encoding="utf-8") as f:
    content = f.read()

match = re.search(r'const SAMPLE_HISTORY = (\[.*?\]);\s*\nlet historySearchQuery', content, re.DOTALL)
assert match, "Could not extract SAMPLE_HISTORY from app.js"

# Clean JS object to JSON
raw_js = match.group(1)
null = None
# Convert JS array to Python dicts by quoting keys
raw_py = raw_js.replace("null", "None")
raw_py = re.sub(r'(?<=[{,\s])([a-zA-Z_][a-zA-Z0-9_]*)\s*:', r"'\1':", raw_py)
records = eval(raw_py)
print(f"Loaded {len(records)} sample history records from app.js")

# Test 1: Record 1 properties
r1 = records[0]
assert r1["location"] == "C2"
assert "crop" in r1["types"] and "disease" in r1["types"]
assert r1["crop"]["confidence"] == 96
assert r1["disease"]["confidence"] == 91
assert r1["disease"]["severity"] == "moderate"
print("[OK] Test 1: Record 1 has separate confidence (91) and severity (moderate)")

# Test 2: Soil record 2 properties
r2 = records[1]
assert r2["location"] == "B3"
assert r2["types"] == ["soil"]
assert r2["crop"] is None
assert r2["soil"]["n_en"] == "Low"
assert r2["soil"]["p_en"] == "Normal"
assert r2["soil"]["k_en"] == "Good"
assert r2["soil"]["ph"] == 6.5
assert r2["soil"]["moisture"] == "42%"
assert r2["soil"]["ec"] == "0.62 mS/cm"
assert r2["soil"]["carbon"] == "0.70%"
print("[OK] Test 2: Record 2 has all 7 soil assessment sensor metrics and no image")

# Test 3: Pest record 3 properties
r3 = records[2]
assert r3["location"] == "A4"
assert r3["types"] == ["pest"]
assert r3["pest"]["confidence"] == 87
print("[OK] Test 3: Record 3 has pest Aphid at 87% confidence")

# Test 4: Record 4 properties
r4 = records[3]
assert r4["location"] == "D1"
assert r4["types"] == ["crop"]
assert r4["crop"]["confidence"] == 94
print("[OK] Test 4: Record 4 has crop Wheat at 94% confidence")

# Test 5: Type filtering simulation
def filter_history(records, search="", type_filter="all", loc_filter="all", date_filter="all"):
    q = search.strip().lower()
    out = []
    for item in records:
        if type_filter != "all" and type_filter not in item["types"]:
            continue
        if loc_filter != "all" and item["location"] != loc_filter:
            continue
        if date_filter != "all" and item["dateGroup"] != date_filter:
            continue
        if q:
            match = (q in item["result_en"].lower() or 
                     q in item["result_hi"].lower() or 
                     q in item["datetime"].lower() or 
                     q in item["datetime_hi"].lower() or 
                     q in item["location"].lower() or
                     any(q in tp for tp in item["types"]))
            if not match:
                continue
        out.append(item)
    return out

# Filter by Soil
soils = filter_history(records, type_filter="soil")
assert len(soils) == 2, f"Expected 2 soil records, got {len(soils)}"
assert all("soil" in s["types"] for s in soils)
print("[OK] Test 5: Type filter 'soil' correctly returns only soil records")

# Filter by Location C2
c2_recs = filter_history(records, loc_filter="C2")
assert len(c2_recs) == 2, f"Expected 2 C2 records, got {len(c2_recs)}"
assert all(c["location"] == "C2" for c in c2_recs)
print("[OK] Test 6: Location filter 'C2' correctly returns only C2 records")

# Search for "Wheat"
wheat_recs = filter_history(records, search="Wheat")
assert len(wheat_recs) == 2
print("[OK] Test 7: Search 'Wheat' correctly matches crop records")

# Search for nonexistent term
empty = filter_history(records, search="xyz_nonexistent_999")
assert len(empty) == 0
print("[OK] Test 8: Nonexistent search returns 0 records (empty state)")

print("\nALL LOGIC TESTS PASSED SUCCESSFULLY!")
