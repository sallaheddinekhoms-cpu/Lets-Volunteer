import os
import sys
import arabic_reshaper
from bidi.algorithm import get_display
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import pymupdf

def ar(text):
    if not text:
        return ""
    lines = str(text).split("<br/>")
    processed = []
    for line in lines:
        reshaped = arabic_reshaper.reshape(line.strip())
        processed.append(get_display(reshaped))
    return "<br/>".join(processed)

base_dir = r"c:\Users\Gtech2023\Desktop\projet02\Lets-Volunteer"
font_regular = os.path.join(base_dir, "backend", "api", "assets", "fonts", "Amiri-Regular.ttf")
font_bold = os.path.join(base_dir, "backend", "api", "assets", "fonts", "Amiri-Bold.ttf")

pdfmetrics.registerFont(TTFont("Amiri", font_regular))
pdfmetrics.registerFont(TTFont("Amiri-Bold", font_bold))

pdf_path = os.path.join(base_dir, "organization_table.pdf")
img_artifact_dir = r"C:\Users\Gtech2023\.gemini\antigravity\brain\efa57119-942a-4ce4-90a5-0c1bc24cc349"
img_path_artifact = os.path.join(img_artifact_dir, "organization_evaluation_system.png")
img_path_local = os.path.join(base_dir, "organization_evaluation_system.png")

doc = SimpleDocTemplate(
    pdf_path,
    pagesize=(842, 630),
    leftMargin=24,
    rightMargin=24,
    topMargin=20,
    bottomMargin=20
)

styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    "TitleStyle",
    fontName="Amiri-Bold",
    fontSize=18,
    leading=24,
    alignment=1,
    textColor=colors.HexColor("#0F766E") # Dark Teal
)

subtitle_style = ParagraphStyle(
    "SubtitleStyle",
    fontName="Amiri",
    fontSize=10.5,
    leading=15,
    alignment=1,
    textColor=colors.HexColor("#0D9488")
)

header_cell_style = ParagraphStyle(
    "HeaderCell",
    fontName="Amiri-Bold",
    fontSize=10.5,
    leading=14,
    alignment=1,
    textColor=colors.white
)

cell_bold = ParagraphStyle(
    "CellBold",
    fontName="Amiri-Bold",
    fontSize=9.5,
    leading=13,
    alignment=2,
    textColor=colors.HexColor("#1E293B")
)

cell_regular = ParagraphStyle(
    "CellReg",
    fontName="Amiri",
    fontSize=8.5,
    leading=12.5,
    alignment=2,
    textColor=colors.HexColor("#334155")
)

badge_teal = ParagraphStyle("BT", fontName="Amiri-Bold", fontSize=9, leading=12, alignment=1, textColor=colors.HexColor("#0F766E"))
badge_blue = ParagraphStyle("BB", fontName="Amiri-Bold", fontSize=9, leading=12, alignment=1, textColor=colors.HexColor("#1E40AF"))
badge_purple = ParagraphStyle("BP", fontName="Amiri-Bold", fontSize=9, leading=12, alignment=1, textColor=colors.HexColor("#6B21A8"))
badge_amber = ParagraphStyle("BA", fontName="Amiri-Bold", fontSize=9, leading=12, alignment=1, textColor=colors.HexColor("#92400E"))
badge_rose = ParagraphStyle("BR", fontName="Amiri-Bold", fontSize=9, leading=12, alignment=1, textColor=colors.HexColor("#9F1239"))

elements = []

elements.append(Paragraph(ar("الجمهورية الجزائرية الديمقراطية الشعبية • منصة «لنتطوع»"), subtitle_style))
elements.append(Spacer(1, 3))
elements.append(Paragraph(ar("المؤشر الوطني لتقييم وتثمين أداء وتميز الهيئات التطوعية"), title_style))
elements.append(Spacer(1, 3))
elements.append(Paragraph(ar("مصفوفة معايير الأثر المجتمعي، نشر الفكر التطوعي، جودة التأطير، والموثوقية القانونية (قانون 12-06)"), subtitle_style))
elements.append(Spacer(1, 10))

# Table columns Left to Right for natural RTL:
# 0: الهدف والأثر
# 1: رصيد النقاط المعتمد
# 2: طريقة الاحتساب والآلية
# 3: المعيار والمؤشر التطبيقي
# 4: الركيزة والمحور الأساسي
col_widths = [190, 124, 170, 175, 135]

data = [
    [
        Paragraph(ar("الهدف والأثر الإيجابي"), header_cell_style),
        Paragraph(ar("رصيد النقاط المعتمد"), header_cell_style),
        Paragraph(ar("طريقة الاحتساب والآلية"), header_cell_style),
        Paragraph(ar("المعيار والمؤشر التطبيقي"), header_cell_style),
        Paragraph(ar("الركيزة والمحور الأساسي"), header_cell_style),
    ],
    # 1. Culture & Training (30%)
    [
        Paragraph(ar("بناء قدرات الشباب وتحويل التطوع لمهارات"), cell_regular),
        Paragraph(ar("+15 نقطة / دورة"), badge_teal),
        Paragraph(ar("تنظيم واعتماد دورة تدريبية للمتطوعين"), cell_regular),
        Paragraph(ar("تنظيم دورات تكوينية وتأهيلية"), cell_bold),
        Paragraph(ar("1. نشر الفكر والتكوين (30%)"), cell_bold),
    ],
    [
        Paragraph(ar("نشر ثقافة العطاء وإبراز النماذج الملهمة"), cell_regular),
        Paragraph(ar("+5 نقاط / مقال أو تقرير"), badge_teal),
        Paragraph(ar("مقالات، فيديوهات، وتغطيات مصورة"), cell_regular),
        Paragraph(ar("نشر تقارير الأثر والقصص الملهمة"), cell_bold),
        Paragraph(ar("1. نشر الفكر والتكوين (30%)"), cell_bold),
    ],
    # 2. Volunteer Care & Quality (30%)
    [
        Paragraph(ar("ضمان بيئة تطوعية آمنة ومحترمة"), cell_regular),
        Paragraph(ar("حسب المتوسط (× 10)"), badge_blue),
        Paragraph(ar("تقييم المتطوعين بعد كل نشاط (1 - 5)"), cell_regular),
        Paragraph(ar("تقييم المتطوعين للجمعية والتأطير"), cell_bold),
        Paragraph(ar("2. جودة التأطير والرعاية (30%)"), cell_bold),
    ],
    [
        Paragraph(ar("احترام جهد المتطوع وسرعة مكافأته رسمياً"), cell_regular),
        Paragraph(ar("+10 نقاط بونص"), badge_blue),
        Paragraph(ar("خلال 48 ساعة من نهاية الحملة"), cell_regular),
        Paragraph(ar("سرعة اعتماد الساعات وإصدار الشهادات"), cell_bold),
        Paragraph(ar("2. جودة التأطير والرعاية (30%)"), cell_bold),
    ],
    # 3. Youth Recruitment & Activity (25%)
    [
        Paragraph(ar("توسيع قاعدة المتطوعين وكسر حاجز التردد"), cell_regular),
        Paragraph(ar("+5 نقاط / متطوع جديد"), badge_purple),
        Paragraph(ar("أول فرصة تطوعية له في المنصة عبرها"), cell_regular),
        Paragraph(ar("بوابة الانطلاق لمتطوعين جدد"), cell_bold),
        Paragraph(ar("3. استقطاب وتفعيل الشباب (25%)"), cell_bold),
    ],
    [
        Paragraph(ar("استدامة النشاط وعدم الاقتصار على المناسبات"), cell_regular),
        Paragraph(ar("+10 نقاط دورية"), badge_purple),
        Paragraph(ar("تنظيم حملات منتظمة ومستمرة سنوياً"), cell_regular),
        Paragraph(ar("الاستمرارية وتنوع المبادرات الميدانية"), cell_bold),
        Paragraph(ar("3. استقطاب وتفعيل الشباب (25%)"), cell_bold),
    ],
    # 4. Transparency & Legal Compliance (15%)
    [
        Paragraph(ar("تعزيز الثقة الرسمية والمجتمعية بالهيئة"), cell_regular),
        Paragraph(ar("+20 نقطة افتتاحية"), badge_amber),
        Paragraph(ar("رقم الاعتماد، تاريخه، ومطابقة القانون 12-06"), cell_regular),
        Paragraph(ar("الاعتماد الرسمي والملف القانوني"), cell_bold),
        Paragraph(ar("4. الشفافية والموثوقية (15%)"), cell_bold),
    ],
    [
        Paragraph(ar("الاحترافية في التسيير وقياس الأثر المجتمعي"), cell_regular),
        Paragraph(ar("+10 نقاط / حملة موثقة"), badge_amber),
        Paragraph(ar("عدد المستفيدين، قفف، مناطق، كميات عينية"), cell_regular),
        Paragraph(ar("توثيق مخرجات الأنشطة بالأرقام"), cell_bold),
        Paragraph(ar("4. الشفافية والموثوقية (15%)"), cell_bold),
    ],
]

table = Table(data, colWidths=col_widths, repeatRows=1)
table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0F766E")),
    ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 4.5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4.5),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
    ('BACKGROUND', (0, 1), (-1, 2), colors.HexColor("#F0FDFA")), # Culture
    ('BACKGROUND', (0, 3), (-1, 4), colors.HexColor("#EFF6FF")), # Care
    ('BACKGROUND', (0, 5), (-1, 6), colors.HexColor("#FAF5FF")), # Recruitment
    ('BACKGROUND', (0, 7), (-1, 8), colors.HexColor("#FFFBEB")), # Transparency
]))

elements.append(table)
elements.append(Spacer(1, 8))

# Bottom Box: Tiers & Special Badges (4 Columns in RTL)
box_title = ParagraphStyle("BTit", fontName="Amiri-Bold", fontSize=9.5, leading=13, alignment=2, textColor=colors.HexColor("#0F766E"))
tier_title = ParagraphStyle("TTit", fontName="Amiri-Bold", fontSize=8.5, leading=11.5, alignment=1, textColor=colors.HexColor("#0F172A"))
tier_sub = ParagraphStyle("TSub", fontName="Amiri", fontSize=7.5, leading=10.5, alignment=1, textColor=colors.HexColor("#475569"))

# Col 3 is right (Tier 1), Col 2 (Tier 2), Col 1 (Tier 3), Col 0 is left (Tier 4)
tiers_data = [
    [
        Paragraph(ar("سلم مستويات وأوسمة التميز للهيئات التطوعية في المنصة:"), box_title),
        "", "", ""
    ],
    [
        # Col 0: Strategic Partner
        Paragraph(ar("شريك استراتيجي في النفع العام<br/>الرصيد: +300 نقطة أثر<br/>أعلى رتبة وموثوقية في المنصة"), tier_sub),
        # Col 1: Pioneer
        Paragraph(ar("هيئة رائدة في العمل التطوعي<br/>الرصيد: 151 - 300 نقطة<br/>تأطير عالي واستمرارية مستمرة"), tier_sub),
        # Col 2: Active
        Paragraph(ar("جمعية نشطة وموثوقة<br/>الرصيد: 51 - 150 نقطة<br/>سجل إيجابي في التكوين والميدان"), tier_sub),
        # Col 3: Emerging (Right - read first)
        Paragraph(ar("جمعية ناشئة ومبادرة<br/>الرصيد: 0 - 50 نقطة<br/>بداية المسار الميداني في المنصة"), tier_sub),
    ],
    [
        Paragraph(ar("وسام: الشريك الوطني الاستراتيجي"), ParagraphStyle("TB4", fontName="Amiri-Bold", fontSize=8, leading=10, alignment=1, textColor=colors.HexColor("#0F766E"))),
        Paragraph(ar("وسام: صديقة المتطوعين (تقييم 4.8+)"), ParagraphStyle("TB3", fontName="Amiri-Bold", fontSize=8, leading=10, alignment=1, textColor=colors.HexColor("#1D4ED8"))),
        Paragraph(ar("وسام: حاضنة الفكر التطوعي والتكوين"), ParagraphStyle("TB2", fontName="Amiri-Bold", fontSize=8, leading=10, alignment=1, textColor=colors.HexColor("#7C3AED"))),
        Paragraph(ar("وسام: الانطلاقة المعتمدة"), ParagraphStyle("TB1", fontName="Amiri-Bold", fontSize=8, leading=10, alignment=1, textColor=colors.HexColor("#B45309"))),
    ]
]

tiers_table = Table(tiers_data, colWidths=[198, 198, 198, 200])
tiers_table.setStyle(TableStyle([
    ('SPAN', (0, 0), (3, 0)),
    ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
    ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#94A3B8")),
    ('INNERGRID', (0, 1), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('LEFTPADDING', (0, 0), (-1, -1), 4),
    ('RIGHTPADDING', (0, 0), (-1, -1), 4),
    ('BACKGROUND', (3, 2), (3, 2), colors.HexColor("#FEF3C7")),
    ('BACKGROUND', (2, 2), (2, 2), colors.HexColor("#EDE9FE")),
    ('BACKGROUND', (1, 2), (1, 2), colors.HexColor("#DBEAFE")),
    ('BACKGROUND', (0, 2), (0, 2), colors.HexColor("#CCFBF1")),
]))

elements.append(tiers_table)

doc.build(elements)
print(f"PDF built successfully: {pdf_path}")

# Render to 300 DPI image
pdf_doc = pymupdf.open(pdf_path)
page = pdf_doc[0]
zoom = 300 / 72
mat = pymupdf.Matrix(zoom, zoom)
pix = page.get_pixmap(matrix=mat, alpha=False)

os.makedirs(img_artifact_dir, exist_ok=True)
pix.save(img_path_artifact)
pix.save(img_path_local)

print(f"Image saved to: {img_path_artifact}")
print(f"Local image saved to: {img_path_local}")
