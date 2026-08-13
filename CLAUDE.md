# Pokedanex — Regles del projecte

## Què és aquest projecte

Treball de recerca de 1r de batxillerat de l'Edanna sobre el **"vibe coding"**.
Hipòtesi: *"Es pot crear una pàgina web útil sense saber programar?"*

El producte és una web de **col·leccionisme de cartes Pokémon**: els usuaris
indiquen quines cartes i àlbums tenen, i la pàgina calcula el valor aproximat
de la col·lecció i quant costaria completar-la.

## Regles fonamentals (no negociables)

1. **L'Edanna no escriu ni una línia de codi.** Tot el codi el genera la IA.
   Mai demanar-li que editi codi a mà — és part de la hipòtesi del treball.
2. **Pressupost màxim: 20 €/mes.** Prioritzar eines gratuïtes o free tier.
   Abans de proposar qualsevol servei de pagament, indicar-ne el cost.
3. **Idioma: català.** Respostes, documentació i interfície en català
   (el codi pot tenir noms en anglès, com és habitual).
4. **Documentar-ho tot per al treball.** Cada sessió de treball s'apunta a
   `docs/diari.md`: què s'ha fet, quines eines s'han usat, què ha costat
   (temps i diners) i quins problemes han sorgit. Això és font primària
   per al treball escrit.
5. **Explicar les decisions de manera entenedora.** L'audiència final és un
   tribunal de professors no tècnics: quan es prengui una decisió tècnica,
   explicar-la en llenguatge planer i registrar-la a `docs/decisions.md`.
6. **Registrar cada pas nou a l'històric.** Sempre que fem alguna cosa nova
   (crear una part del projecte, afegir una funcionalitat, configurar una
   eina...), afegir una entrada a `docs/historic.md` amb un **títol** i una
   **explicació** breu. Serveix per recordar els passos seguits i
   reconstruir el procés al treball escrit.
7. **En acabar qualsevol modificació de la web, passar sempre l'enllaç
   local** perquè l'Edanna la pugui veure de seguida:
   http://localhost:8000/app/ (si el servidor no està engegat, arrencar-lo
   o recordar-li l'ordre `python -m http.server 8000` des de l'arrel).
8. **Registrar les dificultats a `docs/reptes.md`.** Sempre que hi hagi un
   procés que sigui difícil de fer o d'entendre per a l'humà (un problema
   tècnic que costi de resoldre, un concepte que calgui explicar, una
   decisió complicada...), afegir una entrada a `docs/reptes.md`: un
   **títol**, la **data** i **un o dos paràgrafs de prosa acabada** en
   llenguatge planer, pensats per anar directament al treball escrit.

## Estructura del repositori

- `app/` — codi de la pàgina web
- `docs/` — documentació tècnica: `planificacio.md`, `especificacions.md`,
  `decisions.md`, `diari.md`
- `treball/` — el treball de recerca escrit (document a entregar)
- `presentacio/` — la presentació final

## Flux de treball

- El projecte avança per les fases definides a `docs/planificacio.md`.
- No es comença una fase sense tancar l'anterior.
- La Fase 0 (especificacions) genera `docs/especificacions.md` a partir
  d'una entrevista de preguntes i respostes.
- **Branques i pull requests (a partir de la Fase 2):** els canvis nous es
  fan en una branca pròpia i arriben a `main` mitjançant un pull request a
  GitHub, on es revisen abans de fusionar. No es treballa directament sobre
  `main` (excepte retocs de documentació menors).
