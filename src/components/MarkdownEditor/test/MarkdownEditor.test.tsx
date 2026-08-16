import MarkdownEditor from "../MarkdownEditor";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

describe("MarkdownEditor", () => {
  it("switches to preview and saves changes", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<MarkdownEditor value={"## Lesson"} onChange={vi.fn()} onSave={onSave} hasChanges />);

    await user.click(screen.getByRole("tab", { name: "Preview" }));
    expect(screen.getByText("Lesson")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Save changes" }));
    expect(onSave).toHaveBeenCalledOnce();
  });

  it("searches and inserts an emoji at the cursor from the emoji menu", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MarkdownEditor value="Great note" onChange={onChange} />);

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);

    await user.click(screen.getByRole("button", { name: "Insert emoji" }));
    await user.type(screen.getByPlaceholderText("Search emoji…"), "light bulb");
    await user.click(await screen.findByRole("menuitem", { name: "Insert light bulb" }));

    expect(onChange).toHaveBeenCalledWith("Great note💡");
  });

  it("inserts an emoji in the middle of existing text at the cursor position", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MarkdownEditor value="Great note" onChange={onChange} />);

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    textarea.focus();
    textarea.setSelectionRange(5, 5);

    await user.click(screen.getByRole("button", { name: "Insert emoji" }));
    await user.type(screen.getByPlaceholderText("Search emoji…"), "rocket");
    await user.click(await screen.findByRole("menuitem", { name: "Insert rocket" }));

    expect(onChange).toHaveBeenCalledWith("Great🚀 note");
  });

  it("shows a message when no emoji matches the search", async () => {
    const user = userEvent.setup();
    render(<MarkdownEditor value="" onChange={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Insert emoji" }));
    await user.type(screen.getByPlaceholderText("Search emoji…"), "zzzznotanemoji");

    expect(await screen.findByText("No emoji found.")).toBeVisible();
  });

  it("closes the emoji menu on an outside click without inserting anything", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MarkdownEditor value="Great note" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Insert emoji" }));
    expect(screen.getByRole("menu")).toBeVisible();

    await user.click(document.body);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("stays open when the emoji list itself is scrolled", async () => {
    const user = userEvent.setup();
    render(<MarkdownEditor value="Great note" onChange={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Insert emoji" }));
    const menu = screen.getByRole("menu");
    expect(menu).toBeVisible();

    fireEvent.scroll(menu);
    expect(screen.getByRole("menu")).toBeVisible();
  });

  it("closes when the page behind the emoji menu is scrolled", async () => {
    const user = userEvent.setup();
    render(<MarkdownEditor value="Great note" onChange={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Insert emoji" }));
    expect(screen.getByRole("menu")).toBeVisible();

    fireEvent.scroll(window);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("does not offer a template when none is configured", () => {
    render(<MarkdownEditor value="" onChange={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "Insert template" })).not.toBeInTheDocument();
  });

  it("does not offer a template once the field already has content", () => {
    render(<MarkdownEditor value="Already writing something" onChange={vi.fn()} template="## Heading" />);
    expect(screen.queryByRole("button", { name: "Insert template" })).not.toBeInTheDocument();
  });

  it("inserts the template and switches to the write tab when requested", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MarkdownEditor value="" onChange={onChange} template={"## Heading\n\n- Prompt"} />);

    await user.click(screen.getByRole("tab", { name: "Preview" }));
    await user.click(screen.getByRole("button", { name: "Insert template" }));

    expect(onChange).toHaveBeenCalledWith("## Heading\n\n- Prompt");
    expect(screen.getByRole("tab", { name: "Write" })).toHaveAttribute("aria-selected", "true");
  });
});
