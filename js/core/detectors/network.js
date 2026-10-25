/** IP and MAC addresses. MAC runs before IPv6 so it isn't mislabelled. */

export const ipv4 = {
  id: "ipv4", label: "IP", cat: "network",
  re: /\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g,
};

export const mac = {
  id: "mac", label: "MAC", cat: "network",
  re: /\b(?:[0-9A-F]{2}[:-]){5}[0-9A-F]{2}\b/gi,
};

export const ipv6 = {
  id: "ipv6", label: "IP", cat: "network",
  re: /\b(?:[0-9a-f]{1,4}:){4,7}[0-9a-f]{1,4}\b/gi,
};
