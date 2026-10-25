"""Volunteer certificate PDF, drawn with ReportLab (landscape A4, bilingual AR/EN)."""
import logging
import math
from io import BytesIO
from pathlib import Path

import arabic_reshaper
import qrcode
import requests
from bidi.algorithm import get_display
from django.conf import settings
from reportlab.graphics import renderPDF
from reportlab.lib.colors import Color, HexColor
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from svglib.svglib import svg2rlg

logger = logging.getLogger(__name__)

ASSETS = Path(__file__).resolve().parent / "assets"
W, H = landscape(A4)

GREEN = HexColor("#105D56")
GREEN_DARK = HexColor("#0B3F3A")
GOLD = HexColor("#C9A24A")
GOLD_LIGHT = HexColor("#E8CF8A")
CREAM = HexColor("#FBF8EF")
INK = HexColor("#1F2A2A")
MUTED = HexColor("#6B7A78")

AR = "Amiri"
AR_BOLD = "Amiri-Bold"
EN = "Helvetica"
EN_BOLD = "Helvetica-Bold"

MARGIN_L = 70
MARGIN_R = W - 70

_fonts_registered = False


def _register_fonts():
    global _fonts_registered
    if _fonts_registered:
        return
    pdfmetrics.registerFont(TTFont(AR, str(ASSETS / "fonts" / "Amiri-Regular.ttf")))
    pdfmetrics.registerFont(TTFont(AR_BOLD, str(ASSETS / "fonts" / "Amiri-Bold.ttf")))
    _fonts_registered = True


def ar(text):
    """Shape and reorder Arabic (or mixed) text for left-to-right PDF drawing."""
    return get_display(arabic_reshaper.reshape(str(text or "")))


def _has_non_latin(text):
    return any(ord(ch) > 0x24F for ch in str(text or ""))


def _text(c, text, x, y, font, size, align="left", color=INK, max_width=None, shape=False):
    """Draw text, shrinking the font size until it fits in max_width."""
    if font in (EN, EN_BOLD) and _has_non_latin(text):
        # user data (names, places) may be Arabic even on the English side
        font, shape = (AR_BOLD if font == EN_BOLD else AR), True
        size += 1.5
    s = ar(text) if shape else str(text or "")
    if max_width:
        while size > 6 and pdfmetrics.stringWidth(s, font, size) > max_width:
            size -= 0.5
    c.setFont(font, size)
    c.setFillColor(color)
    if align == "center":
        c.drawCentredString(x, y, s)
    elif align == "right":
        c.drawRightString(x, y, s)
    else:
        c.drawString(x, y, s)
    return pdfmetrics.stringWidth(s, font, size)


def _dotted_line(c, x1, x2, y):
    if x2 - x1 < 10:
        return
    c.saveState()
    c.setStrokeColor(MUTED)
    c.setLineWidth(0.6)
    c.setDash(1, 2.5)
    c.line(x1, y, x2, y)
    c.restoreState()


# ---------------------------------------------------------------- decoration

def _corner_ornament(c):
    """Flourish for the bottom-left corner; mirrored for the other three."""
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.4)
    p = c.beginPath()
    p.moveTo(24, 95)
    p.curveTo(24, 50, 30, 30, 70, 26)
    p.lineTo(95, 24)
    c.drawPath(p, stroke=1, fill=0)
    c.setLineWidth(0.8)
    p = c.beginPath()
    p.moveTo(34, 70)
    p.curveTo(34, 45, 45, 34, 70, 34)
    c.drawPath(p, stroke=1, fill=0)
    # small curl
    p = c.beginPath()
    p.moveTo(40, 58)
    p.curveTo(48, 58, 58, 48, 58, 40)
    p.curveTo(50, 40, 40, 50, 40, 58)
    c.setFillColor(GOLD_LIGHT)
    c.drawPath(p, stroke=1, fill=1)
    c.setFillColor(GREEN)
    c.circle(49, 49, 2.6, stroke=0, fill=1)


def _draw_frame(c):
    c.setFillColor(CREAM)
    c.rect(0, 0, W, H, stroke=0, fill=1)

    c.setStrokeColor(GREEN)
    c.setLineWidth(2.2)
    c.rect(14, 14, W - 28, H - 28, stroke=1, fill=0)
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.8)
    c.rect(20, 20, W - 40, H - 40, stroke=1, fill=0)

    for sx, sy in ((1, 1), (-1, 1), (1, -1), (-1, -1)):
        c.saveState()
        c.translate(0 if sx == 1 else W, 0 if sy == 1 else H)
        c.scale(sx, sy)
        _corner_ornament(c)
        c.restoreState()


def _fade(node, amount):
    """Blend every colour in an SVG drawing towards the page background.
    (renderPDF resets alpha per shape, so real transparency can't be used.)"""
    for attr in ("fillColor", "strokeColor"):
        col = getattr(node, attr, None)
        if col is not None and hasattr(col, "red"):
            setattr(node, attr, Color(
                CREAM.red + (col.red - CREAM.red) * amount,
                CREAM.green + (col.green - CREAM.green) * amount,
                CREAM.blue + (col.blue - CREAM.blue) * amount,
            ))
    for child in getattr(node, "contents", []):
        _fade(child, amount)


def _draw_svg(c, path, x, y, width, fade=None):
    drawing = svg2rlg(str(path))
    if not drawing or not drawing.width:
        return 0
    if fade is not None:
        _fade(drawing, fade)
    scale = width / drawing.width
    drawing.scale(scale, scale)
    renderPDF.draw(drawing, c, x, y)
    return drawing.height * scale


def _load_remote_image(url):
    if not url:
        return None
    try:
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        return ImageReader(BytesIO(resp.content))
    except Exception:
        logger.warning("Could not load organization logo for certificate: %s", url)
        return None


def _draw_ribbon_and_seal(c, org_logo):
    # diagonal ribbon across the top-right corner
    c.setFillColor(GREEN)
    p = c.beginPath()
    p.moveTo(W - 205, H - 14)
    p.lineTo(W - 150, H - 14)
    p.lineTo(W - 14, H - 150)
    p.lineTo(W - 14, H - 205)
    p.close()
    c.drawPath(p, stroke=0, fill=1)
    c.setStrokeColor(GOLD)
    c.setLineWidth(1)
    c.line(W - 199, H - 14, W - 14, H - 199)
    c.line(W - 156, H - 14, W - 14, H - 156)

    cx, cy, r = W - 105, H - 105, 46

    # hanging tails
    c.setFillColor(GREEN_DARK)
    for dx in (-18, 18):
        p = c.beginPath()
        p.moveTo(cx + dx - 11, cy - 20)
        p.lineTo(cx + dx + 11, cy - 20)
        p.lineTo(cx + dx + 11, cy - 70)
        p.lineTo(cx + dx, cy - 61)
        p.lineTo(cx + dx - 11, cy - 70)
        p.close()
        c.drawPath(p, stroke=0, fill=1)

    # scalloped gold medal
    c.setFillColor(GOLD)
    for i in range(36):
        a = 2 * math.pi * i / 36
        c.circle(cx + (r + 1) * math.cos(a), cy + (r + 1) * math.sin(a), 5.5, stroke=0, fill=1)
    c.circle(cx, cy, r, stroke=0, fill=1)
    c.setStrokeColor(GOLD_LIGHT)
    c.setLineWidth(1.5)
    c.circle(cx, cy, r - 5, stroke=1, fill=0)
    c.setFillColor(CREAM)
    c.circle(cx, cy, r - 9, stroke=0, fill=1)

    inner = r - 13
    if org_logo:
        c.saveState()
        p = c.beginPath()
        p.circle(cx, cy, inner)
        c.clipPath(p, stroke=0, fill=0)
        c.drawImage(org_logo, cx - inner, cy - inner, 2 * inner, 2 * inner,
                    preserveAspectRatio=True, anchor="c", mask="auto")
        c.restoreState()
    else:
        _draw_svg(c, ASSETS / "logo.svg", cx - inner, cy - inner * 0.6, 2 * inner)


def _qr_image(url):
    img = qrcode.make(url, border=1, box_size=6)
    buf = BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return ImageReader(buf)


# ---------------------------------------------------------------- content

def _bilingual(c, y, en, ar_text, en_size=10.5, ar_size=12, en_font=EN, ar_font=AR_BOLD):
    _text(c, en, MARGIN_L, y, en_font, en_size, max_width=W / 2 - MARGIN_L - 10)
    _text(c, ar_text, MARGIN_R, y, ar_font, ar_size, align="right", shape=True,
          max_width=W / 2 - MARGIN_L - 10)


def build_certificate_data(certificate):
    participation = certificate.participation
    volunteer = participation.volunteer
    opportunity = participation.opportunity
    organization = opportunity.organization

    full_name = f"{volunteer.first_name or ''} {volunteer.last_name or ''}".strip() or volunteer.email
    dob = volunteer.date_of_birth.strftime("%d/%m/%Y") if volunteer.date_of_birth else ""
    place = certificate.place_of_birth or ""
    address = " - ".join(x for x in (organization.daira, organization.wilaya) if x)

    return {
        "serial": certificate.serial_number,
        "license": organization.approval_id or "",
        "organization": organization.organization_name,
        "president": organization.president_name or "",
        "full_name": full_name,
        "birth": " - ".join(x for x in (dob, place) if x),
        "activities": certificate.activities or [],
        "skills": certificate.skills or [],
        "hours": certificate.hours,
        "partners": certificate.partners or "",
        "address": address,
        "email": organization.email,
        "phone": organization.phone_number or "",
        "issued": certificate.issued_at.strftime("%d/%m/%Y"),
        "place_issued": organization.wilaya or "",
        "logo_url": organization.logo.url if organization.logo else None,
        "verify_url": f"{settings.FRONTEND_URL}/certificates/verify/{certificate.serial_number}",
    }


def generate_certificate_pdf(certificate):
    """Return the certificate as PDF bytes."""
    _register_fonts()
    d = build_certificate_data(certificate)

    buf = BytesIO()
    c = canvas.Canvas(buf, pagesize=(W, H))
    c.setTitle(f"Volunteer Certificate {d['serial']}")
    c.setAuthor(d["organization"])

    _draw_frame(c)
    _draw_svg(c, ASSETS / "logo.svg", W / 2 - 170, H / 2 - 120, 340, fade=0.05)  # watermark
    _draw_svg(c, ASSETS / "logo.svg", 44, H - 110, 130)
    _draw_ribbon_and_seal(c, _load_remote_image(d["logo_url"]))

    # header
    cx = W / 2 - 10
    _text(c, "الجمهورية الجزائرية الديمقراطية الشعبية", cx, H - 58, AR_BOLD, 19, "center", GREEN_DARK, shape=True)
    _text(c, "People's Democratic Republic of Algeria", cx, H - 76, EN_BOLD, 11.5, "center", INK)
    _text(c, d["organization"], cx, H - 99, AR_BOLD, 16, "center", GREEN, max_width=380, shape=True)

    # title
    _text(c, "شهادة متطوع", cx, H - 145, AR_BOLD, 38, "center", GREEN, shape=True)
    c.setFillColor(GREEN_DARK)
    c.setFont("Times-Bold", 22)
    title = "VOLUNTEER CERTIFICATE"
    c.drawCentredString(cx, H - 170, title)
    tw = pdfmetrics.stringWidth(title, "Times-Bold", 22)
    c.setStrokeColor(GOLD)
    c.setLineWidth(1)
    c.line(cx - tw / 2 - 40, H - 162, cx - tw / 2 - 8, H - 162)
    c.line(cx + tw / 2 + 8, H - 162, cx + tw / 2 + 40, H - 162)

    # certificate details
    y = H - 200
    _bilingual(c, y, f"Serial Number: {d['serial']}", f"الرقم التسلسلي: {d['serial']}")
    y -= 15
    _bilingual(c, y, f"License Number: {d['license'] or '-'}", f"رقم الاعتماد: {d['license'] or '-'}")

    y -= 24
    president_en = f" ({d['president']})" if d["president"] else ""
    _bilingual(c, y,
               f"The President of the Association{president_en} certifies that the Volunteer:",
               f"يشهد رئيس الجمعية {d['president']} بأن المتطوع(ة):".replace("  ", " "))
    y -= 21
    _text(c, d["full_name"], W / 2, y, AR_BOLD, 21, "center", GREEN_DARK, max_width=420, shape=True)
    y -= 18
    _bilingual(c, y, f"Date and Place of Birth: {d['birth'] or '-'}",
               f"تاريخ ومكان الميلاد: {d['birth'] or '-'}")
    y -= 15
    _bilingual(c, y, "In accordance with the Association's statutes, has participated in:",
               "حسب القانون الأساسي للجمعية، قد شارك في:")

    # activities: title on the right (Arabic side), date on the left
    for act in (d["activities"] or [{}])[:3]:
        y -= 16
        c.setFillColor(GREEN)
        c.circle(MARGIN_R - 3, y + 3.5, 2.6, stroke=0, fill=1)
        tw = _text(c, act.get("title", ""), MARGIN_R - 12, y, AR, 12, "right",
                   max_width=MARGIN_R - MARGIN_L - 110, shape=True)
        date = act.get("date") or ""
        if date:
            try:
                yy, mm, dd = date.split("-")
                date = f"{dd}/{mm}/{yy}"
            except ValueError:
                pass
        dw = _text(c, date, MARGIN_L, y, EN, 10)
        _dotted_line(c, MARGIN_L + dw + 8, MARGIN_R - 18 - tw, y + 1)

    # skills
    y -= 22
    _bilingual(c, y, "Acquired Skills:", "المهارات المكتسبة:")
    skills = [s for s in d["skills"] if s][:6]
    lines = [" • ".join(skills[:3]), " • ".join(skills[3:6])] if skills else [""]
    for line in lines:
        if not line and len(lines) > 1:
            continue
        y -= 15
        c.setFillColor(GREEN)
        c.circle(MARGIN_R - 3, y + 3.5, 2.6, stroke=0, fill=1)
        tw = _text(c, line, MARGIN_R - 12, y, AR, 12, "right", max_width=MARGIN_R - MARGIN_L - 30, shape=True)
        _dotted_line(c, MARGIN_L, MARGIN_R - 18 - tw, y + 1)

    y -= 21
    _bilingual(c, y, f"Number of Volunteer Hours: {d['hours']} Hours",
               f"عدد ساعات التطوع: {d['hours']} ساعة", en_font=EN_BOLD)
    y -= 15
    _bilingual(c, y, "Volunteer = Professional (in Community Development)",
               "متطوع = محترف (في التنمية المجتمعية)", en_font=EN_BOLD)

    y -= 20
    _text(c, "PARTNERS & SUPPORTERS", MARGIN_L, y, EN_BOLD, 9.5, color=GREEN_DARK)
    _text(c, "الشركاء والداعمون", MARGIN_R, y, AR_BOLD, 11.5, "right", GREEN_DARK, shape=True)
    if d["partners"]:
        _text(c, d["partners"], W / 2, y, AR, 11, "center", max_width=W - 2 * MARGIN_L - 260, shape=True)

    # signatures block
    y -= 14
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.6)
    c.line(MARGIN_L, y, MARGIN_R, y)

    top = y - 14
    qr = 58
    c.drawImage(_qr_image(d["verify_url"]), MARGIN_L, top - qr, qr, qr)
    _text(c, "Scan to verify", MARGIN_L + qr + 8, top - 18, EN_BOLD, 8.5, color=GREEN_DARK)
    _text(c, "امسح للتحقق", MARGIN_L + qr + 8, top - 32, AR, 10, color=GREEN_DARK, shape=True)
    _text(c, f"Issued: {d['issued']}", MARGIN_L + qr + 8, top - 46, EN, 8, color=MUTED)

    col = W / 2 + 20
    _text(c, "ADMINISTRATION & SIGNATURES", col - 150, top - 4, EN_BOLD, 9.5, "center", GREEN_DARK)
    _text(c, "الإدارة والتوقيعات", col - 150, top - 19, AR_BOLD, 11, "center", GREEN_DARK, shape=True)

    rx = MARGIN_R - 10
    _text(c, f"رئيس الجمعية: {d['president'] or '..................'}", rx, top - 4, AR_BOLD, 11.5, "right",
          max_width=230, shape=True)
    place_date = " - ".join(x for x in (d["place_issued"], d["issued"]) if x)
    _text(c, f"المكان والتاريخ: {place_date}", rx, top - 20, AR, 11, "right", max_width=230, shape=True)
    _text(c, "ختم الجمعية", rx, top - 36, AR, 11, "right", MUTED, shape=True)
    _text(c, "التوقيع", rx - 110, top - 36, AR, 11, "right", MUTED, shape=True)
    c.setStrokeColor(MUTED)
    c.setDash(2, 2)
    c.setLineWidth(0.6)
    c.roundRect(rx - 95, top - 70, 95, 28, 4)
    c.roundRect(rx - 205, top - 70, 95, 28, 4)
    c.setDash()

    # contact + legal footer
    contact = " | ".join(x for x in (d["address"], d["email"], d["phone"]) if x)
    _text(c, f"Association Address / Email: {contact}", MARGIN_L, 44, EN, 8, color=MUTED,
          max_width=W / 2 - MARGIN_L)
    _text(c, f"عنوان الجمعية / البريد الإلكتروني: {contact}", MARGIN_R, 44, AR, 9, "right", MUTED,
          max_width=W / 2 - MARGIN_L, shape=True)
    _text(c, "في حدود ما يسمح به القانون / WITHIN THE LIMITS ALLOWED BY LAW", W / 2, 28, AR_BOLD, 10,
          "center", INK, shape=True)

    c.showPage()
    c.save()
    return buf.getvalue()
