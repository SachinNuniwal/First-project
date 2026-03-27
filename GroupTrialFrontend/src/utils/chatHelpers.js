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

export function normalizeMessage(rawMessage, fallbackGroupId = "") {
  const timestamp = rawMessage?.timestamp ?? rawMessage?.createdAt ?? new Date().toISOString();
  const normalizedSender = rawMessage?.sender ?? rawMessage?.senderId ?? "Unknown";
  const normalizedContent = rawMessage?.content ?? rawMessage?.message ?? "";
  const clientMessageId = rawMessage?.clientMessageId;

  return {
    id:
      rawMessage?.id ??
      rawMessage?.messageId ??
      clientMessageId ??
      `${normalizedSender}-${fallbackGroupId}-${timestamp}-${String(normalizedContent).slice(0, 40)}`,
    sender: normalizedSender,
    content: normalizedContent,
    groupId: String(rawMessage?.groupId ?? fallbackGroupId),
    roles: rawMessage?.roles ?? rawMessage?.role ?? "USER",
    timestamp,
    clientMessageId
  };
}
