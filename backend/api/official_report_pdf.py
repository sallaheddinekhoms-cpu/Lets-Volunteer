"""Official Statistics & Activity PDF Report with ReportLab."""
import logging
from datetime import datetime
from io import BytesIO
from pathlib import Path

import arabic_reshaper
import qrcode
from bidi.algorithm import get_display
from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

logger = logging.getLogger(__name__)

ASSETS = Path(__file__).resolve().parent / "assets"
PAGE_W, PAGE_H = A4  # Portrait A4: 595.27 x 841.89

PRIMARY = HexColor("#006D5B")
PRIMARY_DARK = HexColor("#004D40")
GOLD = HexColor("#C9A24A")
LIGHT_BG = HexColor("#F8FAF9")
BORDER_COLOR = HexColor("#D1D5DB")
TEXT_MAIN = HexColor("#1F2937")
TEXT_MUTED = HexColor("#4B5563")

AR = "Amiri"
AR_BOLD = "Amiri-Bold"

_fonts_registered = False


def _register_fonts():
    global _fonts_registered
    if _fonts_registered:
        return
    regular = ASSETS / "fonts" / "Amiri-Regular.ttf"
    bold = ASSETS / "fonts" / "Amiri-Bold.ttf"
    if regular.exists():
        pdfmetrics.registerFont(TTFont(AR, str(regular)))
    if bold.exists():
        pdfmetrics.registerFont(TTFont(AR_BOLD, str(bold)))
    _fonts_registered = True


def ar(text):
    """Reshape and reorder Arabic text for PDF rendering."""
    if not text:
        return ""
    try:
        reshaped = arabic_reshaper.reshape(str(text))
        return get_display(reshaped)
    except Exception:
        return str(text)


def draw_official_stamp(p, x, y, radius=42):
    """Draw a circular official stamp/seal."""
    p.saveState()
    p.setStrokeColor(HexColor("#006D5B"))
    p.setFillColor(HexColor("#006D5B"))
    p.setLineWidth(2)
    p.circle(x, y, radius, stroke=1, fill=0)
    p.setLineWidth(0.7)
    p.circle(x, y, radius - 4, stroke=1, fill=0)

    p.setFont(AR_BOLD if _fonts_registered else "Helvetica-Bold", 8)
    p.drawCentredString(x, y + 14, ar("الجمهورية الجزائرية"))
    p.drawCentredString(x, y + 2, ar("منصة لنتطوع - معتمد"))
    p.drawCentredString(x, y - 10, ar("OFFICIAL REPORT"))
    p.setFont(AR if _fonts_registered else "Helvetica", 7)
    p.drawCentredString(x, y - 22, datetime.now().strftime("%Y-%m-%d"))
    p.restoreState()


def generate_official_report_pdf(stats_data, user=None):
    """
    Generate an official portrait A4 PDF report with verified statistics.
    """
    _register_fonts()
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)

    # 1. Background styling & header banner
    p.setFillColor(HexColor("#004D40"))
    p.rect(0, PAGE_H - 105, PAGE_W, 105, stroke=0, fill=1)

    p.setFillColor(GOLD)
    p.rect(0, PAGE_H - 110, PAGE_W, 5, stroke=0, fill=1)

    # National Header text (in gold / white)
    font_bold = AR_BOLD if _fonts_registered else "Helvetica-Bold"
    font_reg = AR if _fonts_registered else "Helvetica"

    p.setFillColor(colors.white)
    p.setFont(font_bold, 13)
    p.drawCentredString(PAGE_W / 2, PAGE_H - 32, ar("الجمهورية الجزائرية الديمقراطية الشعبية"))

    p.setFont(font_bold, 16)
    p.drawCentredString(PAGE_W / 2, PAGE_H - 56, ar("المنصة الوطنية للعمل التطوعي « لنتطوع »"))

    p.setFont(font_reg, 10)
    p.drawCentredString(PAGE_W / 2, PAGE_H - 78, ar("تقرير إحصائي رسمي لأنشطة ومؤشرات التطوع"))

    p.setFont(font_reg, 8)
    p.setFillColor(HexColor("#E5E7EB"))
    p.drawCentredString(PAGE_W / 2, PAGE_H - 95, f"Rapport Officiel d'Activité - Édité le : {datetime.now().strftime('%d/%m/%Y %H:%M')}")

    # 2. Metadata Box
    p.setFillColor(LIGHT_BG)
    p.setStrokeColor(BORDER_COLOR)
    p.roundRect(40, PAGE_H - 185, PAGE_W - 80, 65, 8, stroke=1, fill=1)

    p.setFillColor(TEXT_MAIN)
    p.setFont(font_bold, 10)
    p.drawRightString(PAGE_W - 55, PAGE_H - 132, ar("الجهة الطالبة للتقرير:"))
    p.drawRightString(PAGE_W - 55, PAGE_H - 152, ar("رقم المرجع التسلسلي:"))
    p.drawRightString(PAGE_W - 55, PAGE_H - 172, ar("تاريخ وساعة الإصدار:"))

    p.setFont(font_reg, 10)
    requester_name = getattr(user, 'username', 'زائر معتمد للمنصة') if user else 'إدارة المنصة'
    p.drawRightString(PAGE_W - 165, PAGE_H - 132, ar(requester_name))
    p.drawString(PAGE_W - 270, PAGE_H - 152, f"LV-REP-{datetime.now().strftime('%Y%m%d%H%M')}")
    p.drawString(PAGE_W - 270, PAGE_H - 172, datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC"))

    # QR Code in top right/left of the metadata box
    try:
        qr = qrcode.QRCode(box_size=2, border=1)
        qr.add_data(f"https://lets-volunteer.dz/verify/LV-REP-{datetime.now().strftime('%Y%m%d%H%M')}")
        qr.make(fit=True)
        qr_img = qr.make_image(fill_color="#004D40", back_color="white")
        qr_buffer = BytesIO()
        qr_img.save(qr_buffer, format="PNG")
        qr_buffer.seek(0)
        p.drawImage(ImageReader(qr_buffer), 55, PAGE_H - 178, width=50, height=50)
    except Exception as e:
        logger.warning(f"QR generation error: {e}")

    # 3. Key Performance Indicators (Cards)
    p.setFont(font_bold, 13)
    p.setFillColor(PRIMARY_DARK)
    p.drawRightString(PAGE_W - 40, PAGE_H - 215, ar("المؤشرات الإحصائية العامة:"))

    cards_y = PAGE_H - 295
    card_w = (PAGE_W - 80 - 30) / 4
    metrics = [
        (ar("إجمالي الفرص"), str(stats_data.get("opportunities_count", 0)), HexColor("#E0F2FE")),
        (ar("ساعات التطوع"), str(stats_data.get("volunteer_hours", 0)), HexColor("#DCFCE7")),
        (ar("المتطوعين النشطين"), str(stats_data.get("volunteers_count", 0)), HexColor("#FEF3C7")),
        (ar("الهيئات الشريكة"), str(stats_data.get("organizations_count", 0)), HexColor("#F3E8FF")),
    ]

    for i, (label, val, bg_c) in enumerate(metrics):
        cx = 40 + i * (card_w + 10)
        p.setFillColor(bg_c)
        p.setStrokeColor(BORDER_COLOR)
        p.roundRect(cx, cards_y, card_w, 65, 6, stroke=1, fill=1)

        p.setFillColor(PRIMARY_DARK)
        p.setFont(font_bold, 16)
        p.drawCentredString(cx + card_w / 2, cards_y + 36, val)

        p.setFillColor(TEXT_MUTED)
        p.setFont(font_bold, 9)
        p.drawCentredString(cx + card_w / 2, cards_y + 14, label)

    # 4. Opportunities Breakdown Table
    table_top = PAGE_H - 330
    p.setFont(font_bold, 13)
    p.setFillColor(PRIMARY_DARK)
    p.drawRightString(PAGE_W - 40, table_top, ar("جدول أحدث المبادرات والفرص التطوعية المعتمدة:"))

    row_y = table_top - 25
    col_x = [40, 110, 210, 310, PAGE_W - 40]  # [Status, Wilaya, Organization, Title, Right edge]

    # Header Row
    p.setFillColor(PRIMARY)
    p.rect(40, row_y - 8, PAGE_W - 80, 22, stroke=0, fill=1)
    p.setFillColor(colors.white)
    p.setFont(font_bold, 9)
    p.drawCentredString((col_x[0] + col_x[1]) / 2, row_y - 2, ar("الحالة"))
    p.drawCentredString((col_x[1] + col_x[2]) / 2, row_y - 2, ar("الولاية"))
    p.drawCentredString((col_x[2] + col_x[3]) / 2, row_y - 2, ar("الهيئة المنظمة"))
    p.drawCentredString((col_x[3] + col_x[4]) / 2, row_y - 2, ar("عنوان الفرصة التطوعية"))

    opportunities = stats_data.get("recent_opportunities", [])
    row_h = 24
    curr_y = row_y - 8 - row_h

    for idx, opp in enumerate(opportunities[:10]):
        bg_row = HexColor("#F9FAFB") if idx % 2 == 0 else colors.white
        p.setFillColor(bg_row)
        p.rect(40, curr_y, PAGE_W - 80, row_h, stroke=0, fill=1)
        p.setStrokeColor(BORDER_COLOR)
        p.setLineWidth(0.5)
        p.line(40, curr_y, PAGE_W - 40, curr_y)

        p.setFillColor(TEXT_MAIN)
        p.setFont(font_reg, 8.5)

        status_txt = ar("متاحة") if opp.get("is_available", True) else ar("مكتملة")
        p.drawCentredString((col_x[0] + col_x[1]) / 2, curr_y + 7, status_txt)
        p.drawCentredString((col_x[1] + col_x[2]) / 2, curr_y + 7, ar(opp.get("wilaya", "الجزائر")))
        org_name = opp.get("organization", "هيئة معتمدة")
        if len(org_name) > 22:
            org_name = org_name[:20] + "..."
        p.drawCentredString((col_x[2] + col_x[3]) / 2, curr_y + 7, ar(org_name))

        title = opp.get("title", "")
        if len(title) > 35:
            title = title[:33] + "..."
        p.drawRightString(PAGE_W - 48, curr_y + 7, ar(title))

        curr_y -= row_h

    # 5. Signatures & Official Stamp section
    bottom_y = 120
    draw_official_stamp(p, 115, bottom_y + 30, radius=38)

    p.setFillColor(TEXT_MAIN)
    p.setFont(font_bold, 10)
    p.drawCentredString(PAGE_W - 120, bottom_y + 60, ar("تأشيرة ومصادقة الإدارة العامة:"))
    p.setFont(font_reg, 8)
    p.drawCentredString(PAGE_W - 120, bottom_y + 40, ar("رئيس قسم التنسيق والمتابعة الوطنية"))
    p.setFont(font_bold, 9)
    p.drawCentredString(PAGE_W - 120, bottom_y + 15, ar("[ توقيع إلكتروني معتمد ]"))

    # 6. Footer
    p.setStrokeColor(GOLD)
    p.setLineWidth(1)
    p.line(40, 50, PAGE_W - 40, 50)

    p.setFillColor(TEXT_MUTED)
    p.setFont(font_reg, 8)
    p.drawCentredString(PAGE_W / 2, 38, ar("هذا المستند وثيقة رسمية صادرة عن منصة لنتطوع الوطنية - صالحة للاستعمال الإداري والإحصائي."))
    p.drawCentredString(PAGE_W / 2, 26, "www.lets-volunteer.dz  |  contact@lets-volunteer.dz  |  Algeria")

    p.showPage()
    p.save()
    buffer.seek(0)
    return buffer.getvalue()
