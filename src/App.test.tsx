import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renderiza o hero", () => {
    const { getByRole } = render(<App />);
    expect(
      getByRole("heading", { name: /yuji sato/i }),
    ).toBeInTheDocument();
  });
});
