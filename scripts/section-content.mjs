// Existing example homepage content. Seed imports preserve any already edited records.
import {homeDocument} from './home-content.mjs'
import {replicationDefaults} from './replication-content.mjs'
import {drmiDefaults} from './hub-content.mjs'
export const sectionDocuments = [
  homeDocument,
  {
    "_id": "section-project",
    "_type": "projectPage",
    "navigationLabel": "About RESILIACT",
    "eyebrow": "THE PROJECT",
    "heading": "Complex risks.\nA connected response.",
    "lead": "Disasters rarely happen in isolation. A flood can disrupt power, transport and essential services. Effective preparedness means understanding these connections and acting together.",
    "paragraphs": [
      "RESILIACT develops an integrated web-based platform to help authorities anticipate the impacts of interacting hazards, use early warnings and coordinate decisions across organisations and sectors.",
      "Its full name captures that ambition: Cross-regional action for enhanced impact forecasting, early warning, and resilient governance."
    ],
    "principles": [
      {
        "_key": "principle-0",
        "title": "Anticipate impacts",
        "description": "Understand what hazards could mean for people, infrastructure and essential services."
      },
      {
        "_key": "principle-1",
        "title": "Act together",
        "description": "Connect forecasts with practical decisions and clear responsibilities."
      },
      {
        "_key": "principle-2",
        "title": "Build with communities",
        "description": "Co-create solutions with public authorities, businesses and civil society."
      }
    ]
  },
  {
    "_id": "section-platform",
    "_type": "platformPage",
    "navigationLabel": "Platform",
    "eyebrow": "THE RESILIACT PLATFORM",
    "heading": "Five components.\nOne integrated platform.",
    "intro": "The RESILIACT Platform is being developed to connect harmonised data, interacting hazards, impact forecasts, decision support and accessible risk communication.",
    "developmentNote": "Co-created and evaluated through Living Labs.",
    "components": [
      {
        "_key": "component-0",
        "label": "Data interoperability",
        "code": "MSDIF",
        "title": "A common foundation for shared data.",
        "description": "The Multi-System Data Interoperability Framework harmonises data exchange across hazard, exposure and vulnerability domains. It addresses the technical, semantic and governance requirements of working across systems.",
        "outcome": "Organisations can connect relevant information and use it together to support forecasting and decisions."
      },
      {
        "_key": "component-1",
        "label": "Hazard interactions",
        "code": "MHIF",
        "title": "Understanding how hazards interact.",
        "description": "The Multi-Hazard Interaction Framework models concurrent and cascading hazard processes, helping identify how one event can trigger or amplify another.",
        "outcome": "A broader understanding of interacting hazards supports more realistic impact forecasts."
      },
      {
        "_key": "component-2",
        "label": "Impact-based early warning",
        "code": "MIF-EWS",
        "title": "Warnings grounded in likely impacts.",
        "description": "The Multi-Hazard Impact Forecast-Based Early Warning System translates hazard interactions into forecasts of potential consequences for people, infrastructure and services.",
        "outcome": "Authorities can focus preparedness and early action on the impacts that matter in their local context."
      },
      {
        "_key": "component-3",
        "label": "Decision support",
        "code": "DSS",
        "title": "Connecting forecasts with decisions.",
        "description": "The Decision Support System links forecasts to decisions through predefined rules and thresholds, supporting coordinated anticipatory action.",
        "outcome": "Decision-makers can assess options and coordinate actions before impacts escalate."
      },
      {
        "_key": "component-4",
        "label": "Risk communication",
        "code": "MCERC",
        "title": "Clear information across channels.",
        "description": "The Multi-Channel Emergency Risk Communication environment supports coordinated, accessible and trusted risk communication across organisations and audiences.",
        "outcome": "Authorities and communities can share relevant warnings and understand the actions they support."
      }
    ]
  },
  {
    "_id": "section-hubs",
    "_type": "hubsPage",
    "navigationLabel": "RESILIACT Hubs",
    "eyebrow": "RESILIACT HUBS",
    "heading": "Rooted in the Nordic region.\nDesigned to travel.",
    "intro": "Five Disaster Risk Management Innovation Hubs bring research into local practice. Six replication sites will explore how the solutions transfer to other regional and institutional contexts.",
    "listHeading": "Explore our RESILIACT Hubs",
    "replicationEyebrow": "SIX REPLICATION SITES",
    "replicationSites": replicationDefaults,
    "drmihSites": drmiDefaults,
  },
  {
    "_id": "section-outcomes",
    "_type": "outcomesPage",
    "navigationLabel": "Outcomes",
    "eyebrow": "EXPECTED OUTCOMES",
    "heading": "Turning research\ninto practical capability.",
    "intro": "RESILIACT is developing solutions that help authorities and communities move from understanding complex risks to taking coordinated action.",
    "publishedHeading": "Published outcomes and resources",
    "expectedOutcomes": [
      {
        "_key": "expected-0",
        "title": "An integrated\nRESILIACT Platform",
        "description": "Interoperable data, multi-hazard impact forecasting, early warning, decision support and multi-channel risk communication.",
        "linkLabel": "Explore the components",
        "linkTarget": "#platform"
      },
      {
        "_key": "expected-1",
        "title": "Evidence from\nlocal practice",
        "description": "Co-design and evaluation through Living Labs, shaped by the operational needs of authorities, practitioners and communities.",
        "linkLabel": "Discover the hubs",
        "linkTarget": "#regions"
      },
      {
        "_key": "expected-2",
        "title": "Knowledge that\ncan be transferred",
        "description": "Replication activities will examine how the solutions and governance approaches can be adapted to different regions and institutions.",
        "linkLabel": "Meet the replication sites",
        "linkTarget": "#regions"
      }
    ]
  },
  {
    "_id": "section-consortium",
    "_type": "consortiumPage",
    "navigationLabel": "Consortium",
    "eyebrow": "A EUROPEAN PARTNERSHIP",
    "heading": "Different expertise.\nA shared ambition.",
    "intro": "Coordinated by NORSAR, the consortium connects disaster management authorities, research organisations, technology providers and practitioner networks across 12 countries.",
    "coordinatorLabel": "PROJECT COORDINATOR",
    "coordinatorName": "NORSAR",
    "coordinatorCountry": "Norway",
    "partners": [
      {
        "_key": "partner-0",
        "name": "City of Oslo",
        "country": "Norway"
      },
      {
        "_key": "partner-1",
        "name": "Norwegian Meteorological Institute",
        "country": "Norway"
      },
      {
        "_key": "partner-2",
        "name": "Capital Region Fire Department",
        "country": "Iceland"
      },
      {
        "_key": "partner-3",
        "name": "Icelandic Meteorological Office",
        "country": "Iceland"
      },
      {
        "_key": "partner-4",
        "name": "City of Stockholm",
        "country": "Sweden"
      },
      {
        "_key": "partner-5",
        "name": "Finnish Meteorological Institute",
        "country": "Finland"
      },
      {
        "_key": "partner-6",
        "name": "City of Lisbon",
        "country": "Portugal"
      },
      {
        "_key": "partner-7",
        "name": "Region of Attica",
        "country": "Greece"
      },
      {
        "_key": "partner-8",
        "name": "City of Brussels",
        "country": "Belgium"
      },
      {
        "_key": "partner-9",
        "name": "TENENET",
        "country": "Slovakia"
      },
      {
        "_key": "partner-10",
        "name": "Technovative Solutions",
        "country": "United Kingdom"
      },
      {
        "_key": "partner-11",
        "name": "Resilience Advisors",
        "country": "United Kingdom"
      },
      {
        "_key": "partner-12",
        "name": "European Emergency Number Association",
        "country": "Belgium"
      },
      {
        "_key": "partner-13",
        "name": "CODATA",
        "country": "France"
      },
      {
        "_key": "partner-14",
        "name": "University of Cambridge",
        "country": "United Kingdom"
      },
      {
        "_key": "partner-15",
        "name": "NTNU Social Research",
        "country": "Norway"
      },
      {
        "_key": "partner-16",
        "name": "INERIS Développement",
        "country": "France"
      },
      {
        "_key": "partner-17",
        "name": "University of Iceland",
        "country": "Iceland"
      },
      {
        "_key": "partner-18",
        "name": "National Delegation for Major Risks",
        "country": "Algeria"
      },
      {
        "_key": "partner-19",
        "name": "University of Porto",
        "country": "Portugal"
      },
      {
        "_key": "partner-20",
        "name": "Essex County Council",
        "country": "United Kingdom"
      },
      {
        "_key": "partner-21",
        "name": "Hovedstadens Beredskab",
        "country": "Denmark"
      }
    ]
  },
  {
    "_id": "section-news",
    "_type": "newsPage",
    "navigationLabel": "News & Events",
    "eyebrow": "NEWS & EVENTS",
    "heading": "Latest from RESILIACT.",
    "pageHeading": "News & Events",
    "eventsHeading": "Events calendar",
    "calendarButtonLabel": "Go to the events calendar",
    "newsHeading": "News",
    "blogHeading": "Blog Posts"
  },
  {
    "_id": "section-contact",
    "_type": "contactPage",
    "navigationLabel": "Contact",
    "eyebrow": "LET’S CONNECT",
    "heading": "Building resilience\ntakes collaboration.",
    "intro": "For project enquiries and opportunities to engage with RESILIACT, contact the coordinating organisation.",
    "organisation": "NORSAR",
    "role": "Project coordinator",
    "address": "Gunnar Randers vei 15\n2007 Kjeller, Norway",
    "websiteLabel": "Visit NORSAR",
    "websiteUrl": "https://www.norsar.no/",
    "projectLinkLabel": "RESILIACT on CORDIS",
    "projectLinkUrl": "https://cordis.europa.eu/project/id/101309693"
  }
]
