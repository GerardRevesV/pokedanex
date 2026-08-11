"""Descarrega les dades d'un set de cartes de pokemontcg.io.

Crea una versio nova amb la data i hora a app/data/versions/<set>/ i
actualitza l'index d'aquell set (index.json) i el registre de sets
(app/data/sets.json). Mai se sobreescriu cap versio anterior.
Nomes fa servir la llibreria estandard.

Us: python tools/fetch_data.py <id_del_set>
Exemple: python tools/fetch_data.py sv6pt5
Sense argument, baixa sv6pt5 (Shrouded Fable) i mostra un avis.
"""

import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime
from pathlib import Path

# Rutes del projecte (relatives a aquest fitxer, per poder executar-lo des d'on sigui)
ARREL = Path(__file__).resolve().parent.parent
FITXER_CONFIG = ARREL / "config.json"
CARPETA_DATA = ARREL / "app" / "data"
FITXER_SETS = CARPETA_DATA / "sets.json"

API_BASE = "https://api.pokemontcg.io/v2"
SET_DEFECTE = "sv6pt5"
MAX_REINTENTS = 6

# Camps de cada carta que la web necessita (la resta es descarta)
CAMPS_CARTA = [
    "id", "number", "name", "supertype", "subtypes", "types", "rarity",
    "hp", "attacks", "abilities", "weaknesses", "resistances",
    "retreatCost", "convertedRetreatCost", "evolvesFrom", "evolvesTo",
    "artist", "flavorText", "nationalPokedexNumbers", "images",
    "cardmarket", "tcgplayer",
]

# Camps del set que guardem al registre sets.json (la resta es descarta)
CAMPS_SET = [
    "id", "name", "series", "printedTotal", "total",
    "releaseDate", "ptcgoCode", "images",
]

# Sets sense art propi a images.pokemontcg.io: per als sets mes nous, el CDN
# oficial serveix el revers de carta generic com a "logo" i "symbol" (la
# mateixa imatge per a tots), i al menu es veurien identics. Mentre no hi
# hagi art oficial, fem servir els logotips de TCGdex (assets.tcgdex.net),
# una font oberta alternativa. Quan pokemontcg.io publiqui les imatges
# reals, nomes cal esborrar l'entrada corresponent d'aquest diccionari.
IMATGES_ALTERNATIVES = {
    "me2pt5": {
        "symbol": "https://assets.tcgdex.net/univ/me/me02.5/symbol.png",
        "logo": "https://assets.tcgdex.net/en/me/me02.5/logo.png",
    },
    "me3": {
        "symbol": "https://assets.tcgdex.net/univ/me/me03/symbol.png",
        "logo": "https://assets.tcgdex.net/en/me/me03/logo.png",
    },
    "me4": {
        "symbol": "https://assets.tcgdex.net/univ/me/me04/symbol.png",
        "logo": "https://assets.tcgdex.net/en/me/me04/logo.png",
    },
    "me5": {
        "symbol": "https://assets.tcgdex.net/univ/me/me05/symbol.png",
        "logo": "https://assets.tcgdex.net/en/me/me05/logo.png",
    },
}


def escriure_json(ruta, dades):
    """Escriu un JSON de manera segura: primer en un fitxer temporal i despres
    el mou al lloc definitiu. os.replace es una operacio atomica, aixi que una
    interrupcio a mig escriure mai deixa el fitxer original corromput."""
    temporal = ruta.with_name(ruta.name + ".tmp")
    with open(temporal, "w", encoding="utf-8") as f:
        json.dump(dades, f, ensure_ascii=False, indent=2)
    os.replace(temporal, ruta)


def llegir_clau_api():
    """Llegeix la clau de l'API de config.json. Si no hi es, seguim sense clau."""
    try:
        with open(FITXER_CONFIG, encoding="utf-8") as f:
            clau = json.load(f).get("pokemontcgApiKey")
        if clau:
            print("Clau de l'API trobada a config.json.")
            return clau
    except FileNotFoundError:
        pass
    print("Avis: no s'ha trobat cap clau d'API. Continuem sense clau (limits mes estrictes).")
    return None


def peticio_api(url, clau_api):
    """Fa una peticio GET a l'API amb reintents (l'API falla sovint amb 502)."""
    for intent in range(1, MAX_REINTENTS + 1):
        try:
            # L'API bloqueja el User-Agent per defecte de Python (403),
            # per aixo n'enviem un de propi.
            peticio = urllib.request.Request(url, headers={"User-Agent": "Pokedanex/1.0"})
            if clau_api:
                peticio.add_header("X-Api-Key", clau_api)
            with urllib.request.urlopen(peticio, timeout=60) as resposta:
                return json.load(resposta)
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as error:
            # Els errors 4xx (tret del 429) son permanents: reintentar no serveix de res
            es_permanent = (
                isinstance(error, urllib.error.HTTPError)
                and error.code < 500
                and error.code != 429
            )
            if es_permanent:
                print(f"Error permanent de l'API ({error}). No te sentit reintentar.")
                raise
            if intent == MAX_REINTENTS:
                print(f"Error: l'API ha fallat {MAX_REINTENTS} vegades seguides. Ho deixem estar.")
                raise
            espera = 2 ** intent  # 2, 4, 8, 16, 32 segons
            print(f"  L'API ha fallat ({error}). Reintent {intent}/{MAX_REINTENTS - 1} d'aqui a {espera} s...")
            time.sleep(espera)


def retallar_carta(carta):
    """Es queda nomes amb els camps que la web fa servir."""
    return {camp: carta[camp] for camp in CAMPS_CARTA if camp in carta}


def clau_numero(carta):
    """Clau d'ordenacio tolerant amb numeros no purament numerics (p. ex. TG01).

    Trosseja el numero en parts de digits i de lletres, com fa el navegador
    amb l'ordenacio "natural" de data.js: "2" < "10" i "TG1" < "TG10".
    """
    parts = re.split(r"(\d+)", str(carta["number"]))
    return [int(p) if p.isdigit() else p for p in parts]


def baixar_set(set_id, clau_api):
    """Baixa la informacio general del set."""
    print(f"Baixant la informacio del set {set_id}...")
    resposta = peticio_api(f"{API_BASE}/sets/{set_id}", clau_api)
    conjunt = resposta["data"]
    # S'apliquen aqui (i no nomes a sets.json) perque el fitxer de versio
    # tambe guarda el set sencer i tot el que ve despres queda corregit.
    if set_id in IMATGES_ALTERNATIVES:
        conjunt["images"] = {**conjunt.get("images", {}), **IMATGES_ALTERNATIVES[set_id]}
        print("  Avis: aquest set no te art a pokemontcg.io; es fan servir les imatges de TCGdex.")
    print(f"  Set: {conjunt['name']} ({conjunt['total']} cartes en total).")
    return conjunt


def baixar_cartes(set_id, clau_api):
    """Baixa totes les cartes del set, pagina a pagina."""
    cartes = []
    pagina = 1
    while True:
        print(f"Baixant cartes (pagina {pagina})...")
        url = f"{API_BASE}/cards?q=set.id:{set_id}&pageSize=250&page={pagina}"
        resposta = peticio_api(url, clau_api)
        cartes += [retallar_carta(c) for c in resposta["data"]]
        print(f"  {len(cartes)} de {resposta['totalCount']} cartes baixades.")
        if len(cartes) >= resposta["totalCount"] or not resposta["data"]:
            break
        pagina += 1
    # Ordenades pel numero de col.leccio (l'ordre natural de l'album)
    cartes.sort(key=clau_numero)
    return cartes


def escriure_versio(set_id, conjunt, cartes):
    """Escriu el fitxer de la versio nova i retorna (id, fetchedAt)."""
    ara = datetime.now().astimezone()
    # L'id inclou l'hora perque mai se sobreescrigui una versio anterior,
    # ni executant l'script dues vegades el mateix dia (mateixa idea que el
    # boto "Actualitza dades" del navegador). Amb guions perque els dos
    # punts no son valids als noms de fitxer de Windows.
    id_versio = ara.strftime("%Y-%m-%d %H-%M-%S")
    fetched_at = ara.isoformat(timespec="seconds")
    carpeta_set = CARPETA_DATA / "versions" / set_id
    carpeta_set.mkdir(parents=True, exist_ok=True)
    ruta = carpeta_set / f"{id_versio}.json"
    dades = {
        "schemaVersion": 1,
        "fetchedAt": fetched_at,
        "source": "pokemontcg.io",
        "set": conjunt,
        "cards": cartes,
    }
    escriure_json(ruta, dades)
    print(f"Versio guardada a {ruta}")
    return id_versio, fetched_at


def actualitzar_index(set_id, id_versio, fetched_at, nombre_cartes):
    """Afegeix la versio nova a l'index del set, de mes nova a mes vella."""
    fitxer_index = CARPETA_DATA / "versions" / set_id / "index.json"
    try:
        with open(fitxer_index, encoding="utf-8") as f:
            index = json.load(f)
    except FileNotFoundError:
        index = {"versions": []}

    entrada = {
        "id": id_versio,
        # Ruta relativa a app/data/, que es des d'on la web carrega els fitxers
        "file": f"versions/{set_id}/{id_versio}.json",
        "fetchedAt": fetched_at,
        "cardCount": nombre_cartes,
    }
    # L'id porta data i hora, aixi que no hauria d'existir mai; el filtre
    # nomes evita duplicats si algu executa l'script dos cops el mateix segon
    altres = [v for v in index["versions"] if v["id"] != id_versio]
    index["versions"] = sorted(altres + [entrada], key=lambda v: v["fetchedAt"], reverse=True)

    escriure_json(fitxer_index, index)
    print(f"Index actualitzat a {fitxer_index} ({len(index['versions'])} versions).")


def actualitzar_sets(conjunt):
    """Dona d'alta (o actualitza) el set al registre sets.json."""
    try:
        with open(FITXER_SETS, encoding="utf-8") as f:
            registre = json.load(f)
    except FileNotFoundError:
        registre = {"sets": []}

    # Nomes guardem els camps que la web necessita del set
    entrada = {camp: conjunt[camp] for camp in CAMPS_SET if camp in conjunt}
    altres = [s for s in registre["sets"] if s["id"] != entrada["id"]]
    # Ordre: del mes nou al mes vell per data de sortida
    # Del més antic al més nou: l'ordre natural d'una col·lecció que creix
    registre["sets"] = sorted(altres + [entrada], key=lambda s: s["releaseDate"])

    escriure_json(FITXER_SETS, registre)
    print(f"Registre de sets actualitzat a {FITXER_SETS} ({len(registre['sets'])} sets).")


def main():
    print("=== Pokedanex: descarrega de dades ===")
    if len(sys.argv) > 1:
        set_id = sys.argv[1]
    else:
        set_id = SET_DEFECTE
        print(f"Avis: no s'ha indicat cap set. Es fara servir el set per defecte ({SET_DEFECTE}).")
        print("Us: python tools/fetch_data.py <id_del_set>")
    clau_api = llegir_clau_api()
    conjunt = baixar_set(set_id, clau_api)
    cartes = baixar_cartes(set_id, clau_api)
    id_versio, fetched_at = escriure_versio(set_id, conjunt, cartes)
    actualitzar_index(set_id, id_versio, fetched_at, len(cartes))
    actualitzar_sets(conjunt)
    print(f"Fet! {len(cartes)} cartes guardades a la versio {id_versio} del set {set_id}.")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nInterromput per l'usuari.")
        sys.exit(1)
