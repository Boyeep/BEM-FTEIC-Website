export type RichContentHeadingLevel = 2 | 3;

export type RichContentBlock =
  | {
      type: "heading";
      id: string;
      level: RichContentHeadingLevel;
      text: string;
    }
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "image";
      src: string;
      alt: string;
    }
  | {
      type: "list";
      style: "unordered" | "ordered";
      items: string[];
    };

export interface RichContentSection {
  id: string;
  level: RichContentHeadingLevel;
  text: string;
}

export interface RichContentDocument {
  blocks: RichContentBlock[];
  sections: RichContentSection[];
}

const HEADING_PATTERN = /^(#{2,3})\s+(.+)$/;
const IMAGE_PATTERN = /^!\[(.*?)\]\((.+)\)$/;
const UNORDERED_LIST_PATTERN = /^[-*]\s+(.+)$/;
const ORDERED_LIST_PATTERN = /^\d+\.\s+(.+)$/;
const CONTINUATION_PATTERN = /^\s{2,}\S/;

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function createUniqueSectionId(
  value: string,
  slugCounts: Map<string, number>,
  fallbackIndex: number,
) {
  const baseSlug = createSlug(value) || `section-${fallbackIndex}`;
  const nextCount = (slugCounts.get(baseSlug) || 0) + 1;
  slugCounts.set(baseSlug, nextCount);

  if (nextCount === 1) {
    return baseSlug;
  }

  return `${baseSlug}-${nextCount}`;
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function getBlockText(block: RichContentBlock) {
  if (block.type === "paragraph" || block.type === "heading") {
    return block.text;
  }

  if (block.type === "list") {
    return block.items.join(" ");
  }

  return "";
}

export function parseRichContent(rawContent: string): RichContentDocument {
  const normalizedContent = rawContent.replace(/\r\n/g, "\n").trim();

  if (!normalizedContent) {
    return {
      blocks: [],
      sections: [],
    };
  }

  const lines = normalizedContent.split("\n");
  const blocks: RichContentBlock[] = [];
  const sections: RichContentSection[] = [];
  const slugCounts = new Map<string, number>();

  let index = 0;

  while (index < lines.length) {
    const rawLine = lines[index];
    const trimmedLine = rawLine.trim();

    if (!trimmedLine) {
      index += 1;
      continue;
    }

    const headingMatch = HEADING_PATTERN.exec(trimmedLine);
    if (headingMatch) {
      const level = headingMatch[1].length as RichContentHeadingLevel;
      const text = normalizeWhitespace(headingMatch[2]);

      if (text) {
        const id = createUniqueSectionId(text, slugCounts, sections.length + 1);
        const section = { id, level, text };
        sections.push(section);
        blocks.push({ type: "heading", ...section });
      }

      index += 1;
      continue;
    }

    const imageMatch = IMAGE_PATTERN.exec(trimmedLine);
    if (imageMatch) {
      const alt = normalizeWhitespace(imageMatch[1]) || "Content image";
      const src = imageMatch[2].trim();

      if (src) {
        blocks.push({
          type: "image",
          alt,
          src,
        });
      }

      index += 1;
      continue;
    }

    const unorderedMatch = UNORDERED_LIST_PATTERN.exec(trimmedLine);
    const orderedMatch = ORDERED_LIST_PATTERN.exec(trimmedLine);

    if (unorderedMatch || orderedMatch) {
      const style = unorderedMatch ? "unordered" : "ordered";
      const items: string[] = [];

      while (index < lines.length) {
        const currentLine = lines[index];
        const currentTrimmedLine = currentLine.trim();

        if (!currentTrimmedLine) {
          break;
        }

        const currentMatch =
          style === "unordered"
            ? UNORDERED_LIST_PATTERN.exec(currentTrimmedLine)
            : ORDERED_LIST_PATTERN.exec(currentTrimmedLine);

        if (currentMatch) {
          items.push(normalizeWhitespace(currentMatch[1]));
          index += 1;
          continue;
        }

        if (
          CONTINUATION_PATTERN.test(currentLine) &&
          items.length > 0 &&
          currentTrimmedLine
        ) {
          const lastItem = items[items.length - 1];
          items[items.length - 1] =
            `${lastItem} ${normalizeWhitespace(currentTrimmedLine)}`;
          index += 1;
          continue;
        }

        break;
      }

      if (items.length > 0) {
        blocks.push({
          type: "list",
          style,
          items,
        });
      }

      continue;
    }

    const paragraphLines: string[] = [];

    while (index < lines.length) {
      const currentTrimmedLine = lines[index].trim();

      if (!currentTrimmedLine) {
        break;
      }

      if (
        HEADING_PATTERN.test(currentTrimmedLine) ||
        IMAGE_PATTERN.test(currentTrimmedLine) ||
        UNORDERED_LIST_PATTERN.test(currentTrimmedLine) ||
        ORDERED_LIST_PATTERN.test(currentTrimmedLine)
      ) {
        break;
      }

      paragraphLines.push(currentTrimmedLine);
      index += 1;
    }

    const paragraph = normalizeWhitespace(paragraphLines.join(" "));
    if (paragraph) {
      blocks.push({
        type: "paragraph",
        text: paragraph,
      });
    }
  }

  return {
    blocks,
    sections,
  };
}

export function getPlainTextFromRichContent(rawContent: string) {
  return normalizeWhitespace(
    parseRichContent(rawContent)
      .blocks.map(getBlockText)
      .filter(Boolean)
      .join(" "),
  );
}

export function getRichContentPreview(rawContent: string, maxLength = 180) {
  const plainText = getPlainTextFromRichContent(rawContent);

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}

export function getRichContentWordCount(rawContent: string) {
  const plainText = getPlainTextFromRichContent(rawContent);
  if (!plainText) return 0;
  return plainText.split(/\s+/).filter(Boolean).length;
}
