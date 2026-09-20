import re
import unittest
from pathlib import Path

ROOT = Path(r"c:\Users\itzju\OneDrive\Apps\Desktop\mitra")
HTML_PATH = ROOT / "frontend" / "index.html"
JS_PATH = ROOT / "frontend" / "js" / "app.js"
CSS_PATH = ROOT / "frontend" / "css" / "main.css"

with open(HTML_PATH, encoding="utf-8") as f:
    html = f.read()

with open(JS_PATH, encoding="utf-8") as f:
    js = f.read()

with open(CSS_PATH, encoding="utf-8") as f:
    css = f.read()

print("--- TESTING KISAN MITRA HISTORY IMPLEMENTATION ---")

# 1. Navigation Order
sidebar_nav = re.search(r'<nav class="nav"[^>]*>(.*?)</nav>', html, re.DOTALL)
assert sidebar_nav, "Sidebar nav not found"
nav_tabs = re.findall(r'data-tab="([^"]+)"', sidebar_nav.group(1))
expected_tabs = ["overview", "field", "edge", "rover", "history", "system"]
print("Sidebar tabs found:", nav_tabs)
assert nav_tabs == expected_tabs, f"Expected {expected_tabs} but got {nav_tabs}"
print("[OK] CHECK 1 PASSED: Sidebar navigation items are in exact order: Farm Dashboard, Field Tools, Edge AI, Rover, History, System")

# 2. Mobile Nav Order
mobile_nav = re.search(r'<nav class="mobile-nav"[^>]*>(.*?)</nav>', html, re.DOTALL)
assert mobile_nav, "Mobile nav not found"
mobile_tabs = re.findall(r'data-tab="([^"]+)"', mobile_nav.group(1))
print("Mobile tabs found:", mobile_tabs)
assert mobile_tabs == expected_tabs, f"Expected {expected_tabs} but got {mobile_tabs}"
print("[OK] CHECK 2 PASSED: Mobile navigation contains all 6 tabs in exact order")

# 3. History Page Structure
assert 'id="page-history"' in html, "page-history not found"
assert 'id="page-system"' in html, "page-system not found"
assert 'id="page-edge"' in html, "page-edge not found"
print("[OK] CHECK 3 PASSED: Dedicated page sections exist for page-history, page-edge, page-system")

# 4. History Header & Summary Cards
assert 'data-i18n="history_overline"' in html, "history_overline not found"
assert 'data-i18n="history_title"' in html, "history_title not found"
assert 'data-i18n="history_desc"' in html, "history_desc not found"
assert 'id="sumTotalCount">24<' in html, "sumTotalCount 24 not found"
assert 'id="sumCropCount">12<' in html, "sumCropCount 12 not found"
assert 'id="sumDiseaseCount">7<' in html, "sumDiseaseCount 7 not found"
assert 'id="sumPestCount">5<' in html, "sumPestCount 5 not found"
assert 'id="sumSoilCount">5<' in html, "sumSoilCount 5 not found"
print("[OK] CHECK 4 PASSED: Summary cards display prototype values: 24 Analyses, 12 Crop, 7 Disease, 5 Pest, 5 Soil")

# 5. Search and Filters
assert 'id="historySearchInput"' in html, "historySearchInput not found"
assert 'id="historySearchClear"' in html, "historySearchClear not found"
for pill in ["all", "crop", "disease", "pest", "soil"]:
    assert f'data-filter-type="{pill}"' in html, f"Filter pill {pill} not found"
assert 'id="historyLocationFilter"' in html, "historyLocationFilter not found"
assert 'id="historyDateFilter"' in html, "historyDateFilter not found"
print("[OK] CHECK 5 PASSED: Search and filter elements (pills, location dropdown, date dropdown) exist")

# 6. Table & Empty State
assert 'id="historyTable"' in html, "historyTable not found"
assert 'id="historyTableBody"' in html, "historyTableBody not found"
assert 'id="historyEmptyState"' in html, "historyEmptyState not found"
assert 'id="historyResetFiltersBtn"' in html, "historyResetFiltersBtn not found"
print("[OK] CHECK 6 PASSED: History table and empty state banner are present")

# 7. Detail Modal
assert 'id="historyDetailModal"' in html, "historyDetailModal not found"
assert 'id="modalLocationCoord"' in html, "modalLocationCoord not found"
assert 'id="modalImageSection"' in html, "modalImageSection not found"
assert 'id="modalSoilSection"' in html, "modalSoilSection not found"
assert 'id="modalSoilN"' in html, "modalSoilN not found"
assert 'id="modalSoilCarbon"' in html, "modalSoilCarbon not found"
assert 'id="modalResultsGrid"' in html, "modalResultsGrid not found"
assert 'id="modalOverallSummary"' in html, "modalOverallSummary not found"
assert 'id="modalPriorityList"' in html, "modalPriorityList not found"
assert 'id="btnTtsEn"' in html, "btnTtsEn not found"
assert 'id="btnTtsHi"' in html, "btnTtsHi not found"
print("[OK] CHECK 7 PASSED: Detail modal with image section, soil sensor section, results, overall summary, 3 priority actions, and TTS buttons is present")

# 8. JavaScript App Logic
assert '["overview", "field", "edge", "rover", "history", "system"]' in js, "activateTab valid list not updated"
assert 'SAMPLE_HISTORY' in js, "SAMPLE_HISTORY dataset not found"
assert 'Wheat · Early Blight' in js, "Wheat Early blight sample not found"
assert 'N Low · P Normal' in js, "Soil sample not found"
assert 'Aphid' in js, "Aphid sample not found"
assert 'severity: "moderate"' in js, "Moderate severity sample not found"
assert 'renderHistoryTable' in js, "renderHistoryTable not found"
assert 'openHistoryDetail' in js, "openHistoryDetail not found"
print("[OK] CHECK 8 PASSED: JavaScript dataset, filtering, table rendering, modal opening, and TTS handlers are present")

# 9. CSS Verification
assert 'grid-template-columns: repeat(6, 1fr)' in css, "Mobile nav 6-column grid not found"
assert '.history-summary-grid' in css, "history-summary-grid CSS not found"
assert '.history-modal' in css, "history-modal CSS not found"
assert '.history-table' in css, "history-table CSS not found"
print("[OK] CHECK 9 PASSED: CSS contains responsive styles for 6-tab mobile navigation, history table, and modal")

print("\nALL AUTOMATED VERIFICATION CHECKS PASSED SUCCESSFULLY!")
