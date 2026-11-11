"""Prepara els documents del projecte per publicar-los amb la web.

La web publicada és només la carpeta `app/`, de manera que els documents
de `docs/` i `treball/` no hi arriben. Aquest script en fa una còpia dins
d'`app/documents/md/` i hi escriu un índex (`index.json`) que el lector
d'`app/documents/index.html` llegeix per muntar el menú.

La còpia no es guarda al repositori (està al .gitignore): la fa el
desplegament cada vegada, així el que es publica sempre són els documents
tal com són en aquell moment.

Ús:  python tools/prepara_documents.py
"""

import json
import shutil
import subprocess
from pathlib import Path

ARREL = Path(__file__).resolve().parent.parent
DESTI = ARREL / "app" / "documents" / "md"

# Les dues col·leccions de documents, amb el nom que es veurà al menú.
GRUPS = [
    ("treball", "El treball de recerca"),
    ("docs", "Documentació del projecte"),
]

# Ordre preferit dins de cada grup: els documents que no hi surten van
# després, per ordre alfabètic.
ORDRE = {
    "treball": [
        "requisits-i-rubrica.md",
        "guio-continguts.md",
        "preliminars.md",
        "index-comentat.md",
        "marc-teoric.md",
        "part-2-metodologia.md",
        "part-3-producte.md",
        "glossari.md",
        "fonts.md",
    ],
    "docs": [
        "planificacio.md",
        "pendents.md",
        "especificacions.md",
        "historic.md",
        "diari.md",
        "reptes.md",
        "decisions.md",
        "arquitectura.md",
    ],
}


def titol(fitxer: Path) -> str:
    """El primer títol de nivell 1 del document, o el nom del fitxer."""
    for linia in fitxer.read_text(encoding="utf-8").splitlines():
        if linia.startswith("# "):
            return linia[2:].strip()
    return fitxer.stem.replace("-", " ").capitalize()


def data_ultim_canvi(fitxer: Path) -> str:
    """Data de l'últim commit que va tocar el fitxer (ISO, o buit)."""
    try:
        sortida = subprocess.run(
            ["git", "log", "-1", "--format=%cI", "--", str(fitxer.relative_to(ARREL))],
            cwd=ARREL,
            capture_output=True,
            text=True,
            check=True,
        )
        return sortida.stdout.strip()
    except (subprocess.CalledProcessError, FileNotFoundError):
        # Sense historial de git (per exemple en una còpia superficial)
        # el lector simplement no mostrarà la data.
        return ""


def clau_ordre(grup: str, nom: str) -> tuple:
    preferit = ORDRE.get(grup, [])
    if nom in preferit:
        return (0, preferit.index(nom), nom)
    return (1, 0, nom)


def main() -> None:
    if DESTI.exists():
        shutil.rmtree(DESTI)
    DESTI.mkdir(parents=True)

    index = {"grups": []}

    for carpeta, nom_grup in GRUPS:
        origen = ARREL / carpeta
        if not origen.is_dir():
            continue

        fitxers = sorted(origen.glob("*.md"), key=lambda f: clau_ordre(carpeta, f.name))
        if not fitxers:
            continue

        (DESTI / carpeta).mkdir(parents=True, exist_ok=True)
        documents = []

        for fitxer in fitxers:
            shutil.copy2(fitxer, DESTI / carpeta / fitxer.name)
            documents.append(
                {
                    "ruta": f"{carpeta}/{fitxer.name}",
                    "id": f"{carpeta}/{fitxer.stem}",
                    "titol": titol(fitxer),
                    "actualitzat": data_ultim_canvi(fitxer),
                    "paraules": len(fitxer.read_text(encoding="utf-8").split()),
                }
            )
            print(f"  copiat  {carpeta}/{fitxer.name}")

        # Les figures dels documents (captures de pantalla) viatgen amb ells.
        figures = origen / "figures"
        if figures.is_dir():
            shutil.copytree(figures, DESTI / carpeta / "figures")
            print(f"  copiat  {carpeta}/figures/")

        index["grups"].append({"carpeta": carpeta, "nom": nom_grup, "documents": documents})

    (DESTI / "index.json").write_text(
        json.dumps(index, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    total = sum(len(g["documents"]) for g in index["grups"])
    print(f"\n{total} documents preparats a {DESTI.relative_to(ARREL)}")


if __name__ == "__main__":
    main()
