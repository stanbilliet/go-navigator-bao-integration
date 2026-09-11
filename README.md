# GO! Navigator BaO – integratiedemo

Deze repository bevat een eenvoudige demo van de integratie met de **GO! Navigator BaO Selector**.

De integratie bestaat uit twee onderdelen:

1. de **Navigator Selector** gebruiken om leerplandoelen te laten selecteren;
2. de **Curriculum API** gebruiken om curricula en hun structuur rechtstreeks uit te lezen.

---

## 1. Navigator Selector

De GO! Navigator Selector kan vanuit een externe webapplicatie geopend worden:

```text
https://g-o.smartschool.be/navigator-bao/selector/basisonderwijs
```

De communicatie tussen de toepassing en Navigator gebeurt via de browser-API `window.postMessage`.

### Basisflow

```text
Applicatie
   │
   │ opent Navigator
   ▼
Navigator Selector
   │
   │ ready
   ▼
Applicatie
   │
   │ setSelection (optioneel)
   ▼
Navigator Selector
   │
   │ gebruiker selecteert doelen
   │
   │ save
   ▼
Applicatie
```

Navigator stuurt volgende events:

- `ready` – de selector is klaar;
- `save` – de gebruiker heeft zijn selectie opgeslagen;
- `close` – de selector wordt gesloten.

De toepassing kan een bestaande selectie terug naar Navigator sturen via `setSelection`.

Een selectie-item bestaat uit:

```javascript
{
    curriculumIdentifier: '...',
    curriculumItemIdentifier: '...'
}
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

> **Let op:** deze endpoints zijn afgeleid uit het netwerkverkeer van de GO! Navigator BaO Selector en zijn geen officieel gepubliceerde Smartschool API-documentatie.

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

De Curriculum API is afgeleid uit het actuele gedrag van GO! Navigator en kan in de toekomst wijzigen.

---

## Documentatie

De map [`documentatie/`](documentatie/README.md) bevat de officiële OpenAPI-specificatie, een Postman-collectie, een JSON-export van de leerplannen secundair onderwijs, de kenniskaart leerplanconcept, en info over de openbare (publieke) versie van GO! Navigator. Zie [`documentatie/README.md`](documentatie/README.md) voor het overzicht.
