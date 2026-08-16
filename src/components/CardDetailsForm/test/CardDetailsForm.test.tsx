import CardDetailsForm from "../CardDetailsForm";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

describe("CardDetailsForm", () => {
  it("renders the given title, currency, and note values", () => {
    render(
      <CardDetailsForm
        title="My progression"
        note="A note"
        currency="INR"
        onTitleChange={vi.fn()}
        onNoteChange={vi.fn()}
        onCurrencyChange={vi.fn()}
      />
    );

    expect(screen.getByLabelText("Card title")).toHaveValue("My progression");
    expect(screen.getByLabelText("Overall note (optional)")).toHaveValue("A note");
    expect(screen.getByRole("option", { name: "USD — US Dollar" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "INR — Indian Rupee" })).toBeInTheDocument();
    expect(screen.getByLabelText("Currency")).toHaveValue("INR");
  });

  it("calls onTitleChange when the title input changes", async () => {
    const user = userEvent.setup();
    const onTitleChange = vi.fn();
    render(
      <CardDetailsForm
        title="Initial"
        note=""
        currency="USD"
        onTitleChange={onTitleChange}
        onNoteChange={vi.fn()}
        onCurrencyChange={vi.fn()}
      />
    );

    await user.clear(screen.getByLabelText("Card title"));
    await user.type(screen.getByLabelText("Card title"), "New title");

    expect(onTitleChange).toHaveBeenCalled();
  });

  it("calls onCurrencyChange when a different currency is selected", async () => {
    const user = userEvent.setup();
    const onCurrencyChange = vi.fn();
    render(
      <CardDetailsForm
        title=""
        note=""
        currency="USD"
        onTitleChange={vi.fn()}
        onNoteChange={vi.fn()}
        onCurrencyChange={onCurrencyChange}
      />
    );

    await user.selectOptions(screen.getByLabelText("Currency"), "GBP");

    expect(onCurrencyChange).toHaveBeenCalledWith("GBP");
  });

  it("calls onNoteChange when the note textarea changes", async () => {
    const user = userEvent.setup();
    const onNoteChange = vi.fn();
    render(
      <CardDetailsForm
        title=""
        note=""
        currency="USD"
        onTitleChange={vi.fn()}
        onNoteChange={onNoteChange}
        onCurrencyChange={vi.fn()}
      />
    );

    await user.type(screen.getByLabelText("Overall note (optional)"), "x");

    expect(onNoteChange).toHaveBeenCalled();
  });
});
