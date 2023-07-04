import { RawEssayAnalysis } from ".";

export async function getRawEssayAnalysis(text: string) {
  const response = await fetch(`https://essay-analyzer.vercel.app/api?sentence=${encodeURIComponent(text)}`);
  const output = (await response.json()) as RawEssayAnalysis;
  return output;
}
