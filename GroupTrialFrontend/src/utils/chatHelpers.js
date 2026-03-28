export function getGroupId(group) {
  const derivedId = group?.id ?? group?.groupId ?? group?.name ?? "";
  return String(derivedId);
}

export function getGroupName(group) {
  return group?.name ?? group?.groupName ?? `Group ${getGroupId(group)}`;
}

export function getGroupInitials(groupName) {
  const words = String(groupName ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) {
    return "GR";
  }

  const first = words[0][0] ?? "";
  const second = words.length > 1 ? words[1][0] ?? "" : words[0][1] ?? "";
  return `${first}${second}`.toUpperCase();
}

export function hashToHue(value) {
  const input = String(value ?? "");
  let hash = 0;

  for (let index = 0; index < input.length; index += 1) {
    hash = input.charCodeAt(index) + ((hash << 5) - hash);
  }

  return Math.abs(hash) % 360;
}

export function getGroupGradient(group) {
  const seed = `${getGroupId(group)}-${getGroupName(group)}`;
  const hue = hashToHue(seed);
  const secondHue = (hue + 52) % 360;
  return `linear-gradient(135deg, hsl(${hue} 78% 58%), hsl(${secondHue} 86% 66%))`;
}

export function formatHHMM(timestamp) {
  if (!timestamp) {
    return "--:--";
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

function toEpochMilliseconds(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return null;
  }

  // Support both seconds and milliseconds epoch payloads.
  return numeric < 1_000_000_000_000 ? numeric * 1000 : numeric;
}

function ensureIsoWithTimezone(value) {
  let candidate = String(value ?? "").trim();
  if (!candidate) {
    return "";
  }

  // Some backends send "YYYY-MM-DD HH:mm:ss.SSSSSS".
  candidate = candidate.replace(" ", "T");

  // JS Date parsing is safer with milliseconds precision.
  candidate = candidate.replace(/(\.\d{3})\d+/, "$1");

  // If timezone is missing, treat timestamp as UTC.
  if (/^\d{4}-\d{2}-\d{2}T/.test(candidate) && !/(Z|[+-]\d{2}:\d{2})$/i.test(candidate)) {
    candidate = `${candidate}Z`;
  }

  return candidate;
}

export function normalizeTimestamp(rawTimestamp) {
  if (rawTimestamp === null || rawTimestamp === undefined || rawTimestamp === "") {
    return new Date().toISOString();
  }

  if (rawTimestamp instanceof Date) {
    const ms = rawTimestamp.getTime();
    return Number.isNaN(ms) ? new Date().toISOString() : rawTimestamp.toISOString();
  }

  if (typeof rawTimestamp === "number") {
    const epochMs = toEpochMilliseconds(rawTimestamp);
    if (epochMs === null) {
      return new Date().toISOString();
    }
    return new Date(epochMs).toISOString();
  }

  const timestampText = String(rawTimestamp).trim();
  if (!timestampText) {
    return new Date().toISOString();
  }

  if (/^\d+$/.test(timestampText)) {
    const epochMs = toEpochMilliseconds(timestampText);
    if (epochMs !== null) {
      return new Date(epochMs).toISOString();
    }
  }

  const isoCandidate = ensureIsoWithTimezone(timestampText);
  const parsed = new Date(isoCandidate);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }

  const looseParsed = new Date(timestampText);
  if (!Number.isNaN(looseParsed.getTime())) {
    return looseParsed.toISOString();
  }

  return new Date().toISOString();
}

export function uniqueSortedMessages(messages) {
  const map = new Map();

  for (const item of messages) {
    if (!item || !item.id) {
      continue;
    }
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  }

  const merged = Array.from(map.values());
  merged.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  return merged;
}

export function mergeOlderMessages(existing, older) {
  if (!Array.isArray(older) || older.length === 0) {
    return existing;
  }
  return uniqueSortedMessages([...older, ...existing]);
}

export function mergeIncomingMessage(existing, incoming) {
  if (!incoming || !incoming.id) {
    console.warn("[mergeIncomingMessage] Invalid incoming message:", incoming);
    return existing;
  }

  const foundIndex = existing.findIndex((m) => m.id === incoming.id);
  if (foundIndex >= 0) {
    console.log("[mergeIncomingMessage] Replacing existing message:", incoming.id);
    const next = [...existing];
    next[foundIndex] = incoming;
    return uniqueSortedMessages(next);
  }

  console.log("[mergeIncomingMessage] Adding new message:", incoming.id);
  return uniqueSortedMessages([...existing, incoming]);
}

export function normalizeMessage(rawMessage, fallbackGroupId = "") {
  const timestamp = normalizeTimestamp(rawMessage?.timestamp ?? rawMessage?.createdAt);
  const normalizedSender = String(rawMessage?.sender ?? rawMessage?.senderId ?? "Unknown").trim();
  const normalizedContent = String(rawMessage?.content ?? rawMessage?.message ?? "").trim();
  const clientMessageId = rawMessage?.clientMessageId;
  const messageId = rawMessage?.id ?? rawMessage?.messageId;

  // Ensure we have a stable, non-empty sender
  if (!normalizedSender || normalizedSender === "Unknown") {
    console.warn("[normalizeMessage] Empty sender detected:", rawMessage);
  }

  return {
    id:
      messageId ??
      clientMessageId ??
      `${normalizedSender}-${fallbackGroupId}-${timestamp}-${normalizedContent.slice(0, 40)}`,
    sender: normalizedSender,
    content: normalizedContent,
    groupId: String(rawMessage?.groupId ?? fallbackGroupId),
    roles: rawMessage?.roles ?? rawMessage?.role ?? "USER",
    timestamp,
    clientMessageId
  };
}
