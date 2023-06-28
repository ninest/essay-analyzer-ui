import { FormEvent, useState } from "react";
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
  return (
    <>
      <form onSubmit={onSubmit} className="h-screen flex space-x-5">
        <div className="w-3/5 p-5 pr-0">
          <textarea
            name="essay"
            placeholder="Paste your essay here"
            className="w-full h-full text-lg form-field focus:form-field-focus-ring resize-none"
          />
        </div>
        <aside className="py-5 pr-5 overflow-y-scroll flex-grow space-y-5">
          <button
            disabled={loading}
            type="submit"
            className="w-full font-semibold flex items-center align-start p-3 rounded-md bg-primary-600 text-gray-200"
          >
            {loading ? "Loading ..." : "Analyze"}
          </button>
          <section className="border rounded-md p-3">
            <Title level={2}>Readability</Title>
          </section>
          <section className="border rounded-md p-3">
            <Title level={2}>Repeated words</Title>
          </section>
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
