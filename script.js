const toast = document.getElementById("toast");
const copyWallet = document.getElementById("copyWallet");
const searchInput = document.getElementById("searchInput");
const app = document.querySelector(".app");
const scrollLayer = document.getElementById("scrollLayer");
const assetList = document.getElementById("assetList");
const filterSheet = document.getElementById("filterSheet");
const filterList = document.getElementById("filterList");
const filterScrim = document.getElementById("filterScrim");
const filterDone = document.getElementById("filterDone");
const settingsSheet = document.getElementById("settingsSheet");
const settingsScrim = document.getElementById("settingsScrim");
const settingsDone = document.getElementById("settingsDone");
const settingsWallets = document.getElementById("settingsWallets");
const settingsWalletName = document.getElementById("settingsWalletName");
const settingsAssets = document.getElementById("settingsAssets");
const settingsBalances = document.getElementById("settingsBalances");
const settingsAddresses = document.getElementById("settingsAddresses");
const settingsRandomAddresses = document.getElementById("settingsRandomAddresses");
const notificationButton = document.getElementById("notificationButton");
const notificationStatus = document.getElementById("notificationStatus");
const receiveSheet = document.getElementById("receiveSheet");
const receiveScrim = document.getElementById("receiveScrim");
const receiveClose = document.getElementById("receiveClose");
const receiveSearch = document.getElementById("receiveSearch");
const receiveTabs = document.getElementById("receiveTabs");
const receiveList = document.getElementById("receiveList");
const balanceTotal = document.querySelector(".balance-block h1");
const balanceChange = document.querySelector(".balance-block p");
const walletPillName = document.querySelector(".wallet-pill span");
const promoCard = document.querySelector(".promo-card");
const promoPager = document.getElementById("promoPager");
const pullRefreshBars = [...document.querySelectorAll(".pull-refresh__bar")];
const API_BASE_URL = (window.ATRUST_API_BASE_URL || "").replace(/\/$/, "");

function apiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

function tokenIcon(tokenPath, networkPath = "", networkKey = "") {
  return `
    <span class="token-stack">
      <img class="token-stack__main" src="${tokenPath}" alt="" />
      ${networkPath ? `<span class="token-stack__badge ${networkKey ? `token-stack__badge--${networkKey}` : ""}"><img src="${networkPath}" alt="" /></span>` : ""}
    </span>
  `;
}

function getCoinKey(coin) {
  return coin.key || coin.symbol;
}

const coinCatalog = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    geckoId: "bitcoin",
    icon: tokenIcon("./coins/btc.png"),
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    geckoId: "ethereum",
    icon: tokenIcon("./coins/ethereum.png"),
  },
  {
    symbol: "TRX",
    name: "Tron",
    geckoId: "tron",
    icon: tokenIcon("./coins/tron.png"),
  },
  {
    symbol: "SOL",
    name: "Solana",
    geckoId: "solana",
    icon: tokenIcon("./coins/solana.png"),
  },
  {
    symbol: "BNB",
    name: "BNB Smart Chain",
    geckoId: "binancecoin",
    icon: tokenIcon("./coins/bnb.png"),
  },
  {
    symbol: "ARB",
    name: "Arbitrum",
    geckoId: "arbitrum",
    icon: tokenIcon("./coins/arbitrum.png"),
  },
  {
    symbol: "BASE",
    name: "Base",
    geckoId: "base-protocol",
    icon: tokenIcon("./coins/base.png"),
  },
  {
    symbol: "TWT",
    name: "Trust Wallet",
    geckoId: "trust-wallet-token",
    icon: tokenIcon("./coins/twt.png"),
  },
  {
    symbol: "XRP",
    name: "XRP",
    geckoId: "ripple",
    icon: tokenIcon("./coins/xrp.png"),
  },
  {
    symbol: "ALGO",
    name: "Algorand",
    geckoId: "algorand",
    icon: tokenIcon("./coins/algo.png"),
  },
  {
    symbol: "BCH",
    name: "Bitcoin Cash",
    geckoId: "bitcoin-cash",
    icon: tokenIcon("./coins/bch.png"),
  },
  {
    key: "USDT_ETH",
    symbol: "USDT",
    name: "Ethereum",
    geckoId: "tether",
    icon: tokenIcon("./coins/usdt.png", "./coins/ethereum.png", "eth"),
  },
  {
    key: "USDT_TRX",
    symbol: "USDT",
    name: "Tron",
    geckoId: "tether",
    icon: tokenIcon("./coins/usdt.png", "./coins/tron.png", "trx"),
  },
  {
    key: "USDT_BNB",
    symbol: "USDT",
    name: "BNB Smart Chain",
    geckoId: "tether",
    icon: tokenIcon("./coins/usdt.png", "./coins/bnb.png", "bnb"),
  },
  {
    key: "USDT_SOL",
    symbol: "USDT",
    name: "Solana",
    geckoId: "tether",
    icon: tokenIcon("./coins/usdt.png", "./coins/solana.png", "sol"),
  },
  {
    key: "USDT_ARB",
    symbol: "USDT",
    name: "Arbitrum",
    geckoId: "tether",
    icon: tokenIcon("./coins/usdt.png", "./coins/arbitrum.png", "arb"),
  },
  {
    key: "USDT_BASE",
    symbol: "USDT",
    name: "Base",
    geckoId: "tether",
    icon: tokenIcon("./coins/usdt.png", "./coins/base.png", "base"),
  },
  {
    key: "USDC_ETH",
    symbol: "USDC",
    name: "Ethereum",
    geckoId: "usd-coin",
    icon: tokenIcon("./coins/usdc.png", "./coins/ethereum.png", "eth"),
  },
  {
    key: "USDC_BNB",
    symbol: "USDC",
    name: "BNB Smart Chain",
    geckoId: "usd-coin",
    icon: tokenIcon("./coins/usdc.png", "./coins/bnb.png", "bnb"),
  },
  {
    key: "USDC_SOL",
    symbol: "USDC",
    name: "Solana",
    geckoId: "usd-coin",
    icon: tokenIcon("./coins/usdc.png", "./coins/solana.png", "sol"),
  },
  {
    key: "USDC_ARB",
    symbol: "USDC",
    name: "Arbitrum",
    geckoId: "usd-coin",
    icon: tokenIcon("./coins/usdc.png", "./coins/arbitrum.png", "arb"),
  },
  {
    key: "USDC_BASE",
    symbol: "USDC",
    name: "Base",
    geckoId: "usd-coin",
    icon: tokenIcon("./coins/usdc.png", "./coins/base.png", "base"),
  },
  {
    symbol: "TON",
    name: "Toncoin",
    geckoId: "the-open-network",
    icon: tokenIcon("./coins/ton.png"),
  },
  {
    symbol: "LTC",
    name: "Litecoin",
    geckoId: "litecoin",
    icon: tokenIcon("./coins/ltc.png"),
  },
];

const coinByKey = new Map(coinCatalog.map((coin) => [getCoinKey(coin), coin]));
const addressKeyAliases = {
  BNB: "ETH",
  ARB: "ETH",
  BASE: "ETH",
  TWT: "ETH",
  USDT_ETH: "ETH",
  USDC_ETH: "ETH",
  USDT_TRX: "TRX",
  USDT_BNB: "ETH",
  USDC_BNB: "ETH",
  USDT_SOL: "SOL",
  USDC_SOL: "SOL",
  USDT_ARB: "ETH",
  USDC_ARB: "ETH",
  USDT_BASE: "ETH",
  USDC_BASE: "ETH",
};
const defaultSelectedSymbols = ["BTC", "TRX"];
let selectedSymbols = new Set(defaultSelectedSymbols);
const prices = {};
let balances = {};
const receiveTabsData = [
  { key: "ALL", label: "All" },
  { key: "BTC", icon: "./coins/btc.png" },
  { key: "ETH", icon: "./coins/ethereum.png" },
  { key: "SOL", icon: "./coins/solana.png" },
  { key: "BNB", icon: "./coins/bnb.png" },
  { key: "TRX", icon: "./coins/tron.png" },
  { key: "ARB", icon: "./coins/arbitrum.png" },
  { key: "BASE", icon: "./coins/base.png" },
];
const receiveAssets = [
  {
    section: "Popular",
    filter: "BTC",
    symbol: "BTC",
    name: "Bitcoin",
    addressKey: "BTC",
    address: "bc1qann0TrustWalletDemoAddressvaw24pr",
    displayAddress: "bc1qann...vaw24pr",
    icon: tokenIcon("./coins/btc.png"),
  },
  {
    section: "Popular",
    filter: "ETH",
    symbol: "ETH",
    name: "Ethereum",
    addressKey: "ETH",
    address: "0xe24690000000000000000000000000006c81935",
    displayAddress: "0xe2469...6c81935",
    icon: tokenIcon("./coins/ethereum.png"),
  },
  {
    section: "Popular",
    filter: "SOL",
    symbol: "SOL",
    name: "Solana",
    addressKey: "SOL",
    address: "Hjodm6QTrustWalletDemoSolanaAddresssS8zTLH",
    displayAddress: "Hjodm6Q...sS8zTLH",
    icon: tokenIcon("./coins/solana.png"),
  },
  {
    section: "Popular",
    filter: "BNB",
    symbol: "TWT",
    name: "BNB Smart Chain",
    addressKey: "TWT",
    address: "0xe24690000000000000000000000000006c81935",
    displayAddress: "0xe2469...6c81935",
    icon: tokenIcon("./coins/twt.png", "./coins/bnb.png", "bnb"),
  },
  {
    section: "Popular",
    filter: "BNB",
    symbol: "BNB",
    name: "BNB Smart Chain",
    addressKey: "BNB",
    address: "0xe24690000000000000000000000000006c81935",
    displayAddress: "0xe2469...6c81935",
    icon: tokenIcon("./coins/bnb.png"),
  },
  {
    section: "Popular",
    filter: "ETH",
    symbol: "USDT",
    name: "Ethereum",
    addressKey: "USDT_ETH",
    address: "0xe24690000000000000000000000000006c81935",
    displayAddress: "0xe2469...6c81935",
    icon: tokenIcon("./coins/usdt.png", "./coins/ethereum.png", "eth"),
  },
  {
    section: "Popular",
    filter: "ETH",
    symbol: "USDC",
    name: "Ethereum",
    addressKey: "USDC_ETH",
    address: "0xe24690000000000000000000000000006c81935",
    displayAddress: "0xe2469...6c81935",
    icon: tokenIcon("./coins/usdc.png", "./coins/ethereum.png", "eth"),
  },
  {
    section: "All crypto",
    filter: "TRX",
    symbol: "TRX",
    name: "Tron",
    addressKey: "TRX",
    address: "TJe2x9JTrustWalletDemoAddressxtoXm5Zx",
    displayAddress: "TJe2x9J...toXm5Zx",
    icon: tokenIcon("./coins/tron.png"),
  },
  {
    section: "All crypto",
    filter: "TRX",
    symbol: "USDT",
    name: "TRC20",
    addressKey: "USDT_TRX",
    address: "TJe2x9JTrustWalletDemoAddressxtoXm5Zx",
    displayAddress: "TJe2x9J...toXm5Zx",
    icon: tokenIcon("./coins/usdt.png", "./coins/tron.png", "trx"),
  },
  {
    section: "All crypto",
    filter: "ALGO",
    symbol: "ALGO",
    name: "Algorand",
    addressKey: "ALGO",
    address: "ALGOTRUSTWALLETDEMOADDRESS00000000000000000000000000",
    displayAddress: "ALGOTRU...0000000",
    icon: tokenIcon("./coins/algo.png"),
  },
  {
    section: "All crypto",
    filter: "BCH",
    symbol: "BCH",
    name: "Bitcoin Cash",
    addressKey: "BCH",
    address: "bitcoincash:qtrustwalletdemobitcoincashaddress0000000",
    displayAddress: "bitcoi...0000000",
    icon: tokenIcon("./coins/bch.png"),
  },
  {
    section: "All crypto",
    filter: "XRP",
    symbol: "XRP",
    name: "XRP",
    addressKey: "XRP",
    address: "rTrustWalletDemoXrpAddressTag",
    displayAddress: "rTrust...Tag",
    icon: tokenIcon("./coins/xrp.png"),
  },
  {
    section: "All crypto",
    filter: "LTC",
    symbol: "LTC",
    name: "Litecoin",
    addressKey: "LTC",
    address: "ltc1qtrustwalletdemolitecoinaddress0000000000000",
    displayAddress: "ltc1qtr...0000000",
    icon: tokenIcon("./coins/ltc.png"),
  },
  {
    section: "All crypto",
    filter: "TON",
    symbol: "TON",
    name: "Toncoin",
    addressKey: "TON",
    address: "UQTrustWalletDemoTonAddress000000000000000000000000",
    displayAddress: "UQTrust...0000000",
    icon: tokenIcon("./coins/ton.png"),
  },
  {
    section: "All crypto",
    filter: "ARB",
    symbol: "ARB",
    name: "Arbitrum",
    addressKey: "ARB",
    address: "0xe24690000000000000000000000000006c81935",
    displayAddress: "0xe2469...6c81935",
    icon: tokenIcon("./coins/arbitrum.png"),
  },
  {
    section: "All crypto",
    filter: "BNB",
    symbol: "USDT",
    name: "BNB Smart Chain",
    addressKey: "USDT_BNB",
    address: "0xe24690000000000000000000000000006c81935",
    displayAddress: "0xe2469...6c81935",
    icon: tokenIcon("./coins/usdt.png", "./coins/bnb.png", "bnb"),
  },
  {
    section: "All crypto",
    filter: "SOL",
    symbol: "USDT",
    name: "Solana",
    addressKey: "USDT_SOL",
    address: "Hjodm6QTrustWalletDemoSolanaAddresssS8zTLH",
    displayAddress: "Hjodm6Q...sS8zTLH",
    icon: tokenIcon("./coins/usdt.png", "./coins/solana.png", "sol"),
  },
  {
    section: "All crypto",
    filter: "ARB",
    symbol: "USDT",
    name: "Arbitrum",
    addressKey: "USDT_ARB",
    address: "0xe24690000000000000000000000000006c81935",
    displayAddress: "0xe2469...6c81935",
    icon: tokenIcon("./coins/usdt.png", "./coins/arbitrum.png", "arb"),
  },
  {
    section: "All crypto",
    filter: "BASE",
    symbol: "USDT",
    name: "Base",
    addressKey: "USDT_BASE",
    address: "0xe24690000000000000000000000000006c81935",
    displayAddress: "0xe2469...6c81935",
    icon: tokenIcon("./coins/usdt.png", "./coins/base.png", "base"),
  },
  {
    section: "All crypto",
    filter: "BNB",
    symbol: "USDC",
    name: "BNB Smart Chain",
    addressKey: "USDC_BNB",
    address: "0xe24690000000000000000000000000006c81935",
    displayAddress: "0xe2469...6c81935",
    icon: tokenIcon("./coins/usdc.png", "./coins/bnb.png", "bnb"),
  },
  {
    section: "All crypto",
    filter: "SOL",
    symbol: "USDC",
    name: "Solana",
    addressKey: "USDC_SOL",
    address: "Hjodm6QTrustWalletDemoSolanaAddresssS8zTLH",
    displayAddress: "Hjodm6Q...sS8zTLH",
    icon: tokenIcon("./coins/usdc.png", "./coins/solana.png", "sol"),
  },
  {
    section: "All crypto",
    filter: "ARB",
    symbol: "USDC",
    name: "Arbitrum",
    addressKey: "USDC_ARB",
    address: "0xe24690000000000000000000000000006c81935",
    displayAddress: "0xe2469...6c81935",
    icon: tokenIcon("./coins/usdc.png", "./coins/arbitrum.png", "arb"),
  },
  {
    section: "All crypto",
    filter: "BASE",
    symbol: "USDC",
    name: "Base",
    addressKey: "USDC_BASE",
    address: "0xe24690000000000000000000000000006c81935",
    displayAddress: "0xe2469...6c81935",
    icon: tokenIcon("./coins/usdc.png", "./coins/base.png", "base"),
  },
];

let walletProfiles = loadWalletProfiles();
let activeProfileId = loadActiveProfileId();
activateProfile(activeProfileId, { save: false });
saveWalletProfiles();

let toastTimer;
let pullStartY = 0;
let pullOffset = 0;
let isPulling = false;
let isRefreshing = false;
let loaderSpinStep = 0;
let loaderSpinTimer;
let activeReceiveFilter = "ALL";
let pushSyncTimer;
const receiveCopyTimers = new WeakMap();

const pullThreshold = 90;
const pullMax = 140;
let activePromoSlide = 0;

function randomFrom(chars, length) {
  let value = "";
  const cryptoObject = window.crypto || window.msCrypto;
  const bytes = new Uint8Array(length);
  if (cryptoObject?.getRandomValues) {
    cryptoObject.getRandomValues(bytes);
  } else {
    for (let index = 0; index < length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }

  for (const byte of bytes) {
    value += chars[byte % chars.length];
  }
  return value;
}

function getAddressType(coinKey) {
  const coin = coinByKey.get(coinKey);
  const name = coin?.name || "";

  if (coinKey === "BTC") return "btc";
  if (coinKey === "SOL" || name === "Solana") return "sol";
  if (coinKey === "TRX" || name === "Tron" || coinKey.endsWith("_TRX")) return "trx";
  if (coinKey === "XRP") return "xrp";
  if (coinKey === "ALGO") return "algo";
  if (coinKey === "BCH") return "bch";
  if (coinKey === "TON") return "ton";
  if (coinKey === "LTC") return "ltc";
  return "evm";
}

function generateAddress(coinKey) {
  const type = getAddressType(coinKey);

  if (type === "btc") return `bc1q${randomFrom("023456789acdefghjklmnpqrstuvwxyz", 38)}`;
  if (type === "trx") return `T${randomFrom("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz", 33)}`;
  if (type === "sol") return randomFrom("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz", 44);
  if (type === "xrp") return `r${randomFrom("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz", 33)}`;
  if (type === "algo") return randomFrom("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567", 58);
  if (type === "bch") return `bitcoincash:q${randomFrom("qpzry9x8gf2tvdw0s3jn54khce6mua7l", 41)}`;
  if (type === "ton") return `UQ${randomFrom("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-", 46)}`;
  if (type === "ltc") return `ltc1q${randomFrom("023456789acdefghjklmnpqrstuvwxyz", 38)}`;
  return `0x${randomFrom("0123456789abcdef", 40)}`;
}

function getNetworkAddressKey(coinKey) {
  return addressKeyAliases[coinKey] || coinKey;
}

function getDefaultAddressMap() {
  const addressKeys = [...new Set(coinCatalog.map((coin) => getNetworkAddressKey(getCoinKey(coin))))];
  return Object.fromEntries(addressKeys.map((coinKey) => [coinKey, generateAddress(coinKey)]));
}

function createDefaultProfiles() {
  return [
    {
      id: "wallet-1",
      name: "Main Wallet",
      selectedCoins: ["BTC", "TRX"],
      balances: {},
      addresses: getDefaultAddressMap(),
    },
    {
      id: "wallet-2",
      name: "Wallet 2",
      selectedCoins: ["ETH", "USDT_ETH", "BNB"],
      balances: {},
      addresses: getDefaultAddressMap(),
    },
    {
      id: "wallet-3",
      name: "Wallet 3",
      selectedCoins: ["SOL", "USDC_SOL", "XRP"],
      balances: {},
      addresses: getDefaultAddressMap(),
    },
  ];
}

function normalizeProfile(profile, index) {
  const fallback = createDefaultProfiles()[index] || createDefaultProfiles()[0];
  const selected = Array.isArray(profile?.selectedCoins)
    ? profile.selectedCoins.filter((coinKey) => coinByKey.has(coinKey))
    : fallback.selectedCoins;

  return {
    id: profile?.id || fallback.id,
    name: profile?.name || fallback.name,
    selectedCoins: selected.length ? selected : fallback.selectedCoins,
    balances: profile?.balances && typeof profile.balances === "object" ? profile.balances : {},
    addresses: {
      ...getDefaultAddressMap(),
      ...(profile?.addresses && typeof profile.addresses === "object" ? profile.addresses : {}),
    },
  };
}

function loadWalletProfiles() {
  try {
    const saved = JSON.parse(localStorage.getItem("walletProfiles") || "null");
    if (Array.isArray(saved) && saved.length) {
      return saved.slice(0, 3).map(normalizeProfile);
    }
  } catch {
    localStorage.removeItem("walletProfiles");
  }

  return createDefaultProfiles();
}

function loadActiveProfileId() {
  const saved = localStorage.getItem("activeProfileId");
  return walletProfiles.some((profile) => profile.id === saved) ? saved : walletProfiles[0].id;
}

function getClientId() {
  const saved = localStorage.getItem("walletClientId");
  if (saved) return saved;

  const nextId =
    window.crypto?.randomUUID?.() ||
    `client-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  localStorage.setItem("walletClientId", nextId);
  return nextId;
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

function isPushSupported() {
  return Boolean("serviceWorker" in navigator && "PushManager" in window && "Notification" in window);
}

function setNotificationStatus(message, enabled = false) {
  if (notificationStatus) notificationStatus.textContent = message;
  if (notificationButton) {
    notificationButton.textContent = enabled ? "Notifications enabled" : "Enable iPhone notifications";
    notificationButton.classList.toggle("is-enabled", enabled);
  }
}

async function fetchPushPublicKey() {
  if (!API_BASE_URL) throw new Error("Missing API URL");

  const response = await fetch(apiUrl("/api/push/public-key"), { cache: "no-store" });
  if (!response.ok) throw new Error("Push setup failed");

  const data = await response.json();
  if (!data.supported || !data.publicKey) throw new Error("Push is not configured on backend");
  return data.publicKey;
}

async function registerPushSubscription({ askPermission = false } = {}) {
  if (!isPushSupported()) {
    setNotificationStatus("This browser does not support push notifications.");
    return false;
  }

  if (!window.isSecureContext) {
    setNotificationStatus("Notifications need HTTPS and the app installed on Home Screen.");
    return false;
  }

  if (!askPermission && Notification.permission !== "granted") {
    setNotificationStatus(
      Notification.permission === "denied"
        ? "Notifications are blocked in iOS settings."
        : "Tap to enable iPhone notifications.",
    );
    return false;
  }

  if (askPermission && Notification.permission !== "granted") {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setNotificationStatus("Notifications were not allowed.");
      return false;
    }
  }

  const publicKey = await fetchPushPublicKey();
  await navigator.serviceWorker.register("./service-worker.js");
  const readyRegistration = await navigator.serviceWorker.ready;
  const subscription =
    (await readyRegistration.pushManager.getSubscription()) ||
    (await readyRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    }));

  const response = await fetch(apiUrl("/api/push/subscribe"), {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      clientId: getClientId(),
      subscription,
      addresses: collectWalletAddresses(),
    }),
  });

  if (!response.ok) throw new Error("Could not save push subscription");

  localStorage.setItem("pushEnabled", "true");
  setNotificationStatus("Notifications enabled for received USDT.", true);
  return true;
}

function syncPushSubscription() {
  if (
    !isPushSupported() ||
    localStorage.getItem("pushEnabled") !== "true" ||
    Notification.permission !== "granted"
  ) {
    return;
  }
  registerPushSubscription({ askPermission: false }).catch(() => {});
}

function schedulePushSubscriptionSync() {
  clearTimeout(pushSyncTimer);
  pushSyncTimer = setTimeout(syncPushSubscription, 700);
}

function refreshNotificationUi() {
  if (!notificationButton || !notificationStatus) return;

  if (!isPushSupported()) {
    setNotificationStatus("Push notifications are not supported here.");
    notificationButton.disabled = true;
    return;
  }

  notificationButton.disabled = false;
  if (Notification.permission === "granted" && localStorage.getItem("pushEnabled") === "true") {
    setNotificationStatus("Notifications enabled for received USDT.", true);
    return;
  }

  if (Notification.permission === "denied") {
    setNotificationStatus("Notifications are blocked in iOS settings.");
    return;
  }

  setNotificationStatus("Tap to enable real iPhone notifications.");
}

function getActiveProfile() {
  return walletProfiles.find((profile) => profile.id === activeProfileId) || walletProfiles[0];
}

function getProfileAddress(profile, coinKey, fallbackAddress = "") {
  const addressKey = getNetworkAddressKey(coinKey);
  profile.addresses ||= {};

  if (!profile.addresses[addressKey]) {
    profile.addresses[addressKey] = profile.addresses[coinKey] || fallbackAddress || generateAddress(addressKey);
  }

  return profile.addresses[addressKey];
}

function saveWalletProfiles() {
  localStorage.setItem("walletProfiles", JSON.stringify(walletProfiles));
  localStorage.setItem("activeProfileId", activeProfileId);
}

function syncActiveProfile() {
  const profile = getActiveProfile();
  profile.selectedCoins = [...selectedSymbols];
  profile.balances = { ...balances };
  saveWalletProfiles();
}

function activateProfile(profileId, options = {}) {
  activeProfileId = walletProfiles.some((profile) => profile.id === profileId) ? profileId : walletProfiles[0].id;
  const profile = getActiveProfile();
  selectedSymbols = new Set(profile.selectedCoins.filter((coinKey) => coinByKey.has(coinKey)));
  if (!selectedSymbols.size) selectedSymbols = new Set(defaultSelectedSymbols);
  balances = { ...profile.balances };
  if (walletPillName) walletPillName.textContent = profile.name;
  if (options.save !== false) saveWalletProfiles();
}

function saveSelectedSymbols() {
  syncActiveProfile();
}

function getAddressForAsset(asset) {
  return getProfileAddress(getActiveProfile(), asset.addressKey, asset.address);
}

function getPrimaryWalletAddress() {
  const profile = getActiveProfile();
  const firstSelected = [...selectedSymbols][0] || "BTC";
  return getProfileAddress(profile, firstSelected, profile.addresses?.BTC);
}

function collectWalletAddresses() {
  const seen = new Set();
  const entries = [];

  walletProfiles.forEach((profile) => {
    coinCatalog.forEach((coin) => {
      const coinKey = getCoinKey(coin);
      const addressKey = getNetworkAddressKey(coinKey);
      const address = getProfileAddress(profile, coinKey);
      const uniqueKey = `${profile.id}:${addressKey}:${String(address).toLowerCase()}`;
      if (!address || seen.has(uniqueKey)) return;
      seen.add(uniqueKey);
      entries.push({
        walletId: profile.id,
        addressKey,
        address,
      });
    });
  });

  saveWalletProfiles();
  return entries;
}

function applyClaimedTransfers(transfers) {
  if (!Array.isArray(transfers) || !transfers.length) return 0;

  let totalAmount = 0;
  transfers.forEach((transfer) => {
    const profile = walletProfiles.find((wallet) => wallet.id === transfer.walletId);
    const tokenKey = coinByKey.has(transfer.tokenKey) ? transfer.tokenKey : "USDT_TRX";
    const amount = Number(transfer.amount) || 0;
    if (!profile || amount <= 0) return;

    profile.balances ||= {};
    profile.balances[tokenKey] = (Number(profile.balances[tokenKey]) || 0) + amount;
    if (!profile.selectedCoins.includes(tokenKey)) profile.selectedCoins.unshift(tokenKey);
    totalAmount += amount;
  });

  if (totalAmount > 0) {
    const activeProfile = getActiveProfile();
    balances = { ...activeProfile.balances };
    selectedSymbols = new Set(activeProfile.selectedCoins.filter((coinKey) => coinByKey.has(coinKey)));
    saveWalletProfiles();
  }

  return totalAmount;
}

async function claimIncomingTransfers() {
  if (!API_BASE_URL) return 0;

  const response = await fetch(apiUrl("/api/transfers/claim"), {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      clientId: getClientId(),
      addresses: collectWalletAddresses(),
    }),
  });

  if (!response.ok) return 0;
  const data = await response.json();
  return applyClaimedTransfers(data.transfers);
}

function shortenAddress(address) {
  if (!address || address.length <= 16) return address || "";
  return `${address.slice(0, 7)}...${address.slice(-7)}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function copyText(value) {
  const text = String(value ?? "");
  if (!text) throw new Error("Nothing to copy");

  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.top = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  textArea.setSelectionRange(0, text.length);

  const copied = document.execCommand("copy");
  textArea.remove();
  if (!copied) throw new Error("Copy failed");
}

function formatUsd(value) {
  return new Intl.NumberFormat("en-US", {
    useGrouping: true,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value) + " $";
}

function formatCryptoAmount(value) {
  if (!value) return "0";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: value < 1 ? 6 : 4,
  }).format(value);
}

function formatBalanceInputValue(value) {
  if (!value) return "";
  return Number(value).toFixed(2).replace(/\.?0+$/, "");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 1800);
}

function showPromoSlide(index) {
  activePromoSlide = index % 2;
  promoCard?.classList.toggle("is-second", activePromoSlide === 1);
  promoPager?.classList.add("is-sliding");
  promoPager?.classList.toggle("pager--first", activePromoSlide === 0);
  promoPager?.classList.toggle("pager--second", activePromoSlide === 1);

  setTimeout(() => {
    promoPager?.classList.remove("is-sliding");
  }, 330);
}

function paintPullLoader(progress) {
  const activeCount = Math.round(progress * pullRefreshBars.length);

  pullRefreshBars.forEach((bar, index) => {
    const opacity = index < activeCount ? 0.24 + (index / pullRefreshBars.length) * 0.5 : 0.1;
    bar.style.setProperty("--bar-opacity", opacity.toFixed(2));
  });
}

function startLoaderSpin() {
  clearInterval(loaderSpinTimer);
  loaderSpinStep = 0;
  loaderSpinTimer = setInterval(() => {
    pullRefreshBars.forEach((bar, index) => {
      const distance = (index - loaderSpinStep + pullRefreshBars.length) % pullRefreshBars.length;
      const opacity = Math.max(0.1, 0.9 - distance * 0.12);
      bar.style.setProperty("--bar-opacity", opacity.toFixed(2));
    });
    loaderSpinStep = (loaderSpinStep + 1) % pullRefreshBars.length;
  }, 92);
}

function stopLoaderSpin() {
  clearInterval(loaderSpinTimer);
  loaderSpinTimer = undefined;
  paintPullLoader(0);
}

function getVisibleCoins() {
  return coinCatalog
    .filter((coin) => selectedSymbols.has(getCoinKey(coin)))
    .sort((a, b) => {
      const aKey = getCoinKey(a);
      const bKey = getCoinKey(b);
      const aValue = (balances[aKey] || 0) * (prices[aKey]?.usd || 0);
      const bValue = (balances[bKey] || 0) * (prices[bKey]?.usd || 0);
      if (bValue !== aValue) return bValue - aValue;
      return coinCatalog.indexOf(a) - coinCatalog.indexOf(b);
    });
}

function renderAssets() {
  const visibleCoins = getVisibleCoins();

  assetList.innerHTML = visibleCoins
    .map((coin) => {
      const coinKey = getCoinKey(coin);
      const price = prices[coinKey]?.usd ?? 0;
      const change = prices[coinKey]?.change ?? 0;
      const roundedChange = Number(change.toFixed(2));
      const amount = balances[coinKey] || 0;
      const value = amount * price;
      const changeClass = roundedChange < 0 ? "is-loss" : roundedChange > 0 ? "is-gain" : "is-neutral";
      const changePrefix = roundedChange > 0 ? "+" : "";

      return `
        <button class="asset-row" data-name="${coin.symbol.toLowerCase()} ${coin.name.toLowerCase()}" data-action="${coinKey.toLowerCase()}">
          <span class="asset-row__left">
            <span class="token" aria-hidden="true">${coin.icon}</span>
            <span class="asset-row__meta">
              <span class="asset-row__title">
                <strong>${coin.symbol}</strong>
                <span class="chip">${coin.name}</span>
              </span>
              <span class="asset-row__sub">
                <span>${formatUsd(price)}</span>
                <span class="${changeClass}">${changePrefix}${roundedChange.toFixed(2)}%</span>
              </span>
            </span>
          </span>
          <span class="asset-row__right">
            <strong>${formatCryptoAmount(amount)}</strong>
            <span>${formatUsd(value)}</span>
          </span>
        </button>
      `;
    })
    .join("");

  app?.style.setProperty("--asset-extra-offset", `${Math.max(0, visibleCoins.length - 2) * 60}px`);
  renderBalance();
}

function renderBalance() {
  const visibleCoins = getVisibleCoins();
  const total = visibleCoins.reduce((sum, coin) => {
    const coinKey = getCoinKey(coin);
    return sum + (balances[coinKey] || 0) * (prices[coinKey]?.usd || 0);
  }, 0);
  const previousTotal = visibleCoins.reduce((sum, coin) => {
    const coinKey = getCoinKey(coin);
    const price = prices[coinKey]?.usd || 0;
    const change = prices[coinKey]?.change || 0;
    const previousPrice = change === -100 ? price : price / (1 + change / 100);
    return sum + (balances[coinKey] || 0) * previousPrice;
  }, 0);
  const totalDelta = total - previousTotal;
  const totalChange = previousTotal ? (totalDelta / previousTotal) * 100 : 0;
  const prefix = totalChange > 0 ? "+" : "";
  const deltaPrefix = totalDelta > 0 ? "+" : "";
  const changeClass = totalDelta < 0 ? "is-loss" : "is-gain";
  const arrowClass = totalDelta < 0 ? "balance-change__arrow--down" : "balance-change__arrow--up";

  balanceTotal.textContent = formatUsd(total);
  balanceChange.classList.remove("is-loss", "is-gain");
  balanceChange.classList.add(changeClass);
  balanceChange.innerHTML = `
    <svg class="balance-change__arrow ${arrowClass}" viewBox="0 0 16 10" aria-hidden="true">
      <path d="M7.2 1.8 C7.65 1.25 8.35 1.25 8.8 1.8 L14.05 7.55 C14.45 8 14.12 8.7 13.5 8.7 H2.5 C1.88 8.7 1.55 8 1.95 7.55 Z" />
    </svg>
    <span>${deltaPrefix}${formatUsd(Math.abs(totalDelta))} (${prefix}${totalChange.toFixed(2)}%)</span>
  `;
}

function renderFilters() {
  filterList.innerHTML = coinCatalog
    .map((coin) => {
      const coinKey = getCoinKey(coin);
      return `
      <button class="filter-option ${selectedSymbols.has(coinKey) ? "is-selected" : ""}" data-filter-symbol="${coinKey}" type="button">
        <span class="filter-option__coin">
          <span class="token token--filter" aria-hidden="true">${coin.icon}</span>
          <span class="filter-option__meta">
            <strong>${coin.symbol}</strong>
            <span>${coin.name}</span>
          </span>
        </span>
        <span class="filter-option__check" aria-hidden="true"></span>
      </button>
    `;
    })
    .join("");
}

function openFilters() {
  renderFilters();
  filterSheet.classList.add("is-open");
  filterSheet.setAttribute("aria-hidden", "false");
}

function closeFilters() {
  filterSheet.classList.remove("is-open");
  filterSheet.setAttribute("aria-hidden", "true");
}

function qrIconSvg() {
  return `<img src="./receive-scan.jpg" alt="" aria-hidden="true" />`;
}

function copyIconSvg() {
  return `<img src="./receive-copy.jpg" alt="" aria-hidden="true" />`;
}

function renderReceiveTabs() {
  if (!receiveTabs) return;

  receiveTabs.innerHTML = receiveTabsData
    .map((tab) => {
      const activeClass = activeReceiveFilter === tab.key ? " is-active" : "";
      if (tab.key === "ALL") {
        return `<button class="receive-tab receive-tab--all${activeClass}" data-receive-filter="${tab.key}" type="button">All</button>`;
      }

      return `
        <button class="receive-tab receive-tab--${tab.key.toLowerCase()}${activeClass}" data-receive-filter="${tab.key}" type="button" aria-label="${tab.key}">
          <img src="${tab.icon}" alt="" aria-hidden="true" />
        </button>
      `;
    })
    .join("");
}

function getFilteredReceiveAssets() {
  const query = receiveSearch?.value.trim().toLowerCase() || "";

  return receiveAssets.filter((asset) => {
    const address = getAddressForAsset(asset);
    const matchesNetwork = activeReceiveFilter === "ALL" || asset.filter === activeReceiveFilter;
    const matchesSearch =
      !query ||
      asset.symbol.toLowerCase().includes(query) ||
      asset.name.toLowerCase().includes(query) ||
      address.toLowerCase().includes(query);
    return matchesNetwork && matchesSearch;
  });
}

function renderReceiveList() {
  if (!receiveList) return;

  const assets = getFilteredReceiveAssets();
  if (!assets.length) {
    receiveList.innerHTML = `<p class="receive-empty">No crypto found</p>`;
    return;
  }

  const sections = [...new Set(assets.map((asset) => asset.section))];
  receiveList.innerHTML = sections
    .map((section) => {
      const rows = assets
        .filter((asset) => asset.section === section)
        .map((asset) => {
          const address = getAddressForAsset(asset);
          const displayAddress = shortenAddress(address);
          return `
            <button class="receive-row" type="button" data-receive-asset="${asset.symbol}">
              <span class="token" aria-hidden="true">${asset.icon}</span>
              <span class="receive-row__main">
                <span class="receive-row__title">
                  <strong>${asset.symbol}</strong>
                  <span class="chip">${asset.name}</span>
                </span>
                <span class="receive-row__address" data-address-text="${escapeHtml(displayAddress)}">
                  <span class="receive-row__address-text">${escapeHtml(displayAddress)}</span>
                  <span class="receive-row__copied" aria-hidden="true">
                    <svg viewBox="0 0 20 20" aria-hidden="true">
                      <path d="m4.2 10.4 3.6 3.5 8-8.2" />
                    </svg>
                    <span>Address copied</span>
                  </span>
                </span>
              </span>
              <span class="receive-row__actions">
                <span class="receive-row__action receive-row__action--qr" data-receive-qr="${asset.symbol}" aria-label="Show QR">${qrIconSvg()}</span>
                <span class="receive-row__action" data-receive-copy="${escapeHtml(address)}" aria-label="Copy address">${copyIconSvg()}</span>
              </span>
            </button>
          `;
        })
        .join("");

      return `<h3 class="receive-section-title">${section}</h3>${rows}`;
    })
    .join("");
}

function openReceiveSheet() {
  activeReceiveFilter = "ALL";
  if (receiveSearch) receiveSearch.value = "";
  renderReceiveTabs();
  renderReceiveList();
  receiveSheet?.classList.add("is-open");
  receiveSheet?.setAttribute("aria-hidden", "false");
}

function closeReceiveSheet() {
  receiveSheet?.classList.remove("is-open");
  receiveSheet?.setAttribute("aria-hidden", "true");
}

function showReceiveCopied(row) {
  const addressLabel = row?.querySelector(".receive-row__address");
  if (!addressLabel) return;

  const existingTimer = receiveCopyTimers.get(row);
  if (existingTimer) clearTimeout(existingTimer);

  addressLabel.classList.add("is-copied");

  const restoreTimer = setTimeout(() => {
    addressLabel.classList.remove("is-copied");
    receiveCopyTimers.delete(row);
  }, 5500);
  receiveCopyTimers.set(row, restoreTimer);
}

function renderSettings() {
  const profile = getActiveProfile();
  if (!settingsWallets || !settingsAssets || !settingsBalances || !settingsAddresses || !settingsWalletName) return;

  settingsWallets.innerHTML = walletProfiles
    .map(
      (wallet) => `
        <button class="settings-wallet ${wallet.id === activeProfileId ? "is-active" : ""}" data-wallet-id="${wallet.id}" type="button">
          ${escapeHtml(wallet.name)}
        </button>
      `,
    )
    .join("");

  settingsWalletName.value = profile.name;

  settingsAssets.innerHTML = coinCatalog
    .map((coin) => {
      const coinKey = getCoinKey(coin);
      return `
        <button class="settings-asset ${selectedSymbols.has(coinKey) ? "is-selected" : ""}" data-settings-asset="${coinKey}" type="button">
          <span class="settings-asset__coin">
            <span class="token token--filter" aria-hidden="true">${coin.icon}</span>
            <span>
              <strong>${coin.symbol}</strong>
              <span>${coin.name}</span>
            </span>
          </span>
          <span class="settings-check" aria-hidden="true"></span>
        </button>
      `;
    })
    .join("");

  settingsBalances.innerHTML = [...coinCatalog].sort((a, b) => {
    const aSelected = selectedSymbols.has(getCoinKey(a));
    const bSelected = selectedSymbols.has(getCoinKey(b));
    if (aSelected !== bSelected) return aSelected ? -1 : 1;
    return coinCatalog.indexOf(a) - coinCatalog.indexOf(b);
  })
    .map((coin) => {
      const coinKey = getCoinKey(coin);
      const usdValue = (balances[coinKey] || 0) * (prices[coinKey]?.usd || 0);
      return `
        <label class="settings-balance">
          <span class="settings-balance__coin">
            <span class="token token--filter" aria-hidden="true">${coin.icon}</span>
            <span>
              <strong>${coin.symbol}</strong>
              <span>${coin.name} USD</span>
            </span>
          </span>
          <input data-balance-key="${coinKey}" inputmode="decimal" value="${escapeHtml(formatBalanceInputValue(usdValue))}" placeholder="0.00" autocomplete="off" />
        </label>
      `;
    })
    .join("");

  settingsAddresses.innerHTML = coinCatalog
    .map((coin) => {
      const coinKey = getCoinKey(coin);
      const addressKey = getNetworkAddressKey(coinKey);
      const address = getProfileAddress(profile, coinKey);
      return `
        <label class="settings-address">
          <span class="settings-address__top">
            <span class="token token--filter" aria-hidden="true">${coin.icon}</span>
            <span class="settings-address__label">
              <strong>${coin.symbol}</strong>
              <span>${coin.name}</span>
            </span>
          </span>
          <input data-address-key="${addressKey}" value="${escapeHtml(address)}" autocomplete="off" spellcheck="false" />
        </label>
      `;
    })
    .join("");

  saveWalletProfiles();
}

function openSettings() {
  renderSettings();
  refreshNotificationUi();
  settingsSheet?.classList.add("is-open");
  settingsSheet?.setAttribute("aria-hidden", "false");
}

function closeSettings() {
  settingsSheet?.classList.remove("is-open");
  settingsSheet?.setAttribute("aria-hidden", "true");
}

function switchWallet(profileId) {
  syncActiveProfile();
  activateProfile(profileId);
  renderAssets();
  renderFilters();
  renderReceiveList();
  renderSettings();
}

function applyBalances(nextBalances) {
  if (!nextBalances || typeof nextBalances !== "object") return;

  const source = nextBalances.balances || nextBalances;
  for (const [symbol, value] of Object.entries(source)) {
    const normalizedSymbol = symbol.toUpperCase();
    if (coinByKey.has(normalizedSymbol)) {
      balances[normalizedSymbol] = Number(value) || 0;
    }
  }

  syncActiveProfile();
}

async function fetchPrices() {
  const ids = [...new Set(coinCatalog.map((coin) => coin.geckoId))].join(",");
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
    { cache: "no-store" },
  );

  if (!response.ok) throw new Error("Price request failed");

  const data = await response.json();
  for (const coin of coinCatalog) {
    const item = data[coin.geckoId];
    if (!item) continue;
    prices[getCoinKey(coin)] = {
      usd: Number(item.usd) || 0,
      change: Number(item.usd_24h_change) || 0,
    };
  }
}

async function fetchLatestWalletData() {
  document.dispatchEvent(new CustomEvent("wallet:refresh"));

  const [balanceResult, claimResult] = await Promise.allSettled([
    typeof window.loadWalletData === "function" ? window.loadWalletData() : Promise.resolve(null),
    claimIncomingTransfers(),
    fetchPrices(),
  ]);

  if (balanceResult.status === "fulfilled" && balanceResult.value) {
    applyBalances(balanceResult.value);
  }
  if (claimResult.status === "fulfilled" && claimResult.value > 0) {
    showToast(`Received ${formatCryptoAmount(claimResult.value)} USDT`);
  }

  renderAssets();
  if (settingsSheet?.classList.contains("is-open")) {
    renderSettings();
  }
}

function setPullState(offset) {
  pullOffset = Math.max(0, Math.min(offset, pullMax));
  const progress = Math.min(pullOffset / pullThreshold, 1);
  app?.style.setProperty("--pull-offset", `${pullOffset}px`);
  app?.style.setProperty("--pull-progress", progress.toFixed(3));
  app?.style.setProperty("--pull-opacity", (progress * 0.95).toFixed(3));
  app?.style.setProperty("--pull-spinner-offset", `${Math.min(pullOffset * 0.18, 20)}px`);
  app?.style.setProperty("--pull-scrollbar-scale", Math.max(0.42, 1 - progress * 0.58).toFixed(3));
  app?.style.setProperty("--pull-scrollbar-y", `${Math.max(-10, -pullOffset * 0.12)}px`);
  if (!isRefreshing) {
    paintPullLoader(progress);
  }
}

async function runPullRefresh() {
  if (!app || isRefreshing) return;

  isRefreshing = true;
  const minRefreshTime = new Promise((resolve) => setTimeout(resolve, 1400));
  app.classList.remove("is-dragging");
  app.classList.add("is-refreshing");
  setPullState(58);
  app.style.setProperty("--pull-scrollbar-scale", "1");
  app.style.setProperty("--pull-scrollbar-y", "0px");
  startLoaderSpin();

  try {
    await Promise.all([fetchLatestWalletData(), minRefreshTime]);
  } catch {
    await minRefreshTime;
    renderAssets();
    showToast("Refresh failed");
  } finally {
    isRefreshing = false;
    app.classList.remove("is-refreshing");
    app.classList.add("is-refresh-ending");
    stopLoaderSpin();
    await new Promise((resolve) => setTimeout(resolve, 260));
    app.classList.remove("is-refresh-ending");
    setPullState(0);
  }
}

copyWallet?.addEventListener("click", async (event) => {
  event.stopPropagation();
  const value = getPrimaryWalletAddress();
  try {
    await copyText(value);
    showToast("Wallet address copied");
  } catch {
    showToast(value);
  }
});

searchInput?.addEventListener("focus", () => {
  showToast("Search ready");
});

filterList?.addEventListener("click", (event) => {
  const option = event.target.closest("[data-filter-symbol]");
  if (!option) return;

  const symbol = option.dataset.filterSymbol;
  if (selectedSymbols.has(symbol)) {
    if (selectedSymbols.size === 1) {
      showToast("Keep at least one coin");
      return;
    }
    selectedSymbols.delete(symbol);
  } else {
    selectedSymbols.add(symbol);
  }

  saveSelectedSymbols();
  renderFilters();
  renderAssets();
});

filterScrim?.addEventListener("click", closeFilters);
filterDone?.addEventListener("click", closeFilters);
settingsScrim?.addEventListener("click", closeSettings);
settingsDone?.addEventListener("click", closeSettings);
receiveScrim?.addEventListener("click", closeReceiveSheet);
receiveClose?.addEventListener("click", closeReceiveSheet);

settingsWallets?.addEventListener("click", (event) => {
  const wallet = event.target.closest("[data-wallet-id]");
  if (!wallet) return;
  switchWallet(wallet.dataset.walletId);
});

settingsWalletName?.addEventListener("input", () => {
  const profile = getActiveProfile();
  profile.name = settingsWalletName.value.trim() || "Wallet";
  if (walletPillName) walletPillName.textContent = profile.name;
  saveWalletProfiles();
  const activeWalletButton = settingsWallets?.querySelector(`[data-wallet-id="${profile.id}"]`);
  if (activeWalletButton) activeWalletButton.textContent = profile.name;
});

settingsAssets?.addEventListener("click", (event) => {
  const asset = event.target.closest("[data-settings-asset]");
  if (!asset) return;

  const coinKey = asset.dataset.settingsAsset;
  if (selectedSymbols.has(coinKey)) {
    if (selectedSymbols.size === 1) {
      showToast("Keep at least one coin");
      return;
    }
    selectedSymbols.delete(coinKey);
  } else {
    selectedSymbols.add(coinKey);
  }

  syncActiveProfile();
  renderSettings();
  renderFilters();
  renderAssets();
});

settingsBalances?.addEventListener("input", (event) => {
  const input = event.target.closest("[data-balance-key]");
  if (!input) return;

  const coinKey = input.dataset.balanceKey;
  const normalized = input.value.replace(",", ".");
  const usdValue = Number(normalized);
  const price = prices[coinKey]?.usd || 0;
  balances[coinKey] = Number.isFinite(usdValue) && usdValue > 0 && price > 0 ? usdValue / price : 0;
  syncActiveProfile();
  renderAssets();
});

settingsAddresses?.addEventListener("input", (event) => {
  const input = event.target.closest("[data-address-key]");
  if (!input) return;

  const profile = getActiveProfile();
  const addressKey = input.dataset.addressKey;
  profile.addresses[addressKey] = input.value.trim();
  settingsAddresses.querySelectorAll(`[data-address-key="${CSS.escape(addressKey)}"]`).forEach((addressInput) => {
    if (addressInput !== input) addressInput.value = input.value;
  });
  saveWalletProfiles();
  renderReceiveList();
  schedulePushSubscriptionSync();
});

settingsRandomAddresses?.addEventListener("click", () => {
  const profile = getActiveProfile();
  profile.addresses = getDefaultAddressMap();
  saveWalletProfiles();
  renderSettings();
  renderReceiveList();
  syncPushSubscription();
  showToast("Addresses randomized");
});

notificationButton?.addEventListener("click", async () => {
  notificationButton.disabled = true;
  setNotificationStatus("Setting up notifications...");

  try {
    await registerPushSubscription({ askPermission: true });
    showToast("Notifications enabled");
  } catch (error) {
    setNotificationStatus(error.message || "Notification setup failed");
    showToast("Notification setup failed");
  } finally {
    notificationButton.disabled = false;
  }
});

receiveSearch?.addEventListener("input", renderReceiveList);

receiveTabs?.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-receive-filter]");
  if (!tab) return;

  activeReceiveFilter = tab.dataset.receiveFilter;
  renderReceiveTabs();
  renderReceiveList();
});

receiveList?.addEventListener("click", async (event) => {
  const qrButton = event.target.closest("[data-receive-qr]");
  if (qrButton) {
    event.preventDefault();
    showToast(`${qrButton.dataset.receiveQr} QR opened`);
    return;
  }

  const copyButton = event.target.closest("[data-receive-copy]");
  if (!copyButton) return;
  event.preventDefault();
  const row = copyButton.closest(".receive-row");

  try {
    await copyText(copyButton.dataset.receiveCopy);
    showReceiveCopied(row);
  } catch {
    showToast("Copy failed");
  }
});

document.addEventListener("wallet:balances", (event) => {
  applyBalances(event.detail);
  renderAssets();
});

window.setWalletBalances = (nextBalances) => {
  applyBalances(nextBalances);
  renderAssets();
};

app?.addEventListener(
  "touchstart",
  (event) => {
    if (
      isRefreshing ||
      filterSheet.classList.contains("is-open") ||
      settingsSheet.classList.contains("is-open") ||
      receiveSheet.classList.contains("is-open") ||
      scrollLayer.scrollTop > 0
    ) {
      return;
    }
    pullStartY = event.touches[0].clientY;
    isPulling = false;
  },
  { passive: true },
);

app?.addEventListener(
  "touchmove",
  (event) => {
    if (
      isRefreshing ||
      filterSheet.classList.contains("is-open") ||
      settingsSheet.classList.contains("is-open") ||
      receiveSheet.classList.contains("is-open") ||
      scrollLayer.scrollTop > 0
    ) {
      return;
    }

    const deltaY = event.touches[0].clientY - pullStartY;
    if (deltaY <= 0) return;

    isPulling = true;
    app.classList.add("is-dragging");
    event.preventDefault();

    const dampedOffset = Math.min(deltaY * 0.55, pullMax);
    setPullState(dampedOffset);
  },
  { passive: false },
);

app?.addEventListener(
  "touchend",
  () => {
    if (!isPulling || isRefreshing) return;

    isPulling = false;

    if (pullOffset >= pullThreshold) {
      runPullRefresh();
      return;
    }

    app.classList.remove("is-dragging");
    setPullState(0);
  },
  { passive: true },
);

app?.addEventListener(
  "touchcancel",
  () => {
    isPulling = false;
    app.classList.remove("is-dragging");
    setPullState(0);
  },
  { passive: true },
);

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;

  if (target.dataset.action === "filters") {
    openFilters();
    return;
  }

  if (target.dataset.action === "settings") {
    openSettings();
    return;
  }

  if (target.dataset.action === "receive") {
    openReceiveSheet();
    return;
  }

  const messages = {
    scan: "Scanner opened",
    wallet: "Main Wallet selected",
    send: "Send opened",
    swap: "Swap opened",
    buy: "Buy opened",
    promo: "Explore now opened",
    crypto: "Crypto selected",
    watchlist: "Watchlist opened",
    nfts: "NFTs opened",
    history: "History opened",
    perps: "Perps opened",
    "nav-home": "Home selected",
    "nav-markets": "Markets opened",
    "nav-perps": "Perps opened",
    "nav-discover": "Discover opened",
  };

  const action = target.dataset.action;
  if (messages[action]) {
    showToast(messages[action]);
  } else if (coinByKey.has(action.toUpperCase())) {
    showToast(`${coinByKey.get(action.toUpperCase()).symbol} opened`);
  }
});

renderAssets();
refreshNotificationUi();
syncPushSubscription();
fetchLatestWalletData().catch(() => {
  renderAssets();
});

setInterval(() => {
  showPromoSlide(activePromoSlide + 1);
}, 5000);

setInterval(() => {
  fetchLatestWalletData().catch(() => {});
}, 60000);
