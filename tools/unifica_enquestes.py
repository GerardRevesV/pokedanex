"""Unifica els Excels de l'enquesta (Microsoft Forms) i en treu estadistiques.

Us:
    python tools/unifica_enquestes.py FITXER1.xlsx FITXER2.xlsx [...]

Accepta el formulari en catala i en castella (mateixes 29 columnes, mateix
ordre). Escriu docs/enquestes/enquesta-unificada.xlsx amb quatre fulls:
Respostes, Estadistiques, Per perfil i Text lliure.
"""
import re
import sys
from collections import Counter
from pathlib import Path
from statistics import mean, median

from openpyxl import Workbook, load_workbook
from openpyxl.chart import BarChart, Reference
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

SORTIDA = Path(__file__).resolve().parent.parent / "docs" / "enquestes" / "enquesta-unificada.xlsx"

# (clau, titol en catala, tipus) per a les columnes 7..29 del formulari
PREGUNTES = [
    ("edat", "Edat", "num"),
    ("colleccionista", "Col·lecciona cartes Pokémon?", "cat"),
    ("dispositiu", "Dispositiu", "cat"),
    ("entes", "Ha entès per a què serveix en pocs segons?", "cat"),
    ("disseny", "Disseny visual (1-5)", "num"),
    ("facilitat", "Fàcil d'utilitzar sense instruccions (1-5)", "num"),
    ("dificultats", "Dificultats per trobar alguna cosa", "text"),
    ("filtres", "Sistema de filtres (1-5)", "num"),
    ("reverse", "Ha entès la diferència Normal / Reverse Holo?", "cat"),
    ("error", "Ha trobat algun error?", "cat"),
    ("error_desc", "Descripció de l'error", "text"),
    ("pantalla", "Es veu bé a la pantalla?", "cat"),
    ("perdua", "Ha perdut dades de la col·lecció?", "cat"),
    ("confianca", "Confiança per desar-hi la col·lecció (1-5)", "num"),
    ("export", "Exportar / Importar", "cat"),
    ("falta", "Troba a faltar alguna cosa?", "cat"),
    ("falta_que", "Què troba a faltar", "text"),
    ("canviaria", "Què canviaria", "text"),
    ("agradat", "Què li ha agradat més", "text"),
    ("global", "Valoració global (1-10)", "num"),
    ("recomana", "La recomanaria?", "cat"),
    ("util", "Li ha resultat útil?", "cat"),
    ("comentaris", "Comentaris lliures", "text"),
]

# Respostes tancades: castella / variants -> catala
NORMALITZA = {
    "sí, de vez en cuando": "Sí, de tant en tant",
    "sí, de tant en tant": "Sí, de tant en tant",
    "sí, activamente": "Sí, activament",
    "sí, activament": "Sí, activament",
    "sí, enseguida": "Sí, de seguida",
    "sí, de seguida": "Sí, de seguida",
    "mas o menos": "Més o menys",
    "més o menys": "Més o menys",
    "si": "Sí",
    "sí": "Sí",
    "no": "No",
    "puede ser": "Potser",
    "potser": "Potser",
    "un poco": "Una mica",
    "una mica": "Una mica",
    "no mucho": "No gaire",
    "no gaire": "No gaire",
    "no lo ho he usado": "No ho ha utilitzat",
    "no ho he utilitzat": "No ho ha utilitzat",
    "si, ha funcionado a la primera": "Sí, ha funcionat a la primera",
    "si, ha funcionat a la primera": "Sí, ha funcionat a la primera",
}
DISPOSITIU = {"movil": "Mòbil", "mòbil": "Mòbil", "ordenador": "Ordinador", "ordinador": "Ordinador"}

ORDRE = {
    "colleccionista": ["No", "Sí, de tant en tant", "Sí, activament"],
    "dispositiu": ["Mòbil", "Ordinador", "Mòbil i ordinador"],
    "entes": ["Sí, de seguida", "Més o menys", "No"],
    "recomana": ["Sí", "Potser", "No"],
    "util": ["Sí", "Una mica", "No gaire", "No"],
}

NEGRETA = Font(bold=True)
CAP = PatternFill("solid", start_color="1F3864")
CAP_FONT = Font(bold=True, color="FFFFFF")
SECCIO = PatternFill("solid", start_color="D9E1F2")


def neteja(clau, tipus, valor):
    if valor is None:
        return None
    if tipus == "num":
        if isinstance(valor, (int, float)):
            return valor
        m = re.search(r"\d+", str(valor))
        return int(m.group()) if m else None
    text = str(valor).strip()
    if not text:
        return None
    if tipus == "text":
        return text
    if clau == "dispositiu":
        parts = [DISPOSITIU.get(p.strip().lower(), p.strip()) for p in text.split(";") if p.strip()]
        return "Mòbil i ordinador" if len(set(parts)) > 1 else parts[0]
    return NORMALITZA.get(text.lower(), text)


def llegeix(fitxers):
    files = []
    for fitxer in fitxers:
        ws = load_workbook(fitxer).active
        capcalera = [c.value for c in ws[1]]
        idioma = "Castellà" if "edad" in str(capcalera[6]).lower() else "Català"
        for fila in ws.iter_rows(min_row=2, values_only=True):
            if fila[0] is None:
                continue
            r = {"idioma": idioma, "id_original": fila[0], "inici": fila[1], "fitxer": Path(fitxer).name}
            r["minuts"] = round((fila[2] - fila[1]).total_seconds() / 60, 1) if fila[1] and fila[2] else None
            for (clau, _, tipus), valor in zip(PREGUNTES, fila[6:29]):
                r[clau] = neteja(clau, tipus, valor)
            files.append(r)
    files.sort(key=lambda r: r["inici"])
    for n, r in enumerate(files, 1):
        r["num"] = n
    return files


def perfil(r):
    return "No col·leccionista" if r["colleccionista"] == "No" else "Col·leccionista"


def franja(r):
    e = r["edat"]
    if e is None:
        return "Sense dada"
    return "Fins a 17" if e < 18 else "18-29" if e < 30 else "30-44" if e < 45 else "45 o més"


def capcalera(ws, fila, textos):
    for c, t in enumerate(textos, 1):
        cel = ws.cell(row=fila, column=c, value=t)
        cel.font, cel.fill = CAP_FONT, CAP
        cel.alignment = Alignment(wrap_text=True, vertical="center")


def full_respostes(wb, files):
    ws = wb.active
    ws.title = "Respostes"
    fixes = [("num", "Núm."), ("idioma", "Formulari"), ("id_original", "ID al formulari"),
             ("inici", "Data i hora"), ("minuts", "Minuts")]
    cols = fixes + [(k, t) for k, t, _ in PREGUNTES]
    capcalera(ws, 1, [t for _, t in cols])
    for r in files:
        ws.append([r[k] for k, _ in cols])
    tipus = {k: t for k, _, t in PREGUNTES}
    for i, (k, _) in enumerate(cols, 1):
        ws.column_dimensions[get_column_letter(i)].width = 45 if tipus.get(k) == "text" else 18
    for fila in ws.iter_rows(min_row=2):
        for cel in fila:
            cel.alignment = Alignment(wrap_text=True, vertical="top")
    ws.row_dimensions[1].height = 45
    ws.freeze_panes = "B2"
    ws.auto_filter.ref = ws.dimensions


def full_estadistiques(wb, files):
    ws = wb.create_sheet("Estadístiques")
    n = len(files)
    ws.append(["Enquesta Pokedanex: resum"])
    ws["A1"].font = Font(bold=True, size=14)
    ws.append(["Respostes totals", n])
    for idioma, q in Counter(r["idioma"] for r in files).items():
        ws.append([f"Formulari en {idioma.lower()}", q])
    ws.append(["Primera resposta", min(r["inici"] for r in files)])
    ws.append(["Última resposta", max(r["inici"] for r in files)])
    ws.append(["Temps mitjà per respondre (mediana, minuts)", median(r["minuts"] for r in files)])
    ws.append([])

    ws.append(["Preguntes amb nota"])
    ws.cell(row=ws.max_row, column=1).font = NEGRETA
    capcalera(ws, ws.max_row + 1, ["Pregunta", "Respostes", "Mitjana", "Mediana", "Mínim", "Màxim"])
    for clau, titol, tipus in PREGUNTES:
        if tipus != "num":
            continue
        v = [r[clau] for r in files if r[clau] is not None]
        ws.append([titol, len(v), round(mean(v), 2), median(v), min(v), max(v)])
    ws.append([])

    ws.append(["Distribució de les notes (nombre de respostes)"])
    ws.cell(row=ws.max_row, column=1).font = NEGRETA
    for clau, titol, maxim in [("disseny", "Disseny visual", 5), ("facilitat", "Facilitat d'ús", 5),
                               ("filtres", "Filtres", 5), ("confianca", "Confiança", 5),
                               ("global", "Valoració global", 10)]:
        capcalera(ws, ws.max_row + 1, [titol, "Respostes", "%"])
        inici = ws.max_row + 1
        v = [r[clau] for r in files if r[clau] is not None]
        for nota in range(1, maxim + 1):
            q = v.count(nota)
            ws.append([nota, q, round(100 * q / len(v), 1)])
        if clau == "global":
            g = BarChart()
            g.title, g.y_axis.title, g.x_axis.title = "Valoració global (1-10)", "Respostes", "Nota"
            g.add_data(Reference(ws, min_col=2, min_row=inici - 1, max_row=ws.max_row), titles_from_data=True)
            g.set_categories(Reference(ws, min_col=1, min_row=inici, max_row=ws.max_row))
            g.legend = None
            g.height, g.width = 8, 14
            ws.add_chart(g, "I2")
        ws.append([])

    ws.append(["Preguntes tancades"])
    ws.cell(row=ws.max_row, column=1).font = NEGRETA
    for clau, titol, tipus in PREGUNTES:
        if tipus != "cat":
            continue
        capcalera(ws, ws.max_row + 1, [titol, "Respostes", "%"])
        v = [r[clau] for r in files if r[clau] is not None]
        c = Counter(v)
        ordre = [o for o in ORDRE.get(clau, []) if o in c] + [o for o, _ in c.most_common() if o not in ORDRE.get(clau, [])]
        for o in ordre:
            ws.append([o, c[o], round(100 * c[o] / len(v), 1)])
        if len(v) < n:
            ws.append(["(sense resposta)", n - len(v), None])
        ws.append([])

    ws.append(["Edat per franges"])
    ws.cell(row=ws.max_row, column=1).font = NEGRETA
    capcalera(ws, ws.max_row + 1, ["Franja", "Respostes", "%"])
    c = Counter(franja(r) for r in files)
    for f in ["Fins a 17", "18-29", "30-44", "45 o més", "Sense dada"]:
        if c[f]:
            ws.append([f, c[f], round(100 * c[f] / n, 1)])
    ws.append([])
    ws.append(["Nota: al formulari en castellà, la pregunta «¿Se ve bien en tu pantalla? ¿Hay textos "
               "cortados...?» fa dues preguntes de sentit contrari en una; un «No» hi pot voler dir "
               "«no hi ha textos tallats». Aquelles 8 respostes s'han de llegir amb prudència."])
    ws.column_dimensions["A"].width = 52
    for col in "BCDEF":
        ws.column_dimensions[col].width = 12


def full_perfil(wb, files):
    ws = wb.create_sheet("Per perfil")
    mesures = [("disseny", "Disseny (1-5)"), ("facilitat", "Facilitat (1-5)"), ("filtres", "Filtres (1-5)"),
               ("confianca", "Confiança (1-5)"), ("global", "Global (1-10)")]
    grups = [("Per perfil de col·leccionista", perfil, ["Col·leccionista", "No col·leccionista"]),
             ("Per freqüència de col·lecció", lambda r: r["colleccionista"], ORDRE["colleccionista"]),
             ("Per dispositiu", lambda r: r["dispositiu"], ORDRE["dispositiu"]),
             ("Per franja d'edat", franja, ["Fins a 17", "18-29", "30-44", "45 o més", "Sense dada"]),
             ("Per idioma del formulari", lambda r: r["idioma"], ["Català", "Castellà"])]
    for titol, f, ordre in grups:
        ws.append([titol])
        ws.cell(row=ws.max_row, column=1).font = NEGRETA
        capcalera(ws, ws.max_row + 1, ["Grup", "Respostes"] + [t for _, t in mesures]
                  + ["% entén de seguida", "% Normal/Reverse entès", "% la recomana (Sí)", "% útil (Sí)"])
        for g in ordre:
            sub = [r for r in files if f(r) == g]
            if not sub:
                continue
            fila = [g, len(sub)]
            for clau, _ in mesures:
                v = [r[clau] for r in sub if r[clau] is not None]
                fila.append(round(mean(v), 2) if v else None)
            for clau, bo in [("entes", "Sí, de seguida"), ("reverse", "Sí"), ("recomana", "Sí"), ("util", "Sí")]:
                fila.append(round(100 * sum(r[clau] == bo for r in sub) / len(sub)))
            ws.append(fila)
        ws.append([])
    ws.append(["Atenció: els grups són petits (alguns de menys de 10 persones); les diferències són orientatives."])
    ws.column_dimensions["A"].width = 30
    for i in range(2, 12):
        ws.column_dimensions[get_column_letter(i)].width = 15


def full_text(wb, files):
    ws = wb.create_sheet("Text lliure")
    capcalera(ws, 1, ["Pregunta", "Núm.", "Perfil", "Dispositiu", "Global", "Resposta"])
    buides = re.compile(r"^(no|cap|no,? ?ninguna)\.?$", re.I)
    for clau, titol, tipus in PREGUNTES:
        if tipus != "text":
            continue
        for r in files:
            t = r[clau]
            if t and not buides.match(t.strip()):
                ws.append([titol, r["num"], perfil(r), r["dispositiu"], r["global"], t])
    for col, w in zip("ABCDEF", [34, 7, 20, 18, 8, 110]):
        ws.column_dimensions[col].width = w
    for fila in ws.iter_rows(min_row=2):
        for cel in fila:
            cel.alignment = Alignment(wrap_text=True, vertical="top")
    ws.freeze_panes = "A2"
    ws.auto_filter.ref = ws.dimensions


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    files = llegeix(sys.argv[1:])
    wb = Workbook()
    full_respostes(wb, files)
    full_estadistiques(wb, files)
    full_perfil(wb, files)
    full_text(wb, files)
    SORTIDA.parent.mkdir(parents=True, exist_ok=True)
    wb.save(SORTIDA)
    print(f"{len(files)} respostes -> {SORTIDA}")


if __name__ == "__main__":
    main()
