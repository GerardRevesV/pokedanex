"""Descarrega les dades del set Shrouded Fable (sv6pt5) de pokemontcg.io.

Crea una versio nova amb la data i hora a app/data/versions/ i actualitza
l'index app/data/versions.json. Mai se sobreescriu cap versio anterior.
Nomes fa servir la llibreria estandard.

Us: python tools/fetch_data.py
"""

import json
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime
from pathlib import Path

# Rutes del projecte (relatives a aquest fitxer, per poder executar-lo des d'on sigui)
ARREL = Path(__file__).resolve().parent.parent
FITXER_CONFIG = ARREL / "config.json"
CARPETA_VERSIONS = ARREL / "app" / "data" / "versions"
FITXER_INDEX = ARREL / "app" / "data" / "versions.json"

API_BASE = "https://api.pokemontcg.io/v2"
SET_ID = "sv6pt5"
MAX_REINTENTS = 6

# Camps de cada carta que la web necessita (la resta es descarta)
CAMPS_CARTA = [
    "id", "number", "name", "supertype", "subtypes", "types", "rarity",
    "hp", "attacks", "abilities", "weaknesses", "resistances",
    "retreatCost", "convertedRetreatCost", "evolvesFrom", "evolvesTo",
    "artist", "flavorText", "nationalPokedexNumbers", "images",
    "cardmarket", "tcgplayer",
]


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


def baixar_set(clau_api):
    """Baixa la informacio general del set."""
    print(f"Baixant la informacio del set {SET_ID}...")
    resposta = peticio_api(f"{API_BASE}/sets/{SET_ID}", clau_api)
    conjunt = resposta["data"]
    print(f"  Set: {conjunt['name']} ({conjunt['total']} cartes en total).")
    return conjunt


def baixar_cartes(clau_api):
    """Baixa totes les cartes del set, pagina a pagina."""
    cartes = []
    pagina = 1
    while True:
        print(f"Baixant cartes (pagina {pagina})...")
        url = f"{API_BASE}/cards?q=set.id:{SET_ID}&pageSize=250&page={pagina}"
        resposta = peticio_api(url, clau_api)
        cartes += [retallar_carta(c) for c in resposta["data"]]
        print(f"  {len(cartes)} de {resposta['totalCount']} cartes baixades.")
        if len(cartes) >= resposta["totalCount"] or not resposta["data"]:
            break
        pagina += 1
    # Ordenades pel numero de col.leccio (l'ordre natural de l'album)
    cartes.sort(key=lambda c: int(c["number"]))
    return cartes


def escriure_versio(conjunt, cartes):
    """Escriu el fitxer de la versio nova i retorna (id, fetchedAt)."""
    ara = datetime.now().astimezone()
    # L'id inclou l'hora perque mai se sobreescrigui una versio anterior,
    # ni executant l'script dues vegades el mateix dia (mateixa idea que el
    # boto "Actualitza dades" del navegador). Amb guions perque els dos
    # punts no son valids als noms de fitxer de Windows.
    id_versio = ara.strftime("%Y-%m-%d %H-%M-%S")
    fetched_at = ara.isoformat(timespec="seconds")
    CARPETA_VERSIONS.mkdir(parents=True, exist_ok=True)
    ruta = CARPETA_VERSIONS / f"{id_versio}.json"
    dades = {
        "schemaVersion": 1,
        "fetchedAt": fetched_at,
        "source": "pokemontcg.io",
        "set": conjunt,
        "cards": cartes,
    }
    with open(ruta, "w", encoding="utf-8") as f:
        json.dump(dades, f, ensure_ascii=False, indent=2)
    print(f"Versio guardada a {ruta}")
    return id_versio, fetched_at


def actualitzar_index(id_versio, fetched_at, nombre_cartes):
    """Afegeix la versio nova a l'index, de mes nova a mes vella."""
    try:
        with open(FITXER_INDEX, encoding="utf-8") as f:
            index = json.load(f)
    except FileNotFoundError:
        index = {"versions": []}

    entrada = {
        "id": id_versio,
        "file": f"versions/{id_versio}.json",
        "fetchedAt": fetched_at,
        "cardCount": nombre_cartes,
    }
    # L'id porta data i hora, aixi que no hauria d'existir mai; el filtre
    # nomes evita duplicats si algu executa l'script dos cops el mateix segon
    altres = [v for v in index["versions"] if v["id"] != id_versio]
    index["versions"] = sorted(altres + [entrada], key=lambda v: v["fetchedAt"], reverse=True)

    with open(FITXER_INDEX, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
    print(f"Index actualitzat a {FITXER_INDEX} ({len(index['versions'])} versions).")


def main():
    print("=== Pokedanex: descarrega de dades ===")
    clau_api = llegir_clau_api()
    conjunt = baixar_set(clau_api)
    cartes = baixar_cartes(clau_api)
    id_versio, fetched_at = escriure_versio(conjunt, cartes)
    actualitzar_index(id_versio, fetched_at, len(cartes))
    print(f"Fet! {len(cartes)} cartes guardades a la versio {id_versio}.")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nInterromput per l'usuari.")
        sys.exit(1)
