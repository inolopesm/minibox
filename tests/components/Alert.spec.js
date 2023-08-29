import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { Alert } from "../../components/Alert";
import { useState } from "react";

describe("Alert", () => {
  it("should render with error variant", async () => {
    render(<Alert variant="error" data-testid="alert-error">Error</Alert>);
    const alert = screen.getByTestId("alert-error");
    expect(alert.className).toContain("bg-red");
    expect(alert.className).toContain("border-red");
    expect(alert.className).toContain("text-red");
  });

  it("should render with success variant", async () => {
    render(<Alert variant="success" data-testid="alert-success">Success</Alert>);
    const alert = screen.getByTestId("alert-success");
    expect(alert.className).toContain("bg-green");
    expect(alert.className).toContain("border-green");
    expect(alert.className).toContain("text-green");
  });

  it("should call onClose when the close button is clicked", async () => {
    const handleClose = jest.fn();

    render(
      <Alert
        variant="error"
        onClose={handleClose}
        data-button-testid="alert-button"
      >
        Error
      </Alert>
    );

    fireEvent.click(screen.getByTestId("alert-button"));
    expect(handleClose).toHaveBeenCalled();
  });
});
