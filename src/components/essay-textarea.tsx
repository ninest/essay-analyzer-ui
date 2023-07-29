import clsx from "clsx";
import { ComponentProps, Fragment } from "react";

interface EssayTextareaProps extends ComponentProps<"textarea"> {
  containerClassName?: string;
  value: string;
  highlightedWords?: { word: string; caseSensitive: boolean }[];
}

export function EssayTextarea({
  containerClassName,
  highlightedWords = [],
  value,
  children,
  ...props
}: EssayTextareaProps) {
  const split = (str: string) => str.match(/[\w']+|[.,!?;]| +|\n|["'‘’“”%+-]/g);
  const parts = split(value);

  return (
    <div className={clsx("relative", containerClassName)}>
      {/* Highlights */}
      <div className="absolute text-lg form-field bg-transparent pointer-events-none whitespace-pre-wrap break-words">
        {/* {props.children?.toString()} */}
        {/* {split(value).map((part) => {
          const isHighlighted = highlights.some((highlight) => highlight.string === part);
          return (
            <>
              <span className={clsx({ "bg-indigo-200": isHighlighted })}>{part}</span>{" "}
            </>
          );
        })} */}
        {parts?.map((part, index) => {
          const isHighlighted = highlightedWords.some((highlight) => {
            if (highlight.caseSensitive) return part === highlight.word;
            else return part.toLowerCase() === highlight.word.toLowerCase();
          });
          return (
            <Fragment key={index}>
              <span className={clsx({ "bg-indigo-200": isHighlighted })}>{part}</span>
            </Fragment>
          );
        })}
      </div>
      <textarea
        {...props}
        className="w-full h-full text-lg form-field focus:form-field-focus-ring resize-none"
        value={value}
      />
    </div>
  );
}
