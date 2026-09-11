# GO! Navigator BaO – integratiedemo

Deze repository bevat een eenvoudige demo van de integratie met de **GO! Navigator BaO Selector**.

De integratie bestaat uit twee onderdelen:

1. de **Navigator Selector** gebruiken om leerplandoelen te laten selecteren;
2. de **Curriculum API** gebruiken om curricula en hun structuur rechtstreeks uit te lezen.

---

## 1. Navigator Selector

De GO! Navigator Selector kan vanuit een externe webapplicatie geopend worden, als popup tab of als `iframe`:

```text
https://g-o.smartschool.be/navigator-bao/selector/basisonderwijs
```

Optioneel met query parameters om een specifiek curriculum en/of curriculumitem te tonen: `?curriculumId=<uuid>&curriculumItemId=<uuid>`.

De communicatie tussen de toepassing en Navigator gebeurt via de browser-API `window.postMessage`. De volledige, officiële specificatie van dit protocol staat in [`documentatie/navigator-bao-selector-postmessage-protocol.pdf`](documentatie/navigator-bao-selector-postmessage-protocol.pdf). Onderstaand overzicht is een beknopte samenvatting.

### Basisflow

```text
Applicatie
   │
   │ opent Navigator (popup of iframe)
   ▼
Navigator Selector
   │
   │ ready
   ▼
Applicatie
   │
   │ setSelection (optioneel, enkel na ready)
   ▼
Navigator Selector
   │
   │ gebruiker selecteert doelen
   │
   │ save
   ▼
Applicatie
```

Navigator stuurt volgende **event messages**:

- `ready` – de selector is geïnitialiseerd en klaar om commands te ontvangen;
- `save` – de gebruiker heeft zijn selectie opgeslagen (`data: { selection }`);
- `close` – de selectortab wordt gesloten.

De toepassing kan enkel **na** het ontvangen van `ready` een **command message** naar Navigator sturen. Momenteel is er één command: `setSelection`, om een bestaande selectie in de selector te zetten.

Een selectie-item (`SimpleSelectionItem`) bestaat uit:

```typescript
type SimpleSelectionItem = {
    curriculumIdentifier: string;
    curriculumItemIdentifier: string;
};
```

---

## Demo

De demo toont een eenvoudige toepassing waarin opdrachten aangemaakt kunnen worden en één of meerdere leerplandoelen via Navigator geselecteerd kunnen worden.

Belangrijkste bestanden:

```text
index.html
js/
├── app.js
└── navigator.js
```

### `navigator.js`

Bevat de koppeling met GO! Navigator.

De `NavigatorSelector`:

- opent de selector;
- luistert naar `ready`, `save` en `close`;
- controleert of berichten afkomstig zijn van `https://g-o.smartschool.be`;
- kan een bestaande selectie opnieuw naar Navigator sturen.

### `app.js`

Bevat de logica van de demo.

Wanneer Navigator een selectie terugstuurt, worden onder andere volgende gegevens gebruikt:

```text
curriculumIdentifier
curriculumItemIdentifier
text
category
type
breadcrumbs
```

De demo bewaart alles enkel in het geheugen en heeft geen backend of database nodig.

---

## 2. Curriculum API

Navigator gebruikt daarnaast een API om de beschikbare curricula en hun structuur op te halen.

> **Let op:** de volledige, officiële specificatie van deze API staat in [`documentatie/navigator-bao-curricula-api.openapi.yaml`](documentatie/navigator-bao-curricula-api.openapi.yaml). Onderstaand overzicht is een beknopte samenvatting.

Base URL:

```text
https://g-o.smartschool.be/curriculum/api/v1
```

Voor GO! Navigator BaO lijken volgende waarden vast te zijn:

```text
platformId = 1071
source = navigator-bao
```

### Curricula ophalen

```http
GET /curricula/1071/{date}/navigator-bao
```

Voorbeeld:

```text
https://g-o.smartschool.be/curriculum/api/v1/curricula/1071/2026-08-12/navigator-bao
```

Dit endpoint geeft de beschikbare curricula terug. Elk curriculum bevat onder andere een unieke `identifier`.

### Structuur van een curriculum ophalen

De `identifier` uit het vorige endpoint kan gebruikt worden om de volledige curriculumstructuur op te halen:

```http
GET /structure/1071/{curriculumIdentifier}/navigator-bao/{date}
```

Voorbeeld voor Nederlands:

```text
https://g-o.smartschool.be/curriculum/api/v1/structure/1071/1071_4d72860b-b6d0-4157-8198-5e397a04d189_navigator-bao/navigator-bao/2026-08-12
```

De response bevat onder andere:

```text
curriculum
tree
configuration
```

`tree` bevat de hiërarchische structuur van het curriculum met onder andere leerplandoelen, tussentitels, labels en relaties tussen curriculumitems.

---

## Samengevat

Gebruik de **Navigator Selector** wanneer een gebruiker zelf leerplandoelen moet kiezen.

Gebruik de **Curriculum API** wanneer curriculumdata programmatisch moet worden uitgelezen.

---

## Disclaimer

Dit project is bedoeld als technisch integratievoorbeeld.

Zowel het Selector-protocol als de Curriculum API zijn officieel gedocumenteerd (zie [`documentatie/`](documentatie/README.md)) en kunnen in de toekomst wijzigen.

---

## Documentatie

De map [`documentatie/`](documentatie/README.md) bevat de officiële Selector-protocolspecificatie, de officiële OpenAPI-specificatie van de Curriculum API, een Postman-collectie, een JSON-export van de leerplannen secundair onderwijs, de kenniskaart leerplanconcept, en info over de openbare (publieke) versie van GO! Navigator. Zie [`documentatie/README.md`](documentatie/README.md) voor het overzicht.
