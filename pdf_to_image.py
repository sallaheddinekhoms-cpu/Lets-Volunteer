import os
import pymupdf

base_dir = r"c:\Users\Gtech2023\Desktop\projet02\Lets-Volunteer"
pdf_path = os.path.join(base_dir, "volunteer_table.pdf")
img_artifact_dir = r"C:\Users\Gtech2023\.gemini\antigravity\brain\efa57119-942a-4ce4-90a5-0c1bc24cc349"
img_path_artifact = os.path.join(img_artifact_dir, "volunteer_hours_system.png")
img_path_local = os.path.join(base_dir, "volunteer_hours_system.png")

pdf_doc = pymupdf.open(pdf_path)
page = pdf_doc[0]
zoom = 300 / 72  # 300 DPI for ultra-sharp clarity
mat = pymupdf.Matrix(zoom, zoom)
pix = page.get_pixmap(matrix=mat, alpha=False)

os.makedirs(img_artifact_dir, exist_ok=True)
pix.save(img_path_artifact)
pix.save(img_path_local)

print(f"SUCCESS: Image saved to:\n{img_path_artifact}\n{img_path_local}")
