"""Munta el document d'entrega parcial (Word) a partir dels textos de treball/.

Ajunta, en l'ordre de lectura, una pàgina de guia, els preliminars, l'índex
comentat, les parts escrites i el glossari. De cada text en treu les notes
internes de treball (les que diuen «per esborrar abans del lliurament») i el
pressupost de pàgines, que no s'entreguen.

Ús:  python tools/munta_entrega.py
Surt a treball/entrega/ (no es guarda al repositori: es torna a generar).
"""

import re
from datetime import date
from pathlib import Path

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.shared import Cm, Pt, RGBColor

ARREL = Path(__file__).resolve().parent.parent
TREBALL = ARREL / "treball"
SORTIDA = TREBALL / "entrega"
AMPLE_TEXT = Cm(16)

GUIA = """# Guia d'aquesta entrega

Aquest document recull el que hi ha escrit del treball de recerca fins a
l'11 de novembre del 2026. És una entrega parcial: tot el que hi ha és en
esborrany i encara es pot canviar.

Dins del text, les marques **[PER OMPLIR]** i **[PENDENT]** assenyalen el
que falta: dades que encara s'han de posar o frases que depenen de feina
que no està feta.

| Apartat | Estat | Què hi falta |
|---|---|---|
| Portada | Per completar | Les dades del centre, el grup i la tutoria, i el títol definitiu |
| Abstract (en anglès) | Esborrany | La frase de resultats, que depèn de les proves amb usuaris |
| Índex | Provisional | Els títols de la Part IV poden canviar. Els números de pàgina es posen al final |
| Índex comentat | Només per a aquesta entrega | No anirà al treball final |
| Presentació | Esborrany | La motivació personal i els agraïments |
| Introducció | Esborrany | Explicar la primera etapa del treball, de març a agost |
| Part I. Marc teòric (capítols 1 a 5) | Esborrany revisat | Res de gros |
| Part II. Metodologia (capítols 6 a 15) | Esborrany | Posar-hi les xifres exactes del dia de l'entrega final |
| Part III. El producte (capítols 16 a 21) | Esborrany | Refer les captures de pantalla amb les dades finals |
| Part IV. Resultats i conclusions (capítols 22 a 26) | Per escriure | Tot. Depèn de les proves amb usuaris, que encara no s'han fet |
| Glossari | Esborrany | Afegir-hi les paraules de la Part IV |
| Fonts d'informació | Recollides, no incloses aquí | Passar-les al format definitiu |
| Annexos | Per preparar | Triar quins documents del projecte hi van |

*Taula de guia. Estat de cada apartat l'11 de novembre del 2026.*

## Sobre l'índex comentat

Després de l'índex hi ha un **índex comentat**: el mateix índex, amb dues o
tres línies que expliquen què diu cada capítol. S'ha afegit només en aquesta
entrega, perquè es vegi d'un cop d'ull l'estructura de tot el treball,
també de la part que encara no està escrita. Al treball final no hi serà:
hi haurà l'índex normal, amb els títols i els números de pàgina.

## El que falta per acabar

- Fer les proves amb usuaris i escriure la Part IV.
- Completar la portada, la motivació personal i els agraïments.
- Acabar l'abstract amb els resultats.
- Preparar les fonts d'informació i els annexos.
- Passar tot el text al format definitiu i comprovar que no passa de 50
  pàgines.
"""

INLINE = re.compile(r"(\*\*\*.+?\*\*\*|\*\*.+?\*\*|\*.+?\*|`.+?`)")
IMATGE = re.compile(r"!\[(.*?)\]\((.+?)\)")


def escriu(par, text, negreta=False, cursiva=False):
    """Afegeix text a un paràgraf, convertint **negreta**, *cursiva* i `codi`."""
    for tros in INLINE.split(text):
        if not tros:
            continue
        n, c, t = negreta, cursiva, tros
        if tros.startswith("***") and tros.endswith("***") and len(tros) > 6:
            n, c, t = True, True, tros[3:-3]
        elif tros.startswith("**") and tros.endswith("**") and len(tros) > 4:
            n, t = True, tros[2:-2]
        elif tros.startswith("*") and tros.endswith("*") and len(tros) > 2:
            c, t = True, tros[1:-1]
        elif tros.startswith("`") and tros.endswith("`") and len(tros) > 2:
            t = tros[1:-1]
        if t != tros and INLINE.search(t):
            escriu(par, t, n, c)
            continue
        r = par.add_run(t)
        r.bold, r.italic = n or None, c or None
        if "[PER OMPLIR" in t or "[PENDENT" in t:
            r.font.color.rgb = RGBColor(0xB0, 0x3A, 0x00)


def imatge(par, ruta, ample):
    fitxer = TREBALL / ruta
    par.alignment = WD_ALIGN_PARAGRAPH.CENTER
    par.add_run().add_picture(str(fitxer), width=ample)


def taula(doc, linies):
    files = [[c.strip() for c in l.strip().strip("|").split("|")] for l in linies]
    files = [f for f in files if not all(re.fullmatch(r":?-+:?", c) for c in f)]
    cols = len(files[0])
    t = doc.add_table(rows=0, cols=cols)
    t.style = "Table Grid"
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, fila in enumerate(files):
        cel·les = t.add_row().cells
        for j, text in enumerate(fila[:cols]):
            par = cel·les[j].paragraphs[0]
            par.paragraph_format.line_spacing = 1.15
            par.paragraph_format.space_after = Pt(2)
            m = IMATGE.fullmatch(text)
            if m:
                imatge(par, m.group(2), Cm(15.2 / cols))
            else:
                escriu(par, text, negreta=(i == 0))
            for r in par.runs:
                r.font.size = Pt(10)
    doc.add_paragraph().paragraph_format.space_after = Pt(0)


def afegeix(doc, md, salt=True):
    """Converteix un text Markdown senzill en paràgrafs del document."""
    blocs = re.split(r"\n\s*\n", md.strip())
    primer = True
    for bloc in blocs:
        linies = bloc.split("\n")
        cap = linies[0]
        if cap.strip() == "---":
            continue
        m = re.match(r"(#{1,3}) (.+)", cap)
        if m:
            nivell = len(m.group(1))
            if nivell == 1 and (salt or not primer):
                doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)
            h = doc.add_heading(level=nivell)
            escriu(h, m.group(2).strip())
            primer = False
            resta = "\n".join(linies[1:]).strip()
            if resta:
                afegeix(doc, resta, salt=False)
            continue
        primer = False
        if cap.startswith("|"):
            taula(doc, linies)
        elif cap.startswith(">"):
            par = doc.add_paragraph(style="Intense Quote")
            escriu(par, " ".join(l.lstrip("> ").strip() for l in linies))
        elif re.match(r"(- |\d+\. )", cap):
            elements, numerada = [], bool(re.match(r"\d+\. ", cap))
            for l in linies:
                if re.match(r"(- |\d+\. )", l):
                    elements.append(re.sub(r"^(- |\d+\. )", "", l).strip())
                else:
                    elements[-1] += " " + l.strip()
            for e in elements:
                escriu(doc.add_paragraph(style="List Number" if numerada else "List Bullet"), e)
            if numerada:  # cada llista numerada torna a començar per 1
                reinicia_numeracio(doc, len(elements))
        elif IMATGE.fullmatch(bloc.strip()):
            imatge(doc.add_paragraph(), IMATGE.fullmatch(bloc.strip()).group(2), Cm(15))
        else:
            text = " ".join(l.strip() for l in linies)
            par = doc.add_paragraph()
            escriu(par, text)
            if re.fullmatch(r"\*(Taula|Figura) .+\*", text, re.S):
                par.alignment = WD_ALIGN_PARAGRAPH.CENTER
                for r in par.runs:
                    r.font.size = Pt(10)


def reinicia_numeracio(doc, quants):
    """Dona a les últimes `quants` línies numerades una numeració pròpia."""
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn

    numbering = doc.part.numbering_part.numbering_definitions._numbering
    pars = [p for p in doc.paragraphs if p.style.name == "List Number"][-quants:]
    base = pars[0].style.element.pPr.numPr.numId.val if pars[0].style.element.pPr is not None \
        and pars[0].style.element.pPr.numPr is not None else None
    if base is None:
        return
    abstracte = None
    for num in numbering.findall(qn("w:num")):
        if num.get(qn("w:numId")) == str(base):
            abstracte = num.find(qn("w:abstractNumId")).get(qn("w:val"))
    if abstracte is None:
        return
    nou_id = max(int(n.get(qn("w:numId"))) for n in numbering.findall(qn("w:num"))) + 1
    num = OxmlElement("w:num")
    num.set(qn("w:numId"), str(nou_id))
    a = OxmlElement("w:abstractNumId")
    a.set(qn("w:val"), abstracte)
    num.append(a)
    over = OxmlElement("w:lvlOverride")
    over.set(qn("w:ilvl"), "0")
    start = OxmlElement("w:startOverride")
    start.set(qn("w:val"), "1")
    over.append(start)
    num.append(over)
    numbering.append(num)
    for p in pars:
        numPr = p._p.get_or_add_pPr().get_or_add_numPr()
        numPr.get_or_add_ilvl().val = 0
        numPr.get_or_add_numId().val = nou_id


def neteja(md):
    """Treu d'un text les notes internes de treball."""
    blocs = re.split(r"\n\s*\n", md.replace("\r\n", "\n"))
    fora = ("> ⚠️", "> Les orientacions demanen", "> L'índex definitiu", "*Esborrany de")
    text = "\n\n".join(b for b in blocs if not b.lstrip().startswith(fora))
    # Les marques llargues porten instruccions de treball: se'n deixa el tema
    curtes = {
        "la motivació personal": "[PER OMPLIR: la motivació personal]",
        "quina ajuda de la": "[PER OMPLIR: quina ajuda de la intel·ligència artificial "
                             "hi ha hagut en la redacció]",
        "a qui vol donar les gràcies": "[PER OMPLIR: els agraïments]",
    }

    def escurca(m):
        pla = " ".join(m.group(0).split())
        for clau, curta in curtes.items():
            if clau in pla:
                return curta
        return m.group(0)

    return re.sub(r"\[PER OMPLIR[^\]]{50,}\]", escurca, text)


def llegeix(nom):
    return neteja((TREBALL / nom).read_text(encoding="utf-8"))


def seccions_preliminars():
    """Parteix els preliminars en apartats i els puja un nivell de títol."""
    text = llegeix("preliminars.md")
    parts = re.split(r"\n(?=## )", text)
    sec = {}
    for p in parts:
        m = re.match(r"## (.+)", p)
        if not m:
            continue
        cos = re.sub(r"^###", "##", p[m.end():], flags=re.M)
        sec[m.group(1).split(" (")[0].strip()] = f"# {m.group(1)}\n{cos}"
    return sec


def main():
    doc = Document()
    for s in doc.sections:
        s.page_width, s.page_height = Cm(21), Cm(29.7)
        s.left_margin = s.right_margin = Cm(2.5)
        s.top_margin = s.bottom_margin = Cm(2.5)
    normal = doc.styles["Normal"]
    normal.font.name, normal.font.size = "Calibri", Pt(12)
    normal.paragraph_format.line_spacing = 1.5
    normal.paragraph_format.space_after = Pt(8)
    for nom in ("Heading 1", "Heading 2", "Heading 3", "Intense Quote"):
        doc.styles[nom].font.name = "Calibri"
        doc.styles[nom].font.color.rgb = RGBColor(0x1F, 0x1F, 0x1F)
    doc.styles["Intense Quote"].font.italic = False

    pre = seccions_preliminars()
    afegeix(doc, GUIA, salt=False)
    for nom in ("Portada", "Abstract", "Índex"):
        afegeix(doc, pre[nom])
    afegeix(doc, llegeix("index-comentat.md"))
    for nom in ("Presentació", "Introducció"):
        afegeix(doc, pre[nom])
    for fitxer in ("marc-teoric.md", "part-2-metodologia.md", "part-3-producte.md", "glossari.md"):
        afegeix(doc, llegeix(fitxer))

    SORTIDA.mkdir(exist_ok=True)
    desti = SORTIDA / f"Pokedanex-entrega-parcial-{date.today().isoformat()}.docx"
    doc.save(desti)
    paraules = sum(len(p.text.split()) for p in doc.paragraphs)
    print(f"{desti.relative_to(ARREL)}  ({paraules} paraules, {len(doc.inline_shapes)} imatges)")


if __name__ == "__main__":
    main()
