"use client";

import {
  Heading2,
  ImagePlus,
  List,
  ListOrdered,
  type LucideIcon,
} from "lucide-react";
import {
  type ChangeEvent,
  type MutableRefObject,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";

interface RichContentEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  onUploadImage: (file: File) => Promise<string>;
  disabled?: boolean;
  minHeightClass?: string;
}

const MAX_INLINE_IMAGE_SIZE = 5 * 1024 * 1024;

const GUIDE_ROWS = [
  {
    title: "Subtitle",
    snippet: "## Subtitle",
    description: "Creates a section title and adds it to the sticky side menu.",
  },
  {
    title: "Nested subtitle",
    snippet: "### Smaller Subtitle",
    description: "Creates an indented item inside the sticky side menu.",
  },
  {
    title: "Bullet list",
    snippet: "- First point",
    description: "Renders a bullet list in the article body.",
  },
  {
    title: "Numbered list",
    snippet: "1. First step",
    description: "Renders an ordered list in the article body.",
  },
  {
    title: "Image",
    snippet: "![Alt text](https://...)",
    description: "Renders an inline image between sections.",
  },
];

function buildInlineImageAlt(fileName: string) {
  const baseName = fileName.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
  const normalized = baseName.replace(/\s+/g, " ").trim();
  return normalized || "Image description";
}

function getSelectionRange(
  textareaRef: MutableRefObject<HTMLTextAreaElement | null>,
) {
  const textarea = textareaRef.current;
  if (!textarea) {
    return null;
  }

  return {
    start: textarea.selectionStart,
    end: textarea.selectionEnd,
  };
}

function createSpacing(
  before: string,
  after: string,
  snippet: string,
  selectedText: string,
) {
  const prefix =
    before.length === 0
      ? ""
      : before.endsWith("\n\n")
        ? ""
        : before.endsWith("\n")
          ? "\n"
          : "\n\n";
  const suffix =
    after.length === 0
      ? ""
      : after.startsWith("\n\n")
        ? ""
        : after.startsWith("\n")
          ? "\n"
          : "\n\n";
  const body = selectedText
    ? snippet.replace("{{selection}}", selectedText)
    : snippet;

  return {
    prefix,
    body,
    suffix,
  };
}

function ToolbarButton({
  icon: Icon,
  label,
  onClick,
  disabled,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 border border-[#C8C8C8] bg-white px-3 py-2 text-sm text-black transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

export default function RichContentEditor({
  label,
  value,
  onChange,
  placeholder,
  onUploadImage,
  disabled = false,
  minHeightClass = "h-[420px]",
}: RichContentEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const selectionRef = useRef({ start: 0, end: 0 });
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const insertSnippet = (snippet: string) => {
    const textarea = textareaRef.current;
    const selection = getSelectionRange(textareaRef) || selectionRef.current;
    const before = value.slice(0, selection.start);
    const after = value.slice(selection.end);
    const selectedText = value.slice(selection.start, selection.end);
    const spacing = createSpacing(before, after, snippet, selectedText);
    const nextValue = `${before}${spacing.prefix}${spacing.body}${spacing.suffix}${after}`;

    onChange(nextValue);

    window.requestAnimationFrame(() => {
      const nextCursorPosition =
        before.length + spacing.prefix.length + spacing.body.length;
      textarea?.focus();
      textarea?.setSelectionRange(nextCursorPosition, nextCursorPosition);
      selectionRef.current = {
        start: nextCursorPosition,
        end: nextCursorPosition,
      };
    });
  };

  const rememberSelection = () => {
    const nextSelection = getSelectionRange(textareaRef);
    if (!nextSelection) return;
    selectionRef.current = nextSelection;
  };

  const handleImageDialogOpen = () => {
    if (disabled || isUploadingImage) return;
    rememberSelection();
    imageInputRef.current?.click();
  };

  const handleImageFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];
    event.target.value = "";

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("File harus berupa gambar.");
      return;
    }

    if (selectedFile.size > MAX_INLINE_IMAGE_SIZE) {
      toast.error("Ukuran gambar maksimal 5MB.");
      return;
    }

    setIsUploadingImage(true);

    try {
      const uploadedUrl = await onUploadImage(selectedFile);
      const altText = buildInlineImageAlt(selectedFile.name);
      insertSnippet(`![${altText}](${uploadedUrl})`);
      toast.success("Gambar berhasil dimasukkan ke konten.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal mengunggah gambar.";
      toast.error(message);
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <div className="mt-5">
      <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
        <label className="block text-2xl font-medium text-black">{label}</label>
        <p className="text-sm text-black/55">
          Gunakan `##` / `###` untuk section dan sidebar.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2 border border-[#C8C8C8] border-b-0 bg-[#F8F8F8] p-3">
            <ToolbarButton
              icon={Heading2}
              label="Subtitle"
              onClick={() =>
                insertSnippet("## Subtitle\n\nWrite the next section here.")
              }
              disabled={disabled}
            />
            <ToolbarButton
              icon={List}
              label="Bullet List"
              onClick={() => insertSnippet("- First item\n- Second item")}
              disabled={disabled}
            />
            <ToolbarButton
              icon={ListOrdered}
              label="Numbered List"
              onClick={() => insertSnippet("1. First item\n2. Second item")}
              disabled={disabled}
            />
            <ToolbarButton
              icon={ImagePlus}
              label={isUploadingImage ? "Uploading..." : "Add Image"}
              onClick={handleImageDialogOpen}
              disabled={disabled || isUploadingImage}
            />
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageFileChange}
            />
          </div>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onClick={rememberSelection}
            onKeyUp={rememberSelection}
            onSelect={rememberSelection}
            placeholder={placeholder}
            disabled={disabled}
            className={`${minHeightClass} w-full resize-none border border-[#C8C8C8] bg-transparent p-4 text-base text-black placeholder:text-black/55 outline-none disabled:cursor-not-allowed disabled:opacity-70`}
          />
        </div>

        <aside className="border border-[#C8C8C8] bg-white p-4">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-black/55">
            Writing Guide
          </p>
          <div className="mt-4 space-y-4">
            {GUIDE_ROWS.map((row) => (
              <div key={row.title}>
                <p className="text-sm font-semibold text-black">{row.title}</p>
                <code className="mt-1 block rounded bg-black px-3 py-2 text-xs text-white">
                  {row.snippet}
                </code>
                <p className="mt-2 text-sm leading-relaxed text-black/60">
                  {row.description}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
