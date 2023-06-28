import { FormEvent, ReactNode, useState } from "react";
import { Title } from "./components/title";
import { EssayAnalysis } from "./essay-analysis";
import { getEssayAnalysis } from "./essay-analysis/api";
import { Debug } from "./components/debug";

export function IndexPage() {
  const [analysis, setAnalysis] = useState<null | EssayAnalysis>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const text = formData.get("essay") as string;
    try {
      const essayAnalysis = await getEssayAnalysis(text);
      setAnalysis(essayAnalysis);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const lemmas = Object.keys(analysis?.repeatedWords.counter ?? {});
  const lemmasRepeatedMoreThanOnce = [];
  lemmas.forEach((lemma) => {
    const count = analysis?.repeatedWords.counter[lemma]!;
    if (count > 1) lemmasRepeatedMoreThanOnce.push(lemma);
  });

  return (
    <>
      <form onSubmit={onSubmit} className="h-screen flex space-x-5">
        <div className="w-3/5 p-5 pr-0">
          <textarea
            name="essay"
            placeholder="Paste your essay here"
            className="w-full h-full text-lg form-field focus:form-field-focus-ring resize-none"
          >In order to leverage this skills, Jon leveraged his computer's powers to harness the true power of teamwork.
          Leveraging the skills, the team harnessed true knowledge.</textarea>
        </div>
        <aside className="py-5 pr-5 overflow-y-scroll flex-grow space-y-5">
          <button
            disabled={loading}
            type="submit"
            className="w-full font-semibold flex items-center align-start p-3 rounded-md bg-primary-600 text-gray-200"
          >
            {loading ? "Loading ..." : "Analyze"}
          </button>

          <InfoBlock title="Readability"></InfoBlock>
          <InfoBlock title="Repeated words">
            <Title level={3}>Words repeated more than once:</Title>
            {lemmasRepeatedMoreThanOnce.map((word) => {
              return (
                <div>
                  {word}: {analysis?.repeatedWords.counter[word]} times
                </div>
              );
            })}
          </InfoBlock>

          {analysis && (
            <section>
              <Debug data={analysis} />
            </section>
          )}
        </aside>
      </form>
    </>
  );
}

function InfoBlock({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <section className="border rounded-md p-3">
      <Title level={2}>{title}</Title>
      {children && <div className="mt-2">{children}</div>}
    </section>
  );
}
