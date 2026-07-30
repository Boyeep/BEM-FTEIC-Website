// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import {
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { useEventForm } from "../hooks/useEventForm";
import { useGalleryForm } from "../hooks/useGalleryForm";

afterEach(cleanup);
import { useBlogForm } from "../hooks/useBlogForm";
import { BlogFormFields } from "./blog/BlogFormFields";
import { EventFormFields } from "./event/EventFormFields";
import { GalleryFormFields } from "./gallery/GalleryFormFields";

describe("dashboard form fields", () => {
  it("renders accessible blog title, category, status, and cover fields", () => {
    const { result } = renderHook(() =>
      useBlogForm({
        title: "Blog",
        category: "FTEIC",
        content: "Content",
        coverImage: "https://example.com/blog.jpg",
        status: "DRAFT",
      }),
    );
    render(<BlogFormFields form={result.current} />);
    expect(screen.getByLabelText("TITLE")).toHaveValue("Blog");
    expect(screen.getByLabelText("DEPARTMENT")).toHaveValue("FTEIC");
    expect(screen.getByLabelText("STATUS")).toHaveValue("DRAFT");
    expect(screen.getByLabelText("Upload cover blog")).toBeInTheDocument();
  });

  it("renders accessible event fields and updates input state", () => {
    const { result } = renderHook(() =>
      useEventForm({
        title: "Initial event",
        category: "FTEIC",
        description: "Description",
        coverImage: "https://example.com/cover.jpg",
        eventDate: "2026-08-01",
        status: "UPCOMING",
        publicationStatus: "PUBLISHED",
      }),
    );
    const { rerender } = render(<EventFormFields form={result.current} />);
    const title = screen.getByLabelText("TITLE");
    expect(title).toHaveValue("Initial event");
    fireEvent.change(title, { target: { value: "" } });
    rerender(<EventFormFields form={result.current} />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Judul event wajib diisi.",
    );
  });

  it("renders gallery link, category, date, and image controls", () => {
    const { result } = renderHook(() =>
      useGalleryForm({
        title: "Gallery",
        link: "https://example.com/gallery",
        takenAt: "2026-08-01",
        imageUrl: "https://example.com/gallery.jpg",
        category: "all",
      }),
    );
    render(<GalleryFormFields form={result.current} />);
    expect(screen.getByLabelText("TITLE")).toBeInTheDocument();
    expect(screen.getByLabelText("LINK")).toHaveAttribute("inputmode", "url");
    expect(screen.getByLabelText("DEPARTMENT")).toBeInTheDocument();
    expect(screen.getByLabelText("DATE")).toBeInTheDocument();
    expect(screen.getByLabelText("Upload gambar galeri")).toBeInTheDocument();
  });
});
