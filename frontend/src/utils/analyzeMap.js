/**
 * Recovery analysis that runs entirely in the browser (replaces the old Gemini call).
 * Output is plain text with **bold** markers, rendered by the Header's analysis panel.
 */

const TYPE_LABEL = { MAIL: "email", PHONE: "SMS", AUTH: "authenticator" };

const describe = (identity) => `${identity.value} (${TYPE_LABEL[identity.type] ?? "method"})`;

const listNames = (accounts, max = 6) => {
  const names = accounts.map((a) => a.name);
  return names.length > max ? `${names.slice(0, max).join(", ")} and ${names.length - max} more` : names.join(", ");
};

export const analyzeMap = ({ accounts, identities, links }) => {
  if (accounts.length === 0) {
    return "Your map is empty.\nAdd a few accounts and the ways you recover them, then run the analysis again.";
  }

  const accountsById = new Map(accounts.map((a) => [a.id, a]));
  const identitiesById = new Map(identities.map((i) => [i.id, i]));
  const methodsByAccount = new Map(accounts.map((a) => [a.id, []]));
  const accountsByIdentity = new Map(identities.map((i) => [i.id, []]));

  for (const { accountId, identityId } of links) {
    const account = accountsById.get(accountId);
    const identity = identitiesById.get(identityId);
    if (!account || !identity) continue;
    methodsByAccount.get(accountId).push(identity);
    accountsByIdentity.get(identityId).push(account);
  }

  const unprotected = accounts.filter((a) => methodsByAccount.get(a.id).length === 0);
  const singleMethod = accounts.filter((a) => methodsByAccount.get(a.id).length === 1);
  const smsOnly = singleMethod.filter((a) => methodsByAccount.get(a.id)[0].type === "PHONE");
  const redundant = accounts.length - unprotected.length - singleMethod.length;

  // A method is a single point of failure for every account where it's the only way back in.
  const hubs = identities
    .map((identity) => ({
      identity,
      total: accountsByIdentity.get(identity.id),
      soleFor: accountsByIdentity.get(identity.id).filter((a) => methodsByAccount.get(a.id).length === 1),
    }))
    .filter((h) => h.total.length > 0)
    .sort((a, b) => b.soleFor.length - a.soleFor.length || b.total.length - a.total.length);

  const lines = [];
  lines.push(
    `**Summary:** ${accounts.length} accounts, ${identities.length} recovery methods. ` +
      `${redundant} accounts have a backup method, ${singleMethod.length} rely on just one, ` +
      `${unprotected.length} have none listed.`,
  );

  const worst = hubs.find((h) => h.soleFor.length > 0);
  if (worst) {
    lines.push(
      `**Biggest single point of failure:** ${describe(worst.identity)}. ` +
        `Losing it locks you out of ${worst.soleFor.length} account${worst.soleFor.length === 1 ? "" : "s"}: ` +
        `${listNames(worst.soleFor)}. Add a second recovery method to these first.`,
    );
  }

  for (const hub of hubs.filter((h) => h !== worst && h.soleFor.length >= 2).slice(0, 2)) {
    lines.push(
      `**Also risky:** ${describe(hub.identity)} is the only way back into ${listNames(hub.soleFor)}.`,
    );
  }

  const busiest = [...hubs].sort((a, b) => b.total.length - a.total.length)[0];
  if (busiest && busiest.total.length >= Math.max(5, accounts.length * 0.4)) {
    lines.push(
      `**Concentration:** ${describe(busiest.identity)} can recover ${busiest.total.length} of your ` +
        `${accounts.length} accounts. If someone takes it over, they can reset passwords on all of them, ` +
        `so protect it with an authenticator app or security key.`,
    );
  }

  if (smsOnly.length > 0) {
    lines.push(
      `**SMS-only recovery:** ${listNames(smsOnly)} can only be recovered by text message. ` +
        `SIM-swap attacks make SMS the weakest option; add an email or authenticator as well.`,
    );
  }

  if (unprotected.length > 0) {
    lines.push(
      `**No recovery method listed:** ${listNames(unprotected)}. ` +
        `Check how you'd get back into these and add it to the map.`,
    );
  }

  if (!worst && smsOnly.length === 0 && unprotected.length === 0) {
    lines.push("**Looking good:** every account has at least two ways back in.");
  }

  lines.push("This analysis ran in your browser. Your map is never uploaded.");
  return lines.join("\n");
};
