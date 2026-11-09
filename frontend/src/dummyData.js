/**
 * Sample map loaded on a visitor's first visit (and after "Reset Demo").
 * A made-up student / early-career person, with a few realistic risks built in
 * so the Analyze button has something to find:
 *  - most accounts recover through one Gmail address
 *  - several money and social apps recover by SMS only
 *  - school accounts tied to a university email that goes away after graduation
 *  - old accounts with no recovery method at all
 */

export const sampleIdentities = [
  { id: "gmail", type: "MAIL", value: "alex.rivera@gmail.com" },
  { id: "icloud", type: "MAIL", value: "alex.r@icloud.com" },
  { id: "school", type: "MAIL", value: "rivera.12@university.edu" },
  { id: "phone", type: "PHONE", value: "+1 (555) 201-4477" },
  { id: "totp", type: "AUTH", value: "Google Authenticator" },
  { id: "yubikey", type: "AUTH", value: "YubiKey 5C" },
];

// recovery: ids of the identities that can get you back into the account
export const sampleAccounts = [
  // Core accounts that protect everything else
  { name: "Google", username: "alex.rivera", recovery: ["phone", "icloud", "yubikey"], notes: "Gmail, YouTube, Drive" },
  { name: "Apple", username: "alex.r@icloud.com", recovery: ["phone", "yubikey"], notes: "Apple ID, iCloud backups" },
  { name: "Microsoft", username: "alex.rivera@outlook.com", recovery: ["gmail"] },

  // Money
  { name: "Chase", username: "arivera", recovery: ["gmail", "phone", "totp"], notes: "Checking + credit card" },
  { name: "Bank of America", username: "alexr_boa", recovery: ["phone"] },
  { name: "Venmo", username: "@alex-rivera", recovery: ["phone"] },
  { name: "Cash App", username: "$alexr", recovery: ["phone"] },
  { name: "PayPal", username: "alex.rivera@gmail.com", recovery: ["gmail", "totp"] },
  { name: "Robinhood", username: "alex.rivera@gmail.com", recovery: ["gmail", "totp"] },
  { name: "Coinbase", username: "alex.rivera@gmail.com", recovery: ["yubikey", "totp"] },

  // Social
  { name: "Instagram", username: "@alex.rvr", recovery: ["gmail"] },
  { name: "Facebook", username: "alex.rivera.92", recovery: ["gmail", "phone"] },
  { name: "X", username: "@alexrvr", recovery: ["gmail"] },
  { name: "TikTok", username: "@alexrvr", recovery: ["phone"] },
  { name: "Snapchat", username: "alexr_snaps", recovery: ["phone"] },
  { name: "Reddit", username: "u/quietcompiler", recovery: ["gmail"] },
  { name: "Discord", username: "alexr#2207", recovery: ["gmail", "totp"] },
  { name: "LinkedIn", username: "alex-rivera-dev", recovery: ["school"], notes: "Signed up with school email" },
  { name: "WhatsApp", username: "+1 (555) 201-4477", recovery: ["phone"] },

  // Streaming
  { name: "Netflix", username: "alex.rivera@gmail.com", recovery: ["gmail"] },
  { name: "Spotify", username: "alexrivera", recovery: ["gmail"], notes: "Student discount via school email" },
  { name: "Disney Plus", username: "alex.rivera@gmail.com", recovery: ["gmail"] },
  { name: "Hulu", username: "alex.rivera@gmail.com", recovery: ["gmail"] },
  { name: "Twitch", username: "quietcompiler", recovery: ["gmail", "totp"] },

  // Shopping & everyday
  { name: "Amazon", username: "alex.rivera@gmail.com", recovery: ["gmail", "phone"] },
  { name: "eBay", username: "alexr_deals", recovery: ["gmail"] },
  { name: "Uber", username: "+1 (555) 201-4477", recovery: ["phone"] },
  { name: "DoorDash", username: "alex.rivera@gmail.com", recovery: ["gmail", "phone"] },
  { name: "Airbnb", username: "alex.rivera@gmail.com", recovery: ["gmail"] },

  // Gaming
  { name: "Steam", username: "quietcompiler", recovery: ["gmail", "totp"] },
  { name: "Epic Games", username: "QuietCompiler", recovery: ["gmail"] },
  { name: "PlayStation", username: "QuietCompiler_", recovery: ["gmail"] },
  { name: "Xbox", username: "QuietCompiler", recovery: ["gmail"], notes: "Uses the Microsoft account" },

  // School & work
  { name: "Canvas", username: "rivera.12", recovery: ["school"] },
  { name: "Handshake", username: "rivera.12@university.edu", recovery: ["school"], notes: "Job applications" },
  { name: "GitHub", username: "alexrivera-dev", recovery: ["gmail", "totp", "yubikey"] },
  { name: "Slack", username: "rivera.12@university.edu", recovery: ["school"] },
  { name: "Notion", username: "alex.rivera@gmail.com", recovery: ["gmail"] },
  { name: "Dropbox", username: "alex.rivera@gmail.com", recovery: ["gmail"] },

  // Forgotten accounts with no recovery method
  { name: "Yahoo", username: "alexr_2009", recovery: [], notes: "Old account, recovery email long gone" },
  { name: "Tumblr", username: "pixel-alex", recovery: [] },
];
