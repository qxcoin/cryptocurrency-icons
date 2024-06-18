import fs from 'node:fs/promises';

const params = {
  columns: ["base_currency", "base_currency_logoid"],
  sort: { nullsFirst: false, sortBy: "crypto_total_rank", sortOrder: "asc" },
};
const res = await fetch('https://scanner.tradingview.com/coin/scan', {
  method: 'POST',
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(params),
});

console.log('Fetching currency data...');

const result = await res.json();

for (const data of result.data) {
  const currencyCode = data.d[0];
  const logoId = data.d[1];
  console.log(`Fetching logo for: ${currencyCode}`);
  const svg = await fetchLogo(logoId);
  await writeLogo(currencyCode, svg);
}

async function fetchLogo(logoId) {
  const res = await fetch(`https://s3-symbol-logo.tradingview.com/${logoId}.svg`);
  return await res.text();
}

async function writeLogo(currencyCode, svg) {
  await fs.writeFile(`./icons/${currencyCode}.svg`, svg);
}
