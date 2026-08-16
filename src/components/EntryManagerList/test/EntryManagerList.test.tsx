import EntryManagerList from "../EntryManagerList";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const entry = { id: "one", date: "2024-01-01", company: "Acme", title: "Engineer", level: "L4", type: "new_job" as const, base: 120000, bonus: 0, equity: 0, note: "" };

describe("EntryManagerList", () => {
  it("renders entries and forwards edit and remove actions", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onRemove = vi.fn();
    render(<EntryManagerList entries={[entry]} currency="USD" onEdit={onEdit} onRemove={onRemove} editingId={null} />);

    await user.click(screen.getByLabelText("Edit Engineer at Acme"));
    await user.click(screen.getByLabelText("Remove Engineer at Acme"));
    expect(onEdit).toHaveBeenCalledWith(entry);
    expect(onRemove).toHaveBeenCalledWith("one");
  });
});
