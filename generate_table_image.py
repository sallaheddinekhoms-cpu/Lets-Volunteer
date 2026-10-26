import os
import sys
import arabic_reshaper
from bidi.algorithm import get_display
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

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

pdf_path = os.path.join(base_dir, "volunteer_table.pdf")

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
    textColor=colors.HexColor("#065F46")
)

subtitle_style = ParagraphStyle(
    "SubtitleStyle",
    fontName="Amiri",
    fontSize=10.5,
    leading=15,
    alignment=1,
    textColor=colors.HexColor("#047857")
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

cell_center = ParagraphStyle(
    "CellCenter",
    fontName="Amiri-Bold",
    fontSize=9,
    leading=12,
    alignment=1,
    textColor=colors.HexColor("#475569")
)

badge_green = ParagraphStyle("BG", fontName="Amiri-Bold", fontSize=9, leading=12, alignment=1, textColor=colors.HexColor("#065F46"))
badge_blue = ParagraphStyle("BB", fontName="Amiri-Bold", fontSize=9, leading=12, alignment=1, textColor=colors.HexColor("#1E40AF"))
badge_purple = ParagraphStyle("BP", fontName="Amiri-Bold", fontSize=9, leading=12, alignment=1, textColor=colors.HexColor("#6B21A8"))
badge_amber = ParagraphStyle("BA", fontName="Amiri-Bold", fontSize=9, leading=12, alignment=1, textColor=colors.HexColor("#92400E"))
badge_rose = ParagraphStyle("BR", fontName="Amiri-Bold", fontSize=9, leading=12, alignment=1, textColor=colors.HexColor("#9F1239"))

elements = []

elements.append(Paragraph(ar("الجمهورية الجزائرية الديمقراطية الشعبية • منصة «لنتطوع»"), subtitle_style))
elements.append(Spacer(1, 3))
elements.append(Paragraph(ar("النظام الوطني لاحتساب وتثمين رصيد الساعات والأثر التطوعي"), title_style))
elements.append(Spacer(1, 3))
elements.append(Paragraph(ar("المصفوفة المعيارية المعتمدة لتقييم الجهد الميداني، التخصص والمهارة، والدعم اللوجستي (مطابق للقانون 12-06)"), subtitle_style))
elements.append(Spacer(1, 10))

# In ReportLab, columns are rendered Left-to-Right.
# To make it natural RTL (reading right to left):
# Leftmost column (idx 0) -> الأثر والتوثيق
# Col 1 -> الرصيد المعتمد
# Col 2 -> طريقة الاحتساب
# Col 3 -> العنصر والدور الميداني
# Rightmost column (idx 4) -> الفئة / المحور
col_widths = [190, 124, 170, 175, 135]

data = [
    [
        Paragraph(ar("الأثر والتوثيق"), header_cell_style),
        Paragraph(ar("الرصيد المعتمد"), header_cell_style),
        Paragraph(ar("طريقة الاحتساب"), header_cell_style),
        Paragraph(ar("العنصر والدور الميداني"), header_cell_style),
        Paragraph(ar("الفئة / المحور"), header_cell_style),
    ],
    # 1. Fieldwork
    [
        Paragraph(ar("تثمين معنوي وبدني لمشقة الميدان والطقس"), cell_regular),
        Paragraph(ar("1.5 ساعة / ساعة ميدان"), badge_green),
        Paragraph(ar("ساعات الحضور الفعلي × 1.5"), cell_regular),
        Paragraph(ar("حضور وإنجاز الفرصة التطوعية"), cell_bold),
        Paragraph(ar("1. التواجد الميداني"), cell_bold),
    ],
    # 2. Skills
    [
        Paragraph(ar("تنظيف المكان، مساعدة، نقل مستلزمات"), cell_regular),
        Paragraph(ar("بدون بونص إضافي"), cell_center),
        Paragraph(ar("المعامل الأساسي (1.0x)"), cell_regular),
        Paragraph(ar("أ) مساهم عام / هاوي (Support)"), cell_regular),
        Paragraph(ar("2. المهارة والتخصص"), cell_bold),
    ],
    [
        Paragraph(ar("حرفي دهان، كهربائي، صيانة، تمريض، فحص"), cell_regular),
        Paragraph(ar("+2 ساعات إضافية"), badge_blue),
        Paragraph(ar("بونص المهارة التخصصية"), cell_regular),
        Paragraph(ar("ب) منفذ فني متخصص (Specialist)"), cell_bold),
        Paragraph(ar("2. المهارة والتخصص"), cell_bold),
    ],
    [
        Paragraph(ar("إشراف تقني، توجيه وتدريب المتطوعين"), cell_regular),
        Paragraph(ar("+3 ساعات إضافية"), badge_purple),
        Paragraph(ar("بونص تأطير وإدارة العمل"), cell_regular),
        Paragraph(ar("ج) قائد ورشة / مؤطر فني (Lead)"), cell_bold),
        Paragraph(ar("2. المهارة والتخصص"), cell_bold),
    ],
    # 3. Training
    [
        Paragraph(ar("إسعافات أولية، تسيير أزمات، قيادة فرق"), cell_regular),
        Paragraph(ar("كامل ساعات الدورة"), badge_green),
        Paragraph(ar("1 ساعة لكل ساعة تدريب"), cell_regular),
        Paragraph(ar("دورات وورشات المنصة التدريبية"), cell_bold),
        Paragraph(ar("3. التكوين والتأهيل"), cell_bold),
    ],
    # 4. Logistics
    [
        Paragraph(ar("تخفيف العبء المالي واللوجستي عن الجمعية"), cell_regular),
        Paragraph(ar("+3 ساعات إضافية"), badge_amber),
        Paragraph(ar("بونص نقل المتطوعين أو العتاد"), cell_regular),
        Paragraph(ar("توفير وسيلة نقل خاصة"), cell_regular),
        Paragraph(ar("4. الدعم اللوجستي"), cell_bold),
    ],
    [
        Paragraph(ar("معدات طلاء، لحام، أدوات إسعاف متقدمة"), cell_regular),
        Paragraph(ar("+2 ساعات إضافية"), badge_amber),
        Paragraph(ar("بونص توفير عتاد ميداني"), cell_regular),
        Paragraph(ar("توفير عتاد وأدوات عمل متخصصة"), cell_regular),
        Paragraph(ar("4. الدعم اللوجستي"), cell_bold),
    ],
    [
        Paragraph(ar("توثيق صفة «متطوع وداعم» في الشهادة"), cell_regular),
        Paragraph(ar("+3 ساعات إضافية"), badge_amber),
        Paragraph(ar("بونص دعم وتمويل عيني"), cell_regular),
        Paragraph(ar("مساهمة عينية أو تمويلية للحملة"), cell_regular),
        Paragraph(ar("4. الدعم اللوجستي"), cell_bold),
    ],
    # 5. Quality
    [
        Paragraph(ar("الانضباط بالمواعيد والروح الإيجابية العالية"), cell_regular),
        Paragraph(ar("+1 ساعة بونص"), badge_green),
        Paragraph(ar("مكافأة حسن السلوك والانضباط"), cell_regular),
        Paragraph(ar("تقييم ممتاز (5/5) من الجمعية"), cell_bold),
        Paragraph(ar("5. جودة الأداء"), cell_bold),
    ],
    # 6. Loyalty
    [
        Paragraph(ar("تفعيل تلقائي لمرة واحدة بعد أول مشاركة"), cell_regular),
        Paragraph(ar("+2 ساعات تشجيعية"), badge_rose),
        Paragraph(ar("تُمنح عند إتمام أول فرصة بنجاح"), cell_regular),
        Paragraph(ar("مكافأة الانطلاقة الأولى"), cell_bold),
        Paragraph(ar("6. محطات الولاء"), cell_bold),
    ],
    [
        Paragraph(ar("مكافأة تراكمية دورية لترسيخ الالتزام"), cell_regular),
        Paragraph(ar("+3 ساعات إضافية"), badge_rose),
        Paragraph(ar("كل 5 مشاركات تطوعية ناجحة"), cell_regular),
        Paragraph(ar("حافز الاستمرارية والوفاء"), cell_regular),
        Paragraph(ar("6. محطات الولاء"), cell_bold),
    ],
    [
        Paragraph(ar("تثمين وفاء واستمرارية المتطوع النشط"), cell_regular),
        Paragraph(ar("+3 ساعات سنوياً"), badge_rose),
        Paragraph(ar("سنة كاملة مع شرط النشاط"), cell_regular),
        Paragraph(ar("الأقدمية السنوية في المنصة"), cell_regular),
        Paragraph(ar("6. محطات الولاء"), cell_bold),
    ],
]

table = Table(data, colWidths=col_widths, repeatRows=1)
table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#065F46")),
    ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
    ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor("#F0FDF4")),
    ('BACKGROUND', (0, 2), (-1, 4), colors.HexColor("#F8FAFC")),
    ('BACKGROUND', (0, 5), (-1, 5), colors.HexColor("#F0FDFA")),
    ('BACKGROUND', (0, 6), (-1, 8), colors.HexColor("#FFFBEB")),
    ('BACKGROUND', (0, 9), (-1, 9), colors.HexColor("#F0FDF4")),
    ('BACKGROUND', (0, 10), (-1, 12), colors.HexColor("#FFF1F2")),
]))

elements.append(table)
elements.append(Spacer(1, 8))

# Practical Comparison (RTL order: Col 2 is Right (Volunteer A), Col 1 is Middle (Volunteer B), Col 0 is Left (Volunteer C))
ex_header = ParagraphStyle("ExH", fontName="Amiri-Bold", fontSize=9.5, leading=13, alignment=2, textColor=colors.HexColor("#065F46"))
ex_text = ParagraphStyle("ExT", fontName="Amiri", fontSize=8.5, leading=12, alignment=2, textColor=colors.HexColor("#334155"))
ex_bold_a = ParagraphStyle("ExA", fontName="Amiri-Bold", fontSize=9, leading=12, alignment=1, textColor=colors.HexColor("#1D4ED8"))
ex_bold_b = ParagraphStyle("ExB", fontName="Amiri-Bold", fontSize=9, leading=12, alignment=1, textColor=colors.HexColor("#6D28D9"))
ex_bold_c = ParagraphStyle("ExC", fontName="Amiri-Bold", fontSize=9, leading=12, alignment=1, textColor=colors.HexColor("#047857"))

ex_data = [
    [
        Paragraph(ar("نموذج تطبيقي مقارن: حملة طلاء وتهيئة مدرسة ابتدائية (مدة النشاط الميداني: 4 ساعات)"), ex_header),
        "",
        ""
    ],
    [
        # Col 0 (Left in visual, read last in RTL): Volunteer C
        Paragraph(ar("المتطوع (ج): مؤطر فني مع عتاده<br/>أشرف ودرب الفريق + جلب أجهزته + تقييم 5 نجوم<br/>الحساب: (4h × 1.5) + 3h + 2h + 1h"), ex_text),
        # Col 1 (Middle): Volunteer B
        Paragraph(ar("المتطوع (ب): دهّان متخصص<br/>طلاء احترافي وجدران مشطبة + تقييم 5 نجوم<br/>الحساب: (4h × 1.5) + 2h + 1h"), ex_text),
        # Col 2 (Right in visual, read first in RTL): Volunteer A
        Paragraph(ar("المتطوع (أ): هاوي / مساهم عام<br/>تنظيف الجدران ومساعدة الفريق<br/>الحساب: 4h × 1.5"), ex_text),
    ],
    [
        Paragraph(ar("النتيجة: 12 ساعة تطوعية معتمدة"), ex_bold_c),
        Paragraph(ar("النتيجة: 9 ساعات تطوعية معتمدة"), ex_bold_b),
        Paragraph(ar("النتيجة: 6 ساعات تطوعية معتمدة"), ex_bold_a),
    ]
]

ex_table = Table(ex_data, colWidths=[264, 264, 266])
ex_table.setStyle(TableStyle([
    ('SPAN', (0, 0), (2, 0)),
    ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
    ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#94A3B8")),
    ('INNERGRID', (0, 1), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('BACKGROUND', (2, 2), (2, 2), colors.HexColor("#DBEAFE")),
    ('BACKGROUND', (1, 2), (1, 2), colors.HexColor("#EDE9FE")),
    ('BACKGROUND', (0, 2), (0, 2), colors.HexColor("#DCFCE7")),
]))

elements.append(ex_table)

doc.build(elements)
print(f"PDF built successfully: {pdf_path}")
