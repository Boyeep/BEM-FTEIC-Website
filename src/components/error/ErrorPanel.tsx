import type { ReactNode } from "react";

type ErrorPanelProps = {
  title: string;
  description: string;
  action?: ReactNode;
  iconVariant?: "notFound" | "serverError" | "forbidden" | "serviceUnavailable";
  titleAs?: "h1" | "h2";
  containerClassName?: string;
  panelClassName?: string;
};

function ErrorIcon({
  variant,
}: {
  variant: NonNullable<ErrorPanelProps["iconVariant"]>;
}) {
  return (
    <div className="relative h-36 w-36 bg-[#D9D9D9] shadow-[0_12px_0_0_rgba(0,0,0,0.12)] md:h-40 md:w-40">
      {variant === "notFound" ? (
        <>
          <div className="absolute left-[25%] top-[18%] h-[34%] w-[16%] bg-[#2450DB]" />
          <div className="absolute left-[25%] top-[45%] h-[14%] w-[44%] bg-[#2450DB]" />
          <div className="absolute left-[53%] top-[18%] h-[58%] w-[16%] bg-[#2450DB]" />
        </>
      ) : variant === "serverError" ? (
        <>
          <div className="absolute left-[25%] top-[22%] h-[18%] w-[18%] bg-[#2450DB]" />
          <div className="absolute left-[57%] top-[22%] h-[18%] w-[18%] bg-[#2450DB]" />
          <div className="absolute left-[25%] top-[54%] h-[18%] w-[50%] bg-[#2450DB]" />
        </>
      ) : variant === "serviceUnavailable" ? (
        <div className="absolute left-[25%] top-[40%] h-[18%] w-[50%] bg-[#2450DB]" />
      ) : (
        <>
          <div className="absolute left-[24%] top-[20%] h-[18%] w-[18%] bg-[#2450DB]" />
          <div className="absolute left-[41%] top-[37%] h-[18%] w-[18%] bg-[#2450DB]" />
          <div className="absolute left-[58%] top-[20%] h-[18%] w-[18%] bg-[#2450DB]" />
          <div className="absolute left-[24%] top-[54%] h-[18%] w-[18%] bg-[#2450DB]" />
          <div className="absolute left-[58%] top-[54%] h-[18%] w-[18%] bg-[#2450DB]" />
        </>
      )}
    </div>
  );
}

export default function ErrorPanel({
  title,
  description,
  action,
  iconVariant = "serverError",
  titleAs = "h2",
  containerClassName,
  panelClassName,
}: ErrorPanelProps) {
  const TitleTag = titleAs;

  return (
    <div
      className={
        containerClassName ||
        "fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#2450DB] px-6 py-10"
      }
    >
      <section
        className={
          panelClassName ||
          "flex w-full items-center justify-center px-6 py-14 md:px-10"
        }
      >
        <div className="flex flex-col items-center text-center text-white">
          <ErrorIcon variant={iconVariant} />

          <TitleTag className="mt-5 text-4xl font-extrabold tracking-tight md:text-5xl">
            {title}
          </TitleTag>
          <p className="mt-3 text-2xl font-medium md:text-3xl">{description}</p>
          {action ? <div className="mt-8">{action}</div> : null}
        </div>
      </section>
    </div>
  );
}
