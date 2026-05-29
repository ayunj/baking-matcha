type IngPart = { type: "text" | "num"; val: string };

export function parseIng(text: string): IngPart[] {
  const parts: IngPart[] = [];
  const re = /(\d+\/\d+|\d+\.?\d*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: "text", val: text.slice(last, m.index) });
    parts.push({ type: "num", val: m[0] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ type: "text", val: text.slice(last) });
  return parts;
}

function scaleNum(str: string, mult: number): string {
  const n = str.includes("/")
    ? str.split("/").reduce<number>((a, b) => a / Number(b), Number(str.split("/")[0]))
    : parseFloat(str);
  const s = n * mult;
  return Number.isInteger(s) ? String(s) : parseFloat(s.toFixed(2)).toString();
}

export function scaleText(text: string, mult: number): string {
  return parseIng(text)
    .map((p) => (p.type === "num" ? scaleNum(p.val, mult) : p.val))
    .join("");
}

export function ingNameOnly(text: string): string {
  return (
    parseIng(text)
      .filter((p) => p.type === "text")
      .map((p) => p.val)
      .join("")
      .trim() || text
  );
}
