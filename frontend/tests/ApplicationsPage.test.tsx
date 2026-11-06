import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ApplicationsPage from "../src/pages/ApplicationsPage.tsx";
import { stubFetch } from "./helpers/fetchMock.ts";

const applications = [
  {
    id: 1,
    offer: {
      id: 1,
      title: "Application React de gestion de flotte",
      companyShortName: "Lumen Digital",
      academicYear: "2026-2027",
      period: "P2",
    },
    message: "Mon message",
    status: "IN_PROGRESS",
    appliedAt: "2026-10-02 18:10:00",
  },
  {
    id: 2,
    offer: {
      id: 3,
      title: "API REST de facturation",
      companyShortName: "Orbis",
      academicYear: "2026-2027",
      period: "P2",
    },
    message: null,
    status: "SELECTED",
    appliedAt: "2026-09-22 12:00:00",
  },
  {
    id: 3,
    offer: {
      id: 4,
      title: "Tests de bout en bout",
      companyShortName: "Orbis",
      academicYear: "2026-2027",
      period: "OTHER",
    },
    message: null,
    status: "REJECTED",
    appliedAt: "2026-09-20 12:00:00",
  },
  {
    id: 4,
    offer: {
      id: 5,
      title: "Qualité des données",
      companyShortName: "Lumen Data",
      academicYear: "2026-2027",
      period: "P1",
    },
    message: null,
    status: "WITHDRAWN",
    appliedAt: "2026-09-19 12:00:00",
  },
];

describe("ApplicationsPage", () => {
  it("affiche les quatre statuts en français", async () => {
    stubFetch({ "/api/applications": () => Response.json(applications) });

    render(<ApplicationsPage token="jeton" onUnauthorized={vi.fn()} />);

    expect(await screen.findByText("En cours")).toBeInTheDocument();
    expect(screen.getByText("Retenue")).toBeInTheDocument();
    expect(screen.getByText("Non retenue")).toBeInTheDocument();
    expect(screen.getByText("Retirée")).toBeInTheDocument();
    expect(screen.getByText("Mon message")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retirer" })).toBeInTheDocument();
  });

  it("retire une candidature en cours puis recharge la liste", async () => {
    const fetchMock = stubFetch({
      "/api/applications/1": () => new Response(null, { status: 204 }),
      "/api/applications": () => Response.json(applications),
    });

    render(<ApplicationsPage token="jeton" onUnauthorized={vi.fn()} />);
    await screen.findByText("En cours");
    fireEvent.click(screen.getByRole("button", { name: "Retirer" }));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/applications/1",
        expect.objectContaining({ method: "DELETE" }),
      ),
    );
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
