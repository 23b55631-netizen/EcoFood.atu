from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

root = Path(__file__).resolve().parent
destination = root / 'output' / 'pdf' / 'EcoFood-ATU-logo.pdf'
destination.parent.mkdir(parents=True, exist_ok=True)
image = ImageReader(str(root / 'dist' / 'assets' / 'ecofood-atu-combined.png'))
width, height = image.getSize()
page_width = 842
page_height = page_width * height / width
document = canvas.Canvas(str(destination), pagesize=(page_width, page_height))
document.setTitle('EcoFood ATU — Sustainable Campus')
document.drawImage(image, 0, 0, width=page_width, height=page_height)
document.showPage()
document.save()
print(destination)
