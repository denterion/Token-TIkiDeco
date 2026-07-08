import { projectFacts, transparencyCards } from "./projectFacts";

export type Locale = "en" | "es" | "ru";

export const locales: Array<{ code: Locale; label: string; aria: string }> = [
  { code: "en", label: "EN", aria: "Read the site in English" },
  { code: "es", label: "ES", aria: "Leer el sitio en espanol" },
  { code: "ru", label: "RU", aria: "Читать сайт на русском" }
];

export const defaultLocale: Locale = "en";

const englishStatusRows = [
  { key: "network", value: projectFacts.network },
  { key: "v02", value: "Public pre-release; RC evidence pending current main package" },
  { key: "campaign", value: "Draft-not-live" },
  { key: "tokenSupply", value: projectFacts.supply },
  { key: "mainnet", value: projectFacts.mainnetStatus },
  { key: "sale", value: projectFacts.saleStatus },
  { key: "monetaryValue", value: projectFacts.monetaryValue },
  { key: "audit", value: projectFacts.auditStatus }
] as const;

const spanishStatusRows = [
  { key: "network", value: projectFacts.network },
  { key: "v02", value: "Pre-release publica; evidencia RC pendiente del paquete main actual" },
  { key: "campaign", value: "Borrador, no live" },
  { key: "tokenSupply", value: projectFacts.supply },
  { key: "mainnet", value: "No desplegado" },
  { key: "sale", value: "No ofrecido" },
  { key: "monetaryValue", value: "Sin valor declarado" },
  { key: "audit", value: "Revision interna; auditoria independiente no iniciada" }
] as const;

const russianStatusRows = [
  { key: "network", value: projectFacts.network },
  { key: "v02", value: "Public pre-release; RC evidence pending current main package" },
  { key: "campaign", value: "Draft-not-live" },
  { key: "tokenSupply", value: projectFacts.supply },
  { key: "mainnet", value: "Не развернут" },
  { key: "sale", value: "Не предлагается" },
  { key: "monetaryValue", value: "Нет заявленной стоимости" },
  { key: "audit", value: "Внутренний review; независимый аудит не начат" }
] as const;

const primaryCards = transparencyCards.slice(0, 4);

export const copy = {
  en: {
    skip: "Skip to content",
    navAria: "Primary navigation",
    sectionsAria: "Page sections",
    homeAria: "TikiDeco home",
    nav: {
      overview: "Overview",
      status: "Status",
      pilot: "Pilot",
      audit: "Audit",
      feedback: "Feedback"
    },
    language: "Language",
    hero: {
      badge: "SEPOLIA TESTNET - NO MONETARY VALUE",
      eyebrow: "Public Sepolia prototype",
      title: "TikiDeco",
      subtitle: "Transparent hospitality-linked token infrastructure, currently limited to Sepolia review and read-only public verification.",
      badges: ["v0.2 Pre-Release", "Campaign Draft-Not-Live", "No Sale", "Not Independently Audited"],
      actionsAria: "Primary links",
      contracts: "Verify contracts",
      facts: "Project facts",
      repo: "Repository",
      note: "No sale, no stated monetary value, no mainnet deployment, and not independently audited.",
      guideTitle: "Start here",
      guideItems: ["Check current status", "Verify contracts", "Read limitations"]
    },
    status: {
      eyebrow: "Current Status",
      title: "Current status in one panel.",
      body: "TIDE is Sepolia-only public infrastructure. The v0.2 utility-pilot flow is a pre-release track, and the first campaign is draft-not-live.",
      labels: {
        network: "Network",
        chainId: "Chain ID",
        canonicalVersion: "Canonical version",
        v02: "v0.2 status",
        campaign: "Pilot campaign",
        tokenSupply: "Supply",
        mainnet: "Mainnet",
        sale: "Sale",
        monetaryValue: "Value",
        audit: "Audit"
      },
      helper: "Everything here is read-only and independently verifiable from public docs or Sepolia records."
    },
    transparency: {
      eyebrow: "Verify",
      title: "Four public entry points.",
      body: "Start with project facts, release control, roadmap, and GitHub feedback issues.",
      cards: primaryCards.map((card) => ({ ...card }))
    },
    audit: {
      eyebrow: "Review Boundary",
      title: "Prepared for review; independent audit not started.",
      body: "V1 is the legacy canonical Sepolia deployment. V2 is candidate review code and is not promoted by the canonical manifest.",
      readiness: [
        ["Internal review", "Repository material"],
        ["Independent audit", "Not started"],
        ["V2 contracts", "Candidate only"],
        ["Mainnet", "Not approved"]
      ]
    },
    footer: {
      title: "TikiDeco / TIDE",
      disclaimer:
        "TIDE is a Sepolia testnet prototype. It is not offered for sale, has no stated monetary value, is not deployed on mainnet, and has not completed an independent audit. Nothing on this site is financial, investment, legal or tax advice.",
      links: {
        repository: "Repository",
        officialPreview: "Official Preview",
        projectFacts: "Project Facts",
        releaseControl: "Release Control",
        roadmap: "Roadmap",
        securityPolicy: "Security Policy",
        claimsMatrix: "Claims Matrix",
        feedbackGuide: "Feedback Guide",
        issues: "Give Feedback",
        etherscanToken: "Etherscan Token",
        etherscanVault: "Etherscan Vault",
        noOffer: "No Offer Notice",
        riskDisclosure: "Risk Disclosure"
      }
    },
    statusRows: englishStatusRows
  },
  es: {
    skip: "Saltar al contenido",
    navAria: "Navegacion principal",
    sectionsAria: "Secciones de la pagina",
    homeAria: "Inicio de TikiDeco",
    nav: {
      overview: "Resumen",
      status: "Estado",
      pilot: "Piloto",
      audit: "Auditoria",
      feedback: "Feedback"
    },
    language: "Idioma",
    hero: {
      badge: "SEPOLIA TESTNET - SIN VALOR MONETARIO",
      eyebrow: "Prototipo publico en Sepolia",
      title: "TikiDeco",
      subtitle: "Infraestructura token transparente vinculada a hospitality, actualmente limitada a revision en Sepolia y verificacion publica solo lectura.",
      badges: ["v0.2 pre-release", "Campana no live", "Sin venta", "No auditado independientemente"],
      actionsAria: "Enlaces principales",
      contracts: "Verificar contratos",
      facts: "Hechos del proyecto",
      repo: "Repositorio",
      note: "Sin venta, sin valor declarado, sin mainnet y no auditado independientemente.",
      guideTitle: "Empieza aqui",
      guideItems: ["Revisa el estado", "Verifica contratos", "Lee limitaciones"]
    },
    status: {
      eyebrow: "Estado actual",
      title: "Estado actual en un panel.",
      body: "TIDE es infraestructura publica solo en Sepolia. El flujo v0.2 utility-pilot es pre-release y la primera campana no esta live.",
      labels: {
        network: "Red",
        chainId: "Chain ID",
        canonicalVersion: "Version canonica",
        v02: "Estado v0.2",
        campaign: "Campana piloto",
        tokenSupply: "Suministro",
        mainnet: "Mainnet",
        sale: "Venta",
        monetaryValue: "Valor",
        audit: "Auditoria"
      },
      helper: "Todo aqui es solo lectura y verificable desde docs publicos o registros de Sepolia."
    },
    transparency: {
      eyebrow: "Verificar",
      title: "Cuatro entradas publicas.",
      body: "Empieza con project facts, release control, roadmap y feedback issues.",
      cards: [
        { ...primaryCards[0], title: "Project facts", body: "Fuente de verdad para claims verificados, planeados y desconocidos." },
        { ...primaryCards[1], title: "Release control", body: "Muestra evidencia stale, blockers y proximas acciones." },
        { ...primaryCards[2], title: "Roadmap", body: "Separa public preview, pilot y preparacion de auditoria V2." },
        { ...primaryCards[3], title: "GitHub issues", body: "Feedback publico sin flujos de venta o transaccion." }
      ]
    },
    audit: {
      eyebrow: "Limite de revision",
      title: "Preparado para revision; auditoria independiente no iniciada.",
      body: "V1 es el despliegue canonico legacy en Sepolia. V2 es codigo candidato y no esta promovido por el manifest canonico.",
      readiness: [
        ["Revision interna", "Material del repositorio"],
        ["Auditoria independiente", "No iniciada"],
        ["Contratos V2", "Solo candidato"],
        ["Mainnet", "No aprobado"]
      ]
    },
    footer: {
      title: "TikiDeco / TIDE",
      disclaimer:
        "TIDE es un prototipo en Sepolia testnet. No se ofrece a la venta, no tiene valor monetario declarado, no esta desplegado en mainnet y no ha completado una auditoria independiente. Nada en este sitio es asesoramiento financiero, de inversion, legal o fiscal.",
      links: {
        repository: "Repositorio",
        officialPreview: "Preview oficial",
        projectFacts: "Hechos del proyecto",
        releaseControl: "Release Control",
        roadmap: "Roadmap",
        securityPolicy: "Politica de seguridad",
        claimsMatrix: "Claims Matrix",
        feedbackGuide: "Guia de feedback",
        issues: "Enviar feedback",
        etherscanToken: "Token en Etherscan",
        etherscanVault: "Vault en Etherscan",
        noOffer: "Aviso de no oferta",
        riskDisclosure: "Riesgos"
      }
    },
    statusRows: spanishStatusRows
  },
  ru: {
    skip: "Перейти к содержанию",
    navAria: "Основная навигация",
    sectionsAria: "Разделы страницы",
    homeAria: "Главная TikiDeco",
    nav: {
      overview: "Overview",
      status: "Статус",
      pilot: "Pilot",
      audit: "Audit",
      feedback: "Feedback"
    },
    language: "Язык",
    hero: {
      badge: "SEPOLIA TESTNET - БЕЗ ДЕНЕЖНОЙ СТОИМОСТИ",
      eyebrow: "Public Sepolia prototype",
      title: "TikiDeco",
      subtitle: "Transparent hospitality-linked token infrastructure, currently limited to Sepolia review and read-only public verification.",
      badges: ["v0.2 Pre-Release", "Campaign Draft-Not-Live", "No Sale", "Not Independently Audited"],
      actionsAria: "Основные ссылки",
      contracts: "Проверить контракты",
      facts: "Факты проекта",
      repo: "Репозиторий",
      note: "No sale, no stated monetary value, no mainnet deployment, and not independently audited.",
      guideTitle: "С чего начать",
      guideItems: ["Проверить статус", "Сверить контракты", "Прочитать ограничения"]
    },
    status: {
      eyebrow: "Текущий статус",
      title: "Current status in one panel.",
      body: "TIDE is Sepolia-only public infrastructure. The v0.2 utility-pilot flow is a pre-release track, and the first campaign is draft-not-live.",
      labels: {
        network: "Сеть",
        chainId: "Chain ID",
        canonicalVersion: "Каноническая версия",
        v02: "v0.2 status",
        campaign: "Pilot campaign",
        tokenSupply: "Supply",
        mainnet: "Mainnet",
        sale: "Продажа",
        monetaryValue: "Стоимость",
        audit: "Аудит"
      },
      helper: "Всё здесь read-only и проверяется через публичные документы или записи Sepolia."
    },
    transparency: {
      eyebrow: "Проверка",
      title: "Four public entry points.",
      body: "Start with project facts, release control, roadmap, and GitHub feedback issues.",
      cards: [
        { ...primaryCards[0], title: "Project facts", body: "Source of truth for verified, planned, and unknown claims." },
        { ...primaryCards[1], title: "Release control", body: "Shows stale evidence, blockers, and next actions." },
        { ...primaryCards[2], title: "Roadmap", body: "Separates public preview, pilot, and V2 audit preparation." },
        { ...primaryCards[3], title: "GitHub issues", body: "Public feedback without sale or transaction flows." }
      ]
    },
    audit: {
      eyebrow: "Граница review",
      title: "Готовится к проверке; независимый аудит не начат.",
      body: "V1 - legacy canonical deployment в Sepolia. V2 - candidate review code и не promoted в canonical manifest.",
      readiness: [
        ["Внутренний review", "Материалы репозитория"],
        ["Независимый аудит", "Не начат"],
        ["V2 contracts", "Только candidate"],
        ["Mainnet", "Не approved"]
      ]
    },
    footer: {
      title: "TikiDeco / TIDE",
      disclaimer:
        "TIDE - прототип в Sepolia testnet. Он не предлагается к продаже, не имеет заявленной денежной стоимости, не развернут в mainnet; independent audit not started. Ничто на сайте не является финансовой, инвестиционной, юридической или налоговой консультацией.",
      links: {
        repository: "Repository",
        officialPreview: "Official Preview",
        projectFacts: "Факты проекта",
        releaseControl: "Release Control",
        roadmap: "Roadmap",
        securityPolicy: "Security Policy",
        claimsMatrix: "Claims Matrix",
        feedbackGuide: "Feedback Guide",
        issues: "Give Feedback",
        etherscanToken: "Etherscan Token",
        etherscanVault: "Etherscan Vault",
        noOffer: "No Offer Notice",
        riskDisclosure: "Risk Disclosure"
      }
    },
    statusRows: russianStatusRows
  }
} as const;

export type SiteCopy = (typeof copy)[Locale];
