const OTP_REGEXES = [
  /\b(\d{6})\b/g,
  /code[:\s]+(\d{6})/gi,
  /otp[:\s]+(\d{6})/gi,
];

export function extractOtpCodesFromText(content: string) {
  const matches = new Set<string>();

  for (const regex of OTP_REGEXES) {
    for (const match of content.matchAll(regex)) {
      if (match[1]) {
        matches.add(match[1]);
      }
    }
  }

  return Array.from(matches);
}
