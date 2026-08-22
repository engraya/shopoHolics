import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuantityStepper } from "./QuantityStepper";

function setup(quantity: number, max?: number) {
  const onIncrement = vi.fn();
  const onDecrement = vi.fn();
  const onRemove = vi.fn();
  render(
    <QuantityStepper
      quantity={quantity}
      max={max}
      label="Mascara"
      onIncrement={onIncrement}
      onDecrement={onDecrement}
      onRemove={onRemove}
    />
  );
  return { onIncrement, onDecrement, onRemove };
}

describe("QuantityStepper", () => {
  it("shows the current quantity in a labelled live region", () => {
    setup(3);
    expect(screen.getByLabelText("Quantity of Mascara")).toHaveTextContent("3");
  });

  it("collapses the decrement control into Remove at one unit", async () => {
    const { onRemove, onDecrement } = setup(1);
    const remove = screen.getByRole("button", { name: "Remove Mascara from cart" });
    await userEvent.click(remove);
    expect(onRemove).toHaveBeenCalledOnce();
    expect(onDecrement).not.toHaveBeenCalled();
  });

  it("decrements above one unit", async () => {
    const { onDecrement, onRemove } = setup(2);
    await userEvent.click(
      screen.getByRole("button", { name: "Decrease quantity of Mascara" })
    );
    expect(onDecrement).toHaveBeenCalledOnce();
    expect(onRemove).not.toHaveBeenCalled();
  });

  it("increments when below the max", async () => {
    const { onIncrement } = setup(2);
    await userEvent.click(
      screen.getByRole("button", { name: "Increase quantity of Mascara" })
    );
    expect(onIncrement).toHaveBeenCalledOnce();
  });

  it("disables increment at the max", () => {
    setup(3, 3);
    expect(
      screen.getByRole("button", { name: "Increase quantity of Mascara" })
    ).toBeDisabled();
  });
});
