import json
from datetime import datetime
from pathlib import Path

FILE = Path(__file__).parent / "reflections.json"

# Load existing data (or start empty)
try:
    reflections = json.loads(FILE.read_text(encoding="utf-8"))
    if not isinstance(reflections, list):
        reflections = []
except Exception:
    reflections = []

# Ask user for a reflection
text = input("Type your reflection: ").strip()

if not text:
    print("Nothing typed, so nothing was saved.")
    raise SystemExit

# Make a new entry
entry = {
    "date": datetime.now().strftime("%Y-%m-%d"),
    "reflection": text
}

# Add it to the list and save
reflections.append(entry)
FILE.write_text(json.dumps(reflections, indent=2), encoding="utf-8")

print("Saved! ✅ Open reflections.json to see it.")
