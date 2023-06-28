import { Title } from "./components/title";

export function IndexPage() {
  return (
    <>
      <div className="p-5 h-screen flex space-x-5">
        <div className="w-3/5">
          <textarea
            placeholder="Paste your essay here"
            className="w-full h-full text-lg form-field focus:form-field-focus-ring resize-none"
          />
        </div>
        <aside className="flex-grow space-y-5">
          <section className="border rounded-md p-3">
            <Title level={2}>Readability</Title>
          </section>
          <section className="border rounded-md p-3">
            <Title level={2}>Repeated words</Title>
          </section>
        </aside>
      </div>
    </>
  );
}
