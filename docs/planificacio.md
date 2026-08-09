# Planificació del projecte Pokedanex

Projecte per fases. Cada fase té un objectiu clar i un lliurable. No es passa
a la fase següent sense tancar l'anterior.

> Estat: ⬜ pendent · 🔄 en curs · ✅ acabada

## Calendari objectiu

Data límit real: **final de setembre de 2026** ha d'estar tot excepte la
part pràctica escrita i les conclusions. Objectiu ambiciós: tenir-ho tot.

| Fases | Quan |
|---|---|
| Fase 0 — Especificacions | ✅ 9 d'agost |
| Fase 1 — Fonaments tècnics | mitjan agost |
| Fase 2 — Funcionalitats | agost – primers de setembre |
| Fase 3 — Publicació i proves | primera quinzena de setembre |
| Fase 4 — Treball escrit (teoria) | setembre (límit: final de setembre) |
| Fase 4 — Part pràctica i conclusions | final de setembre si pot ser; si no, després |
| Fase 5 — Presentació | quan hi hagi data de defensa |

## Fase 0 — Especificacions ✅

**Objectiu:** entendre exactament què ha de fer la web abans d'escriure res.

L'Edanna explica la seva idea i la IA fa preguntes (funcionalitats, usuaris,
dades de cartes, aspecte visual, pressupost...). De l'entrevista en surt el
document d'especificacions.

**Lliurable:** `docs/especificacions.md`

## Fase 1 — Fonaments tècnics ✅

> Tancada el 9 d'agost. L'únic punt que queda obert (estudiar CardTrader
> com a font complementària de preus) passa a la Fase 2.

**Objectiu:** triar les eines i deixar el projecte a punt per construir.

- Triar tecnologia de la web, on s'allotjarà i d'on sortiran les dades de
  cartes Pokémon (API), sempre dins del pressupost de 20 €/mes.
- Registrar cada tria i el seu cost a `docs/decisions.md`.
- Crear l'esquelet de l'aplicació dins `app/` i comprovar que arrenca.

**Lliurable:** projecte que s'executa en local amb una pàgina inicial.

## Fase 2 — Funcionalitats principals ⬜

**Objectiu:** construir el cor de la web, per ordre de prioritat.

- Veure cartes i expansions (dades reals de l'API).
- Marcar quines cartes tens (la teva col·lecció).
- Calcular el valor aproximat de la col·lecció.
- Calcular quant costaria completar un àlbum o expansió.

**Lliurable:** web funcional en local amb totes les funcionalitats de
l'especificació.

## Fase 3 — Publicació i proves ⬜

**Objectiu:** que la web sigui accessible per a tothom des d'Internet.

- Publicar la web (desplegament) i comprovar que funciona des de mòbil
  i ordinador.
- Provar-la amb usuaris reals (amics, família) i apuntar què cal millorar.

**Lliurable:** URL pública de la web funcionant.

## Fase 4 — Treball escrit ⬜

**Objectiu:** redactar el treball de recerca amb tot el material acumulat.

- Part teòrica: què és el vibe coding, eines existents, avantatges i
  inconvenients.
- Part pràctica: el procés seguit (a partir de `docs/diari.md` i
  `docs/decisions.md`), costos reals, problemes trobats.
- Conclusions: es confirma la hipòtesi? Es pot crear una web útil sense
  saber programar?

**Lliurable:** document final a `treball/`.

## Fase 5 — Presentació ⬜

**Objectiu:** preparar la defensa davant del tribunal.

- Presentació de suport (diapositives) a `presentacio/`.
- Demostració en directe de la web.
- Assaig de la presentació.

**Lliurable:** presentació a punt per exposar.
