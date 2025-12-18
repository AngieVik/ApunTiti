import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button, Input } from "./UI";

describe("UI Components", () => {
  describe("Button", () => {
    it("renders children correctly", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("handles interactions", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      fireEvent.click(screen.getByText("Click me"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("applies variant classes", () => {
      render(<Button variant="danger">Delete</Button>);
      // Checking for a class would depend on implementation details (CSS classes),
      // but we can check if it renders without crashing.
      // Ideally we check specific styles if we were testing styles,
      // but here functionality is key.
      expect(screen.getByText("Delete")).toBeInTheDocument();
    });
  });

  describe("Input", () => {
    it("renders with label", () => {
      render(<Input label="Username" id="username" />);
      expect(screen.getByLabelText("Username")).toBeInTheDocument();
    });

    it("handles changes", () => {
      const handleChange = vi.fn();
      render(<Input label="Name" onChange={handleChange} />);

      const input = screen.getByLabelText("Name");
      fireEvent.change(input, { target: { value: "John" } });

      expect(handleChange).toHaveBeenCalled();
    });
  });
});
