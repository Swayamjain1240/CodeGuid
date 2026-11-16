import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { RepoCard } from "./RepoCard.jsx";

describe("RepoCard", () => {
  it("renders a repository and calls the toggle handler", () => {
    const onToggleScan = vi.fn();

    render(
      <RepoCard
        repo={{ _id: "repo-1", name: "api", fullName: "acme/api", private: true, isScanningEnabled: true }}
        onToggleScan={onToggleScan}
        isToggling={false}
      />
    );

    expect(screen.getByText("api")).toBeInTheDocument();
    expect(screen.getByText("acme/api")).toBeInTheDocument();

    const toggle = screen.getByRole("checkbox");
    expect(toggle).toBeChecked();

    fireEvent.click(toggle);
    expect(onToggleScan).toHaveBeenCalledWith("repo-1");
  });

  it("renders nothing when no repository is supplied", () => {
    const { container } = render(<RepoCard />);
    expect(container).toBeEmptyDOMElement();
  });
});
