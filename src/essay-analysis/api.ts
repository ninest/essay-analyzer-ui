import { EssayAnalysis } from ".";

export async function getEssayAnalysis(text: string) {
  const response = await fetch(`https://essay-analyzer.vercel.app/api?sentence=${encodeURIComponent(text)}`);
  const output = (await response.json()) as EssayAnalysis;
  return output;
}
