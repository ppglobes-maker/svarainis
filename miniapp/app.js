const tg = window.Telegram?.WebApp;

const miniApp = document.getElementById("miniApp");
const balanceText = document.getElementById("balanceText");
const usdText = document.getElementById("usdText");
const selectedChainTitle = document.getElementById("selectedChainTitle");
const selectedChainNetwork = document.getElementById("selectedChainNetwork");
const selectedChainIcon = document.getElementById("selectedChainIcon");
const selectedChainBadge = document.getElementById("selectedChainBadge");
const historyButton = document.getElementById("historyButton");
const historyHint = document.getElementById("historyHint");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");
const settingsButton = document.getElementById("settingsButton");
const settingsSheet = document.getElementById("settingsSheet");
const settingsScrim = document.getElementById("settingsScrim");
const settingsClose = document.getElementById("settingsClose");
const settingsForm = document.getElementById("settingsForm");
const displayNameInput = document.getElementById("displayNameInput");
const displayChainInput = document.getElementById("displayChainInput");
const displayChainSelectIcon = document.getElementById("displayChainSelectIcon");
const displayChainSelectText = document.getElementById("displayChainSelectText");
const accentInput = document.getElementById("accentInput");
const chainBalanceInputs = document.getElementById("chainBalanceInputs");
const priceInput = document.getElementById("priceInput");
const chainAddressInputs = document.getElementById("chainAddressInputs");
const themeToggle = document.getElementById("themeToggle");
const themeInSettings = document.getElementById("themeInSettings");
const sendButton = document.getElementById("sendButton");
const sendSheet = document.getElementById("sendSheet");
const sendScrim = document.getElementById("sendScrim");
const sendClose = document.getElementById("sendClose");
const sendForm = document.getElementById("sendForm");
const sendChain = document.getElementById("sendChain");
const sendChainSelectIcon = document.getElementById("sendChainSelectIcon");
const sendChainSelectText = document.getElementById("sendChainSelectText");
const sendAddress = document.getElementById("sendAddress");
const pasteAddress = document.getElementById("pasteAddress");
const scanAddress = document.getElementById("scanAddress");
const sendAmount = document.getElementById("sendAmount");
const sendMax = document.getElementById("sendMax");
const sendSubmit = document.getElementById("sendSubmit");
const sendStatus = document.getElementById("sendStatus");
const toast = document.getElementById("toast");
const API_BASE_URL = (window.ATRUST_API_BASE_URL || "").replace(/\/$/, "");
const USDT_PRICE_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd";
const usdtChains = [
  { key: "TRX", title: "USDT TRC20", shortTitle: "TRC20", network: "Tron", icon: "../coins/tron.png" },
  { key: "ETH", title: "USDT ERC20", shortTitle: "ERC20", network: "Ethereum", icon: "../coins/ethereum.png" },
  { key: "BNB", title: "USDT BEP20", shortTitle: "BEP20", network: "BNB Smart Chain", icon: "../coins/bnb.png" },
  { key: "SOL", title: "USDT SPL", shortTitle: "SPL", network: "Solana", icon: "../coins/solana.png" },
  { key: "ARB", title: "USDT Arbitrum", shortTitle: "Arbitrum", network: "Arbitrum", icon: "../coins/arbitrum.png" },
  { key: "BASE", title: "USDT Base", shortTitle: "Base", network: "Base", icon: "../coins/base.png" },
];
const chainMap = new Map(usdtChains.map((chain) => [chain.key, chain]));
const sendChainLabels = {
  TRX: "Tron / TRC20",
  ETH: "Ethereum / ERC20",
  BNB: "BNB Smart Chain / BEP20",
  SOL: "Solana",
  ARB: "Arbitrum",
  BASE: "Base",
};
const accentThemes = new Set(["green", "blue", "minimal", "mono", "carbon", "slate", "emerald", "graphite", "violet", "rose", "amber"]);

let wallet = null;
let toastTimer;
let liveUsdtPrice = null;
let transferHistory = loadTransferHistory();

function supportsTelegramVersion(version) {
  return Boolean(tg?.isVersionAtLeast?.(version));
}

function telegramHaptic(type = "success") {
  if (!supportsTelegramVersion("6.1")) return;
  tg?.HapticFeedback?.notificationOccurred?.(type);
}

function headers() {
  const nextHeaders = {
    "content-type": "application/json",
  };

  if (tg?.initData) {
    nextHeaders["x-telegram-init-data"] = tg.initData;
  } else {
    nextHeaders["x-debug-user-id"] = localStorage.getItem("miniappDebugUser") || "local";
  }

  return nextHeaders;
}

function formatAmount(value, decimals = 2) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number(value) || 0);
}

function formatInputAmount(value) {
  const number = Number(value) || 0;
  return number ? String(Number(number.toFixed(6))) : "";
}

function formatAddress(value) {
  if (!value || value.length <= 18) return value || "";
  return `${value.slice(0, 9)}...${value.slice(-7)}`;
}

function getChainBalances(sourceWallet = wallet) {
  const source = sourceWallet?.chainBalances && typeof sourceWallet.chainBalances === "object"
    ? sourceWallet.chainBalances
    : {};
  const balances = Object.fromEntries(usdtChains.map((chain) => [chain.key, Number(source[chain.key]) || 0]));

  if (!Object.values(balances).some((value) => value > 0) && Number(sourceWallet?.balance) > 0) {
    balances.TRX = Number(sourceWallet.balance) || 0;
  }

  return balances;
}

function getChainAddresses(sourceWallet = wallet) {
  const source =
    sourceWallet?.chainAddresses && typeof sourceWallet.chainAddresses === "object"
      ? sourceWallet.chainAddresses
      : {};

  return Object.fromEntries(
    usdtChains.map((chain) => [
      chain.key,
      String(source[chain.key] || (chain.key === "TRX" ? sourceWallet?.address || "" : "")).trim(),
    ]),
  );
}

function getTotalBalance(chainBalances) {
  return Object.values(chainBalances).reduce((sum, value) => sum + (Number(value) || 0), 0);
}

function getUsdPrice() {
  return Number(liveUsdtPrice) || Number(wallet?.usdPrice) || 1;
}

function getDisplayChain() {
  return chainMap.get(wallet?.displayChain) || chainMap.get("TRX");
}

function loadTransferHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem("miniappTransferHistory") || "[]");
    return Array.isArray(saved) ? saved.slice(0, 12) : [];
  } catch {
    localStorage.removeItem("miniappTransferHistory");
    return [];
  }
}

function saveTransferHistory() {
  localStorage.setItem("miniappTransferHistory", JSON.stringify(transferHistory.slice(0, 12)));
}

function updateChainSelectVisual(selectElement, iconElement, textElement, labelType = "title") {
  const chain = chainMap.get(selectElement?.value) || chainMap.get("TRX");
  if (iconElement) iconElement.src = chain.icon;
  if (textElement) textElement.textContent = labelType === "send" ? sendChainLabels[chain.key] || chain.title : chain.title;
}

function renderChainIcon(chain) {
  return `
    <span class="chain-icon">
      <img class="chain-icon__main" src="../coins/usdt.png" alt="" />
      <span class="chain-icon__badge chain-icon__badge--${chain.key.toLowerCase()}">
        <img src="${chain.icon}" alt="" />
      </span>
    </span>
  `;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 1700);
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

async function readClipboardText() {
  if (!navigator.clipboard?.readText || !window.isSecureContext) {
    throw new Error("Clipboard unavailable");
  }

  return navigator.clipboard.readText();
}

function applyTheme(theme) {
  const nextTheme = theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  document.documentElement.dataset.accent = accentThemes.has(wallet?.accentTheme) ? wallet.accentTheme : "green";
  if (supportsTelegramVersion("6.1")) {
    tg?.setHeaderColor?.(nextTheme === "light" ? "#f4f7f2" : "#101214");
    tg?.setBackgroundColor?.(nextTheme === "light" ? "#f4f7f2" : "#101214");
  }
}

function renderHistory() {
  if (!historyList) return;

  if (historyHint) {
    historyHint.textContent = transferHistory.length
      ? `${transferHistory.length} recent transfer${transferHistory.length === 1 ? "" : "s"}`
      : "No recent transfers";
  }

  historyList.innerHTML = transferHistory.length
    ? transferHistory
        .map(
          (entry) => `
            <article class="history-row">
              ${renderChainIcon(chainMap.get(entry.chain) || chainMap.get("TRX"))}
              <span>
                <strong>${formatAmount(entry.amount, 4)} USDT</strong>
                <small>${entry.label} • ${new Date(entry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small>
              </span>
            </article>
          `,
        )
        .join("")
    : `<p class="history-empty">Transfers will show here after sending.</p>`;
}

function render(syncForm = true) {
  if (!wallet) return;
  const chainBalances = getChainBalances(wallet);
  const displayChain = getDisplayChain();
  const balance = chainBalances[displayChain.key] || 0;
  const usdPrice = getUsdPrice();

  applyTheme(wallet.theme);
  balanceText.textContent = formatAmount(balance, balance >= 100 ? 2 : 4);
  usdText.textContent = `$${formatAmount(balance * usdPrice, 2)}`;
  selectedChainTitle.textContent = displayChain.shortTitle || displayChain.title.replace(/^USDT\s*/i, "");
  selectedChainNetwork.textContent = `${displayChain.network} network`;
  selectedChainIcon.src = displayChain.icon;
  selectedChainBadge.className = `flash-card__badge flash-card__badge--${displayChain.key.toLowerCase()}`;
  renderHistory();

  if (!syncForm) return;
  displayNameInput.value = wallet.displayName || "USDT Tron";
  displayChainInput.value = displayChain.key;
  updateChainSelectVisual(displayChainInput, displayChainSelectIcon, displayChainSelectText);
  accentInput.value = accentThemes.has(wallet.accentTheme) ? wallet.accentTheme : "green";
  chainBalanceInputs.innerHTML = usdtChains
    .map(
      (chain) => `
        <label class="settings-chain-row">
          ${renderChainIcon(chain)}
          <span>
            <strong>${chain.title}</strong>
            <small>${chain.network}</small>
          </span>
          <input data-chain-balance="${chain.key}" type="number" min="0" step="0.000001" inputmode="decimal" value="${chainBalances[chain.key] || 0}" />
        </label>
      `,
    )
    .join("");
  priceInput.value = String(usdPrice);
  const chainAddresses = getChainAddresses(wallet);
  chainAddressInputs.innerHTML = usdtChains
    .map(
      (chain) => `
        <label class="settings-address-row">
          ${renderChainIcon(chain)}
          <span>
            <strong>${chain.title}</strong>
            <small>${chain.network}</small>
          </span>
          <input data-chain-address="${chain.key}" value="${chainAddresses[chain.key] || ""}" autocomplete="off" spellcheck="false" />
        </label>
      `,
    )
    .join("");
}

function apiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

async function loadWallet() {
  const response = await fetch(apiUrl("/api/wallet"), {
    headers: headers(),
  });
  const data = await response.json();
  wallet = data.wallet;
  render();
}

async function refreshUsdtPrice() {
  const response = await fetch(USDT_PRICE_URL, { cache: "no-store" });
  if (!response.ok) throw new Error("USDT price failed");

  const data = await response.json();
  const price = Number(data?.tether?.usd);
  if (!Number.isFinite(price) || price <= 0) throw new Error("Invalid USDT price");

  liveUsdtPrice = price;
  if (wallet) render(!settingsSheet.classList.contains("is-open"));
}

async function saveWallet(patch) {
  const response = await fetch(apiUrl("/api/wallet"), {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify(patch),
  });
  const data = await response.json();
  wallet = data.wallet;
  render();
}

async function sendTransfer(payload) {
  const response = await fetch(apiUrl("/api/transfers"), {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Transfer failed");
  wallet = data.wallet;
  render();
  return data.transfer;
}

function openSettings() {
  settingsSheet.classList.add("is-open");
  settingsSheet.setAttribute("aria-hidden", "false");
}

function closeSettings() {
  if (settingsSheet.contains(document.activeElement)) document.activeElement.blur();
  settingsSheet.classList.remove("is-open");
  settingsSheet.setAttribute("aria-hidden", "true");
}

function openSend() {
  sendStatus.textContent = "";
  sendSubmit.disabled = false;
  sendSubmit.textContent = "Send";
  sendChain.value = getDisplayChain().key;
  updateChainSelectVisual(sendChain, sendChainSelectIcon, sendChainSelectText, "send");
  sendSheet.classList.add("is-open");
  sendSheet.setAttribute("aria-hidden", "false");
}

function openSendForChain(chainKey) {
  if (usdtChains.some((chain) => chain.key === chainKey)) {
    sendChain.value = chainKey;
    updateChainSelectVisual(sendChain, sendChainSelectIcon, sendChainSelectText, "send");
  }
  openSend();
}

function closeSend() {
  if (sendSheet.contains(document.activeElement)) document.activeElement.blur();
  sendSheet.classList.remove("is-open");
  sendSheet.setAttribute("aria-hidden", "true");
}

function toggleTheme() {
  const nextTheme = wallet?.theme === "light" ? "dark" : "light";
  wallet = { ...wallet, theme: nextTheme };
  render();
  saveWallet({ theme: nextTheme }).catch(() => showToast("Theme save failed"));
}

settingsButton.addEventListener("click", openSettings);
settingsScrim.addEventListener("click", closeSettings);
settingsClose.addEventListener("click", closeSettings);
sendButton.addEventListener("click", openSend);
sendScrim.addEventListener("click", closeSend);
sendClose.addEventListener("click", closeSend);
themeToggle.addEventListener("click", toggleTheme);
themeInSettings.addEventListener("click", toggleTheme);

displayChainInput.addEventListener("change", () => {
  updateChainSelectVisual(displayChainInput, displayChainSelectIcon, displayChainSelectText);
});

sendChain.addEventListener("change", () => {
  updateChainSelectVisual(sendChain, sendChainSelectIcon, sendChainSelectText, "send");
});

settingsForm.addEventListener("input", () => {
  const chainBalances = getChainBalances(wallet);
  chainBalanceInputs.querySelectorAll("[data-chain-balance]").forEach((input) => {
    chainBalances[input.dataset.chainBalance] = Number(input.value) || 0;
  });
  const chainAddresses = getChainAddresses(wallet);
  chainAddressInputs.querySelectorAll("[data-chain-address]").forEach((input) => {
    chainAddresses[input.dataset.chainAddress] = input.value.trim();
  });

  wallet = {
    ...wallet,
    displayName: displayNameInput.value.trim() || "USDT Tron",
    displayChain: displayChainInput.value,
    accentTheme: accentInput.value,
    chainBalances,
    balance: getTotalBalance(chainBalances),
    usdPrice: Number(priceInput.value) || 0,
    chainAddresses,
    address: chainAddresses.TRX || wallet.address || "",
  };
  render(false);
});

settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
});

settingsForm.addEventListener("change", () => {
  const chainBalances = getChainBalances(wallet);
  const chainAddresses = getChainAddresses(wallet);
  saveWallet({
    displayName: displayNameInput.value.trim() || "USDT Tron",
    displayChain: displayChainInput.value,
    accentTheme: accentInput.value,
    chainBalances,
    usdPrice: Number(priceInput.value) || 0,
    chainAddresses,
    address: chainAddresses.TRX || "",
  }).catch(() => showToast("Save failed"));
});

historyButton.addEventListener("click", () => {
  historyPanel.hidden = !historyPanel.hidden;
});

scanAddress.addEventListener("click", () => {
  showToast("Scanner placeholder");
  if (supportsTelegramVersion("6.1")) tg?.HapticFeedback?.impactOccurred?.("light");
});

pasteAddress.addEventListener("click", async () => {
  try {
    const value = await readClipboardText();
    if (!value.trim()) {
      showToast("Clipboard empty");
      return;
    }
    sendAddress.value = value.trim();
  } catch {
    showToast("Paste manually");
  }
});

sendMax.addEventListener("click", () => {
  const chainBalances = getChainBalances(wallet);
  sendAmount.value = formatInputAmount(chainBalances[sendChain.value] || 0);
});

sendForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const amount = Number(sendAmount.value);
  const toAddress = sendAddress.value.trim();
  if (!toAddress) {
    showToast("Paste address first");
    return;
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    showToast("Enter amount");
    return;
  }

  sendSubmit.disabled = true;
  sendSubmit.textContent = "Sending...";
  sendStatus.textContent = "Sending on network. This takes a few seconds.";

  try {
    const transfer = await sendTransfer({
      chain: sendChain.value,
      toAddress,
      amount,
      fromAddress: getChainAddresses(wallet)[sendChain.value] || "",
    });
    sendStatus.textContent = `${formatAmount(transfer.amount, 4)} USDT sent`;
    transferHistory.unshift({
      id: transfer.id || `${Date.now()}`,
      chain: transfer.chain,
      label: transfer.chainLabel || chainMap.get(transfer.chain)?.network || transfer.chain,
      amount: transfer.amount,
      createdAt: Date.now(),
    });
    transferHistory = transferHistory.slice(0, 12);
    saveTransferHistory();
    renderHistory();
    sendAmount.value = "";
    sendAddress.value = "";
    showToast("Transfer sent");
    telegramHaptic("success");
    setTimeout(closeSend, 900);
  } catch (error) {
    sendStatus.textContent = error.message || "Transfer failed";
    showToast(error.message || "Transfer failed");
    telegramHaptic("error");
  } finally {
    sendSubmit.disabled = false;
    sendSubmit.textContent = "Send";
  }
});

tg?.ready?.();
tg?.expand?.();

refreshUsdtPrice().catch(() => {});

loadWallet().catch(() => {
  wallet = {
    asset: "USDT",
    network: "Tron",
    standard: "TRC20",
    displayName: "USDT Tron",
    balance: 0,
    chainBalances: {
      TRX: 0,
      ETH: 0,
      BNB: 0,
      SOL: 0,
      ARB: 0,
      BASE: 0,
    },
    chainAddresses: {
      TRX: "TQ9fX7p2xVZ7dUEUuW8o3rhTRC20DemoWallet9",
      ETH: "0xe24690000000000000000000000000006c81935",
      BNB: "0xe24690000000000000000000000000006c81935",
      SOL: "Hjodm6QTrustWalletDemoSolanaAddresssS8zTLH",
      ARB: "0xe24690000000000000000000000000006c81935",
      BASE: "0xe24690000000000000000000000000006c81935",
    },
    usdPrice: 1,
    address: "TQ9fX7p2xVZ7dUEUuW8o3rhTRC20DemoWallet9",
    theme: "dark",
    displayChain: "TRX",
    accentTheme: "green",
  };
  render();
  showToast("Backend offline");
});

setInterval(() => {
  refreshUsdtPrice().catch(() => {});
}, 60000);
