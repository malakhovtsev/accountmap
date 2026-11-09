/**
 * Browser-local replacement for the old Express + Postgres API.
 *
 * Every visitor gets their own map, saved in this browser's localStorage.
 * Nothing is sent to a server. The data is NOT encrypted, so the demo
 * still warns people not to enter real accounts.
 *
 * getMap() returns the same shape the old GET /api/identities/map did,
 * so the rest of the UI didn't have to change.
 */
import { sampleIdentities, sampleAccounts } from "../dummyData";

const STORAGE_KEY = "accountmap-demo-v1";
const VALID_TYPES = ["MAIL", "PHONE", "AUTH"];

// Keeps the force graph responsive; there is no database to protect anymore.
export const MAX_ACCOUNTS = 500;
export const MAX_IDENTITIES = 100;

const newId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const buildSeed = () => {
  const identities = sampleIdentities.map((i) => ({ ...i, notes: null }));
  const accounts = [];
  const links = [];
  sampleAccounts.forEach(({ recovery, ...acc }, index) => {
    const id = `sample-${index + 1}`;
    accounts.push({ id, name: acc.name, username: acc.username ?? null, notes: acc.notes ?? null, categories: [] });
    for (const identityId of recovery) links.push({ accountId: id, identityId });
  });
  return { accounts, identities, links };
};

let memoryFallback = null;

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed?.accounts) && Array.isArray(parsed?.identities) && Array.isArray(parsed?.links)) {
        return parsed;
      }
    }
  } catch {
    // Private mode, blocked storage, or corrupted JSON: fall through.
  }
  return memoryFallback ?? (memoryFallback = buildSeed());
};

const save = (db) => {
  memoryFallback = db;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // Storage unavailable: keep working in memory for this tab.
  }
};

const fail = (message) => {
  throw new Error(message);
};

export const getMap = () => {
  const db = load();
  const accountsById = new Map(db.accounts.map((a) => [a.id, a]));
  const linkedAccountIds = new Set(db.links.map((l) => l.accountId));

  const response = db.identities.map((identity) => ({
    ...identity,
    connections: db.links
      .filter((l) => l.identityId === identity.id)
      .map((l) => accountsById.get(l.accountId))
      .filter(Boolean),
  }));

  // Same trick as the old API: a blank "identity" holding accounts with no recovery method.
  response.push({
    id: "",
    value: "",
    type: "",
    notes: null,
    connections: db.accounts.filter((a) => !linkedAccountIds.has(a.id)),
  });

  return response;
};

export const addAccount = ({ name, username, notes }) => {
  const db = load();
  const cleanName = String(name ?? "").trim();
  if (!cleanName) fail("Field 'name' is required.");
  if (db.accounts.length >= MAX_ACCOUNTS) fail(`Demo limit: ${MAX_ACCOUNTS} accounts.`);

  const cleanUser = username ? String(username).trim() : null;
  if (db.accounts.some((a) => a.name === cleanName && a.username === cleanUser)) {
    fail("Account already exists");
  }

  const account = { id: newId(), name: cleanName, username: cleanUser, notes: notes || null, categories: [] };
  save({ ...db, accounts: [...db.accounts, account] });
  return { message: "Account Created Successfully", account };
};

export const addIdentity = ({ value, type }) => {
  const db = load();
  const cleanValue = String(value ?? "").trim();
  const cleanType = String(type ?? "").toUpperCase();
  if (!cleanValue) fail("Missing required field: value");
  if (!VALID_TYPES.includes(cleanType)) fail(`Invalid type. Must be one of: ${VALID_TYPES.join(", ")}`);
  if (db.identities.length >= MAX_IDENTITIES) fail(`Demo limit: ${MAX_IDENTITIES} connections.`);
  if (db.identities.some((i) => i.type === cleanType && i.value === cleanValue)) {
    fail("Identity already exists");
  }

  const identity = { id: newId(), value: cleanValue, type: cleanType, notes: null };
  save({ ...db, identities: [...db.identities, identity] });
  return { message: "Identity created", ...identity };
};

export const linkAccount = ({ accountId, identityId }) => {
  const db = load();
  if (!db.accounts.some((a) => a.id === accountId)) fail("Account not found");
  if (!db.identities.some((i) => i.id === identityId)) fail("Identity not found");
  if (db.links.some((l) => l.accountId === accountId && l.identityId === identityId)) {
    fail("Connection already exists");
  }

  save({ ...db, links: [...db.links, { accountId, identityId }] });
  return { message: "Connection added", accountId, identityId };
};

export const deleteAccount = (accountId) => {
  const db = load();
  save({
    ...db,
    accounts: db.accounts.filter((a) => a.id !== accountId),
    links: db.links.filter((l) => l.accountId !== accountId),
  });
  return { message: "Account deleted", id: accountId };
};

export const deleteIdentity = (identityId) => {
  const db = load();
  save({
    ...db,
    identities: db.identities.filter((i) => i.id !== identityId),
    links: db.links.filter((l) => l.identityId !== identityId),
  });
  return { message: "Identity deleted", id: identityId };
};

export const bulkAddAccounts = (rows) => {
  if (!Array.isArray(rows)) fail("Request must be an array");
  const db = load();
  const existing = new Set(db.accounts.map((a) => `${a.name}\u0000${a.username}`));
  const spaceLeft = Math.max(0, MAX_ACCOUNTS - db.accounts.length);
  if (spaceLeft === 0) fail(`Demo limit: ${MAX_ACCOUNTS} accounts. Reset the demo to start over.`);

  const created = [];
  let duplicates = 0;
  for (const row of rows) {
    const name = String(row?.name ?? "").trim();
    if (!name || name.toLowerCase() === "undefined") continue;
    const username = row.username ? String(row.username).trim() : null;
    const key = `${name}\u0000${username}`;
    if (existing.has(key)) {
      duplicates++;
      continue;
    }
    if (created.length >= spaceLeft) break;
    existing.add(key);
    created.push({ id: newId(), name, username, notes: null, categories: [] });
  }

  save({ ...db, accounts: [...db.accounts, ...created] });
  const skipped = rows.length - created.length;
  return {
    message:
      `Imported ${created.length} accounts.` +
      (skipped > 0
        ? ` Skipped ${skipped}: ${duplicates} already in your map, the rest blank or over the ${MAX_ACCOUNTS}-account demo limit.`
        : ""),
    count: created.length,
  };
};

export const resetDemo = () => {
  memoryFallback = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
};

/** Raw normalized data, used by the in-browser analysis. */
export const getDb = () => load();
