import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

type ErrorPanelProps = {
  title: string;
  description: string;
  action: ReactNode;
  titleAs?: "h1" | "h2";
  containerClassName?: string;
  cardClassName?: string;
  iconSize?: number;
  actionSpacingClassName?: string;
};

export default function ErrorPanel({
  title,
  description,
  action,
  titleAs = "h2",
  containerClassName,
  cardClassName,
  iconSize = 40,
  actionSpacingClassName = "mb-8",
}: ErrorPanelProps) {
  const TitleTag = titleAs;

  return (
    <div
      className={
        containerClassName ||
        "flex min-h-screen w-screen flex-col items-center justify-center bg-slate-50 p-4 text-center"
      }
    >
      <div
        className={
          cardClassName ||
          "flex max-w-md flex-col items-center rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-200"
        }
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-500">
          <AlertTriangle size={iconSize} />
        </div>
        <TitleTag className="mb-2 text-3xl font-bold text-slate-800">
          {title}
        </TitleTag>
        <p className={`${actionSpacingClassName} text-slate-600`}>
          {description}
        </p>
        {action}
      </div>
    </div>
  );
}
