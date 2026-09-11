# Postman collection – Navigator BaO Curricula API

`navigator-bao-curricula-api.postman_collection.json` is een Postman-collectie om de Curriculum API van GO! Navigator BaO manueel te verkennen. Ze hoort bij de OpenAPI-specificatie in [`navigator-bao-curricula-api.openapi.yaml`](navigator-bao-curricula-api.openapi.yaml).

## Importeren

1. Open Postman.
2. **Import** → kies `navigator-bao-curricula-api.postman_collection.json`.
3. De collectie "Smartschool Doelenset" verschijnt met drie requests.

## Collection variables

De collectie werkt met variabelen die je invult op collectie-niveau (rechtermuisklik op de collectie → **Edit** → tab **Variables**):

| Variabele | Voorbeeldwaarde | Omschrijving |
|---|---|---|
| `baseUrl` | `https://g-o.smartschool.be/curriculum/api/v1` | Basis-URL van de API |
| `platformId` | `1071` | Id van het GO!-platform |
| `source` | `navigator-bao` | Vaste bron-waarde voor Navigator BaO |
| `formatedDateTimeToday` | *(automatisch)* | Wordt bij elke request automatisch ingevuld met de datum van vandaag (`YYYY-MM-DD`) via het pre-request script van de collectie |
| `structureId` | bv. `1071_3e9bbf13-78db-4980-84a2-4a3cddf73331_navigator-bao` | Identifier van een curriculum, op te halen via **GetCuricula** |

## Requests

- **GetCuricula** — `GET /curricula/{{platformId}}/{{formatedDateTimeToday}}/{{source}}`
  Haalt de lijst met beschikbare curricula op. Kopieer een `identifier` uit de response naar de variabele `structureId`.

- **GetStructure** — `GET /structure/{{platformId}}/{{structureId}}/{{source}}/{{formatedDateTimeToday}}`
  Haalt de volledige boomstructuur (doelen, tussentitels, labels, …) van één curriculum op.

- **PostConcordance** — `POST /curricula/concordance/2024-10-11`
  Vertaalt curriculumitem-identifiers naar de identifiers die gelden op de opgegeven datum (bv. na een leerplanwissel). Body: `{ "curriculumItemIdentifiers": [ "..." ] }`.

Zie [`navigator-bao-curricula-api.openapi.yaml`](navigator-bao-curricula-api.openapi.yaml) voor de volledige, officiële specificatie van alle endpoints, inclusief `/curricula/selection/{date}` (niet in deze collectie opgenomen).

## Opmerking

Deze endpoints zijn publiek toegankelijk (geen authenticatie nodig) op het GO!-platform (`g-o.smartschool.be`).
