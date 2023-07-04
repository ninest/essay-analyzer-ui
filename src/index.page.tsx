import { ComponentProps, FormEvent, ReactNode, useState } from "react";
import { Debug } from "./components/debug";
import { Title } from "./components/title";
import { getRawEssayAnalysis } from "./essay-analysis/api";
import { EssayAnalysis, getEssayAnalysis } from "./essay-analysis/functions";

export function IndexPage() {
  const [analysis, setAnalysis] = useState<null | EssayAnalysis>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const text = formData.get("essay") as string;
    try {
      const rawEssayAnalysis = await getRawEssayAnalysis(text);
      const essayAnalysis = getEssayAnalysis(rawEssayAnalysis);
      setAnalysis(essayAnalysis);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className="h-[100dvh] flex flex-col md:flex-row md:space-x-5">
        <div className="h-[60%] p-2 md:h-full md:w-9/12 md:p-5 md:pr-0">
          <textarea
            name="essay"
            placeholder="Paste your essay here"
            className="w-full h-full text-lg form-field focus:form-field-focus-ring resize-none"
          ></textarea>
        </div>
        <aside className="h-[40%] md:h-full p-2 md:w-3/12 md:py-5 md:pr-5 overflow-y-scroll md:flex-grow space-y-5">
          <button
            disabled={loading}
            type="submit"
            className="w-full font-semibold flex items-center align-start p-3 rounded-md bg-primary-600 text-gray-200"
          >
            {loading ? "Loading ..." : "Analyze"}
          </button>

          <InfoBlock title="Readability">
            {analysis && (
              <div>
                <div>
                  <span className="font-medium">
                    {analysis.readability.fleschReadingEaseDescription.schoolLevel} level
                  </span>{" "}
                  <span className="text-gray-500">{analysis.readability.fleschReadingEaseDescription.notes}</span>
                </div>
                {/* <div>{analysis.readability.fleschReadingEase} reading ease</div> */}
              </div>
            )}
          </InfoBlock>
          <InfoBlock title="Repeated words">
            {analysis && (
              <>
                {analysis.repeatedWords.lemmasRepeatedMoreThanOnce.length === 0 ? (
                  <Blank>No repeated words</Blank>
                ) : (
                  analysis.repeatedWords.lemmasRepeatedMoreThanOnce.map((word) => {
                    const count = analysis.repeatedWords.lemmasCount[word];
                    return (
                      <DataWithCount
                        key={word}
                        title={<div className="font-mono text-sm">{word}</div>}
                        count={count}
                        countSuffix="words"
                      />
                    );
                  })
                )}
              </>
            )}
          </InfoBlock>

          <InfoBlock title="Statistics">
            {analysis && (
              <>
                <DataWithCount title={"Total sentences"} count={analysis.stats.totalSentences} />
                <DataWithCount title={"Total words"} count={analysis.stats.totalWords} />
                <DataWithCount title={"Total syllables"} count={analysis.stats.totalSyllables} />
                <hr className="my-2" />
                <DataWithCount title={"Words per sentence"} count={analysis.stats.averageWordsPerSentence} />
                <DataWithCount title={"Syllables per word"} count={analysis.stats.averageSyllablesPerWord} />
              </>
            )}
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

function DataWithCount({ title, count, countSuffix }: { title: ReactNode; count: number; countSuffix?: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="">{title}</div>
      <div className="tabular-nums">
        {count}
        {countSuffix && " " + countSuffix}
      </div>
    </div>
  );
}

function Blank({ children }: ComponentProps<"div">) {
  return <div className="italic text-gray-500 text-sm">{children}</div>;
}
