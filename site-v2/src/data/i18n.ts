import { projectFacts, transparencyCards } from "./projectFacts";

export type Locale = "en" | "es" | "ru";

export const locales: Array<{ code: Locale; label: string; aria: string }> = [
  { code: "en", label: "EN", aria: "Read the site in English" },
  { code: "es", label: "ES", aria: "Leer el sitio en espanol" },
  { code: "ru", label: "RU", aria: "Читать сайт на русском" }
];

export const defaultLocale: Locale = "en";

const sharedStatusRows = [
  { key: "network", value: projectFacts.network },
  { key: "chainId", value: String(projectFacts.chainId) },
  { key: "canonicalVersion", value: projectFacts.canonicalVersion },
  { key: "tokenSupply", value: projectFacts.supply },
  { key: "mainnet", value: projectFacts.mainnetStatus },
  { key: "sale", value: projectFacts.saleStatus },
  { key: "monetaryValue", value: projectFacts.monetaryValue },
  { key: "audit", value: projectFacts.auditStatus }
] as const;

export const copy = {
  en: {
    skip: "Skip to content",
    navAria: "Primary navigation",
    sectionsAria: "Page sections",
    homeAria: "TikiDeco home",
    nav: {
      status: "Status",
      transparency: "Transparency",
      audit: "Audit readiness",
      verify: "Verify"
    },
    language: "Language",
    hero: {
      badge: "SEPOLIA TESTNET · NO MONETARY VALUE",
      eyebrow: "Miami-inspired transparency layer",
      title: "TikiDeco",
      subtitle: "A Sepolia prototype for transparent hospitality-linked token infrastructure.",
      badges: ["Sepolia Prototype", "Fixed Supply", "Read-Only Dashboard", "Internal Review", "Independent Audit Not Started"],
      actionsAria: "Primary links",
      contracts: "View Contracts",
      facts: "Read Project Facts",
      repo: "Open Repository",
      note: "Read-only public site. No sale flow, no wallet connection, no price chart, and no mainnet deployment.",
      guideTitle: "Start here",
      guideItems: ["Check what exists today", "Verify addresses on Sepolia", "Read the limits before sharing"]
    },
    status: {
      eyebrow: "Project Status",
      title: "Current boundaries, shown before the visual story.",
      body: "TIDE is an open-source Ethereum Sepolia testnet prototype. It is not offered for sale and has no stated monetary value.",
      labels: {
        network: "Network",
        chainId: "Chain ID",
        canonicalVersion: "Canonical version",
        tokenSupply: "Token supply",
        mainnet: "Mainnet",
        sale: "Sale",
        monetaryValue: "Monetary value",
        audit: "Audit"
      },
      helper: "For newcomers: this page is for checking public facts, not for buying or connecting a wallet."
    },
    transparency: {
      eyebrow: "Transparency",
      title: "Public verification surfaces, not transaction flows.",
      body: "The site points viewers to contracts, Safe control, report hashes, claims rules, and security documentation without connecting a wallet.",
      cards: transparencyCards.map((card) => ({ ...card }))
    },
    architecture: {
      eyebrow: "Architecture",
      title: "A read-only path from public viewer to Sepolia records.",
      body: "The interface is designed for observation. It does not request signatures and does not submit transactions.",
      aria: "Read-only architecture flow",
      nodes: ["User / Public Viewer", "Read-only Website", "Sepolia RPC", "Token Contract", "Vesting Vault", "Safe", "Public Reports"]
    },
    audit: {
      eyebrow: "Audit Readiness",
      title: "Prepared for review, not represented as completed review.",
      body: "Internal review is repository-maintained material. It is not an independent audit and does not approve the prototype for public operations.",
      readiness: [
        ["Internal review", "Available as repository material"],
        ["Independent audit", "Not started"],
        ["V2 contracts", "Candidate review code"],
        ["V1", "Legacy canonical Sepolia deployment"],
        ["Known limitations", "Published"],
        ["Public claims", "Restricted by claims matrix"]
      ]
    },
    beach: {
      eyebrow: "Digital Tide",
      title: "Hospitality, access, loyalty, and public verification as a research direction.",
      body: "The visual language is concept visualization, not a completed property or active hospitality benefit. TIDE explores how public records could support transparent future programs."
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
        etherscanToken: "Etherscan Token",
        etherscanVault: "Etherscan Vault",
        noOffer: "No Offer Notice",
        riskDisclosure: "Risk Disclosure"
      }
    },
    statusRows: sharedStatusRows
  },
  es: {
    skip: "Saltar al contenido",
    navAria: "Navegacion principal",
    sectionsAria: "Secciones de la pagina",
    homeAria: "Inicio de TikiDeco",
    nav: {
      status: "Estado",
      transparency: "Transparencia",
      audit: "Revision",
      verify: "Verificar"
    },
    language: "Idioma",
    hero: {
      badge: "SEPOLIA TESTNET · SIN VALOR MONETARIO",
      eyebrow: "Capa de transparencia inspirada en Miami",
      title: "TikiDeco",
      subtitle: "Un prototipo en Sepolia para infraestructura transparente vinculada a hospitality.",
      badges: ["Prototipo Sepolia", "Suministro fijo", "Panel solo lectura", "Revision interna", "Auditoria independiente no iniciada"],
      actionsAria: "Enlaces principales",
      contracts: "Ver contratos",
      facts: "Leer hechos del proyecto",
      repo: "Abrir repositorio",
      note: "Sitio publico solo lectura. Sin venta, sin conexion de wallet, sin grafico de precio y sin despliegue en mainnet.",
      guideTitle: "Empieza aqui",
      guideItems: ["Verifica lo que existe hoy", "Comprueba direcciones en Sepolia", "Lee los limites antes de compartir"]
    },
    status: {
      eyebrow: "Estado del proyecto",
      title: "Limites actuales antes de la historia visual.",
      body: "TIDE es un prototipo open-source en Ethereum Sepolia. No se ofrece a la venta y no tiene valor monetario declarado.",
      labels: {
        network: "Red",
        chainId: "Chain ID",
        canonicalVersion: "Version canonica",
        tokenSupply: "Suministro",
        mainnet: "Mainnet",
        sale: "Venta",
        monetaryValue: "Valor monetario",
        audit: "Auditoria"
      },
      helper: "Para nuevos usuarios: esta pagina sirve para comprobar hechos publicos, no para comprar ni conectar una wallet."
    },
    transparency: {
      eyebrow: "Transparencia",
      title: "Superficies de verificacion publica, no flujos de transaccion.",
      body: "El sitio guia a contratos, control Safe, hashes de reportes, reglas de comunicacion y documentacion de seguridad sin conectar una wallet.",
      cards: [
        { ...transparencyCards[0], title: "Verificacion de contratos", body: "Las paginas de fuente verificada en Sepolia estan enlazadas desde el manifest canonico." },
        { ...transparencyCards[1], title: "Control Safe multisig", body: `La propiedad privilegiada V1 esta documentada bajo control Safe ${projectFacts.safeThreshold}.` },
        { ...transparencyCards[2], title: "Hashes de reportes publicos", body: "Los reportes del repositorio y los hashes on-chain se enlazan para revision publica." },
        { ...transparencyCards[3], title: "Transparencia de vesting", body: "La direccion legacy del vault y el modelo candidato V2 se documentan por separado." },
        { ...transparencyCards[4], title: "Matriz de claims", body: "La comunicacion publica se limita por hechos verificados y reglas de claims prohibidos." },
        { ...transparencyCards[5], title: "Politica de seguridad", body: "La divulgacion responsable y los materiales de revision interna estan publicados." }
      ]
    },
    architecture: {
      eyebrow: "Arquitectura",
      title: "Una ruta solo lectura desde el publico hasta registros en Sepolia.",
      body: "La interfaz esta disenada para observacion. No solicita firmas y no envia transacciones.",
      aria: "Flujo de arquitectura solo lectura",
      nodes: ["Usuario / publico", "Sitio solo lectura", "RPC Sepolia", "Contrato token", "Vesting vault", "Safe", "Reportes publicos"]
    },
    audit: {
      eyebrow: "Preparacion para revision",
      title: "Preparado para revision, no presentado como revision completada.",
      body: "La revision interna es material mantenido en el repositorio. No es una auditoria independiente y no aprueba el prototipo para operaciones publicas.",
      readiness: [
        ["Revision interna", "Disponible como material del repositorio"],
        ["Auditoria independiente", "No iniciada"],
        ["Contratos V2", "Codigo candidato para revision"],
        ["V1", "Despliegue canonico legacy en Sepolia"],
        ["Limitaciones conocidas", "Publicadas"],
        ["Claims publicos", "Limitados por la claims matrix"]
      ]
    },
    beach: {
      eyebrow: "Digital Tide",
      title: "Hospitality, acceso, lealtad y verificacion publica como direccion de investigacion.",
      body: "El lenguaje visual es una visualizacion conceptual, no una propiedad terminada ni un beneficio hospitality activo. TIDE explora como registros publicos podrian apoyar futuros programas transparentes."
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
        etherscanToken: "Token en Etherscan",
        etherscanVault: "Vault en Etherscan",
        noOffer: "Aviso de no oferta",
        riskDisclosure: "Riesgos"
      }
    },
    statusRows: sharedStatusRows
  },
  ru: {
    skip: "Перейти к содержанию",
    navAria: "Основная навигация",
    sectionsAria: "Разделы страницы",
    homeAria: "Главная TikiDeco",
    nav: {
      status: "Статус",
      transparency: "Прозрачность",
      audit: "Проверка",
      verify: "Верификация"
    },
    language: "Язык",
    hero: {
      badge: "SEPOLIA TESTNET · БЕЗ ДЕНЕЖНОЙ СТОИМОСТИ",
      eyebrow: "Прозрачность в стиле Miami hospitality",
      title: "TikiDeco",
      subtitle: "Прототип в Sepolia для прозрачной token-инфраструктуры, связанной с hospitality.",
      badges: ["Прототип Sepolia", "Фиксированный supply", "Read-only dashboard", "Внутренний review", "Независимый аудит не начат"],
      actionsAria: "Основные ссылки",
      contracts: "Проверить контракты",
      facts: "Факты проекта",
      repo: "Открыть GitHub",
      note: "Публичный read-only сайт. Без продажи, без подключения кошелька, без графика цены и без mainnet deployment.",
      guideTitle: "С чего начать",
      guideItems: ["Посмотри, что уже существует", "Сверь адреса в Sepolia", "Прочитай ограничения перед публикацией"]
    },
    status: {
      eyebrow: "Статус проекта",
      title: "Сначала границы проекта, потом визуальная история.",
      body: "TIDE — open-source прототип в Ethereum Sepolia. Токен не предлагается к продаже и не имеет заявленной денежной стоимости.",
      labels: {
        network: "Сеть",
        chainId: "Chain ID",
        canonicalVersion: "Каноническая версия",
        tokenSupply: "Supply токена",
        mainnet: "Mainnet",
        sale: "Продажа",
        monetaryValue: "Денежная стоимость",
        audit: "Аудит"
      },
      helper: "Для новых пользователей: эта страница помогает проверять публичные факты, а не покупать токен или подключать кошелёк."
    },
    transparency: {
      eyebrow: "Прозрачность",
      title: "Публичная проверка без транзакций.",
      body: "Сайт ведёт к контрактам, Safe control, report hashes, claims rules и security-документации без подключения кошелька.",
      cards: [
        { ...transparencyCards[0], title: "Верификация контрактов", body: "Ссылки на verified source в Sepolia берутся из canonical manifest." },
        { ...transparencyCards[1], title: "Safe multisig control", body: `Привилегированное владение V1 описано как контроль Safe ${projectFacts.safeThreshold}.` },
        { ...transparencyCards[2], title: "Публичные report hashes", body: "Отчёты в репозитории и on-chain hashes связаны для публичной проверки." },
        { ...transparencyCards[3], title: "Vesting transparency", body: "Legacy vault address и candidate V2 vesting model документируются отдельно." },
        { ...transparencyCards[4], title: "Claims matrix", body: "Публичные формулировки ограничены проверенными фактами и запрещёнными claims." },
        { ...transparencyCards[5], title: "Security policy", body: "Responsible disclosure и материалы internal review опубликованы." }
      ]
    },
    architecture: {
      eyebrow: "Архитектура",
      title: "Read-only путь от пользователя к Sepolia records.",
      body: "Интерфейс создан для наблюдения. Он не запрашивает подписи и не отправляет транзакции.",
      aria: "Read-only архитектурный поток",
      nodes: ["Пользователь", "Read-only сайт", "Sepolia RPC", "Token contract", "Vesting vault", "Safe", "Public reports"]
    },
    audit: {
      eyebrow: "Готовность к review",
      title: "Подготовлено для проверки, но не представлено как завершённый аудит.",
      body: "Internal review — это материалы репозитория. Это не независимый аудит и не утверждает прототип для публичных операций.",
      readiness: [
        ["Internal review", "Доступен как материал репозитория"],
        ["Независимый аудит", "Не начат"],
        ["V2 contracts", "Candidate review code"],
        ["V1", "Legacy canonical Sepolia deployment"],
        ["Known limitations", "Опубликованы"],
        ["Public claims", "Ограничены claims matrix"]
      ]
    },
    beach: {
      eyebrow: "Digital Tide",
      title: "Hospitality, access, loyalty и public verification как направление исследования.",
      body: "Визуальный стиль — concept visualization, а не завершённый объект и не активная hospitality-выгода. TIDE исследует, как публичные записи могут поддерживать прозрачные будущие программы."
    },
    footer: {
      title: "TikiDeco / TIDE",
      disclaimer:
        "TIDE — прототип в Sepolia testnet. Он не предлагается к продаже, не имеет заявленной денежной стоимости, не развёрнут в mainnet и не проходил независимый аудит. Ничто на этом сайте не является финансовой, инвестиционной, юридической или налоговой консультацией.",
      links: {
        repository: "Repository",
        projectFacts: "Факты проекта",
        securityPolicy: "Security Policy",
        claimsMatrix: "Claims Matrix",
        etherscanToken: "Etherscan Token",
        etherscanVault: "Etherscan Vault",
        noOffer: "No Offer Notice",
        riskDisclosure: "Risk Disclosure"
      }
    },
    statusRows: sharedStatusRows
  }
} as const;

export type SiteCopy = (typeof copy)[Locale];
