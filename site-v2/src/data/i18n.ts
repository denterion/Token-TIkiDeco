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
  { key: "tokenSupply", value: projectFacts.supply },
  { key: "mainnet", value: projectFacts.mainnetStatus },
  { key: "sale", value: projectFacts.saleStatus },
  { key: "monetaryValue", value: projectFacts.monetaryValue },
  { key: "audit", value: projectFacts.auditStatus }
] as const;

const spanishStatusRows = [
  { key: "network", value: projectFacts.network },
  { key: "tokenSupply", value: projectFacts.supply },
  { key: "mainnet", value: "No desplegado" },
  { key: "sale", value: "No ofrecido" },
  { key: "monetaryValue", value: "Sin valor declarado" },
  { key: "audit", value: "Revision interna; auditoria independiente no iniciada" }
] as const;

const russianStatusRows = [
  { key: "network", value: projectFacts.network },
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
      status: "Status",
      utility: "Utility",
      pilot: "Pilot",
      transparency: "Verify",
      audit: "Review",
      verify: "Docs",
      feedback: "Feedback"
    },
    language: "Language",
    hero: {
      badge: "SEPOLIA TESTNET - NO MONETARY VALUE",
      eyebrow: "Read-only public prototype",
      title: "TikiDeco",
      subtitle: "A Sepolia prototype exploring transparent token infrastructure for a future hospitality concept.",
      badges: ["Sepolia Prototype", "No Sale", "Independent Audit Not Started"],
      actionsAria: "Primary links",
      contracts: "Verify contracts",
      facts: "Project facts",
      repo: "Repository",
      note: "No wallet connection, no purchase flow, no price chart, and no mainnet deployment.",
      guideTitle: "Start here",
      guideItems: ["Check current status", "Verify contracts", "Read limitations"]
    },
    status: {
      eyebrow: "Current Status",
      title: "Prototype first. Claims stay limited.",
      body: "TIDE is public testnet infrastructure, not a sale, not a financial product, and not an active hospitality benefit.",
      labels: {
        network: "Network",
        chainId: "Chain ID",
        canonicalVersion: "Canonical version",
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
      title: "Four places to check the project.",
      body: "Start with the contracts, Safe control, public reports, and vesting documentation.",
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
        projectFacts: "Project Facts",
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
      status: "Estado",
      utility: "Utilidad",
      pilot: "Piloto",
      transparency: "Verificar",
      audit: "Revision",
      verify: "Docs",
      feedback: "Feedback"
    },
    language: "Idioma",
    hero: {
      badge: "SEPOLIA TESTNET - SIN VALOR MONETARIO",
      eyebrow: "Prototipo publico solo lectura",
      title: "TikiDeco",
      subtitle: "Un prototipo en Sepolia que explora infraestructura token transparente para un futuro concepto hospitality.",
      badges: ["Prototipo Sepolia", "Sin venta", "Auditoria independiente no iniciada"],
      actionsAria: "Enlaces principales",
      contracts: "Verificar contratos",
      facts: "Hechos del proyecto",
      repo: "Repositorio",
      note: "Sin conexion de wallet, sin compra, sin grafico de precio y sin despliegue en mainnet.",
      guideTitle: "Empieza aqui",
      guideItems: ["Revisa el estado", "Verifica contratos", "Lee limitaciones"]
    },
    status: {
      eyebrow: "Estado actual",
      title: "Primero prototipo. Claims limitados.",
      body: "TIDE es infraestructura publica de testnet, no una venta, no un producto financiero y no un beneficio hospitality activo.",
      labels: {
        network: "Red",
        chainId: "Chain ID",
        canonicalVersion: "Version canonica",
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
      title: "Cuatro lugares para revisar el proyecto.",
      body: "Empieza con contratos, control Safe, reportes publicos y documentacion de vesting.",
      cards: [
        { ...primaryCards[0], title: "Contratos verificados", body: "Fuente verificada en Sepolia desde el manifest canonico." },
        { ...primaryCards[1], title: "Control Safe", body: `Propiedad privilegiada V1 bajo Safe ${projectFacts.safeThreshold}.` },
        { ...primaryCards[2], title: "Reportes publicos", body: "Reportes del repositorio y hashes on-chain para revision." },
        { ...primaryCards[3], title: "Vesting", body: "Vault legacy y modelo V2 candidato documentados por separado." }
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
        projectFacts: "Hechos del proyecto",
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
      status: "Статус",
      utility: "Utility",
      pilot: "Pilot",
      transparency: "Проверка",
      audit: "Ревью",
      verify: "Документы",
      feedback: "Feedback"
    },
    language: "Язык",
    hero: {
      badge: "SEPOLIA TESTNET - БЕЗ ДЕНЕЖНОЙ СТОИМОСТИ",
      eyebrow: "Публичный read-only прототип",
      title: "TikiDeco",
      subtitle: "Прототип в Sepolia, который исследует прозрачную token-инфраструктуру для будущей hospitality-концепции.",
      badges: ["Прототип Sepolia", "Без продажи", "Независимый аудит не начат"],
      actionsAria: "Основные ссылки",
      contracts: "Проверить контракты",
      facts: "Факты проекта",
      repo: "Репозиторий",
      note: "Без подключения кошелька, без покупки, без графика цены и без mainnet deployment.",
      guideTitle: "С чего начать",
      guideItems: ["Проверить статус", "Сверить контракты", "Прочитать ограничения"]
    },
    status: {
      eyebrow: "Текущий статус",
      title: "Сначала прототип. Публичные утверждения ограничены.",
      body: "TIDE - публичная testnet-инфраструктура, не продажа, не финансовый продукт и не активная hospitality-выгода.",
      labels: {
        network: "Сеть",
        chainId: "Chain ID",
        canonicalVersion: "Каноническая версия",
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
      title: "Четыре точки проверки проекта.",
      body: "Начни с контрактов, Safe control, публичных отчетов и vesting-документации.",
      cards: [
        { ...primaryCards[0], title: "Контракты", body: "Verified source в Sepolia из canonical manifest." },
        { ...primaryCards[1], title: "Safe control", body: `Привилегированное владение V1 через Safe ${projectFacts.safeThreshold}.` },
        { ...primaryCards[2], title: "Публичные отчеты", body: "Repository reports и on-chain hashes для проверки." },
        { ...primaryCards[3], title: "Vesting", body: "Legacy vault и candidate V2 model описаны отдельно." }
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
        projectFacts: "Факты проекта",
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
