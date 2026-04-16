from pypdf import PdfReader
from pathlib import Path
pdf_path = Path("Cyber Techies.pdf")
out_path = Path("Cyber_Techies_extracted.txt")
reader = PdfReader(str(pdf_path))
parts = []
for i, page in enumerate(reader.pages, start=1):
    text = page.extract_text() or ""
    parts.append(f"\n\n===== PAGE {i} =====\n")
    parts.append(text)
out_path.write_text("".join(parts), encoding="utf-8")
print(f"pages={len(reader.pages)}")
print(f"output={out_path}")
