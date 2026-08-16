import EntryForm from "../EntryForm";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("EntryForm", () => {
  beforeEach(() => vi.stubGlobal("crypto", { randomUUID: () => "generated-id" }));

  it("adds a complete career event", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<EntryForm onAdd={onAdd} editingEntry={null} onCancelEdit={vi.fn()} />);

    await user.type(screen.getByLabelText("Date"), "2024-01-01");
    await user.type(screen.getByLabelText("Company"), "Acme");
    await user.type(screen.getByLabelText("Title"), "Engineer");
    await user.type(screen.getByLabelText("Base salary"), "120000");
    await user.type(screen.getByLabelText("Bonus (optional)"), "10000");
    await user.click(screen.getByRole("button", { name: "Add to timeline" }));

    expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({
      id: "generated-id", company: "Acme", title: "Engineer", base: 120000, bonus: 10000,
    }));
  });
});
