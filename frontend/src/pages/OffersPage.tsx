import { useState } from "react";
import EmptyState from "../components/EmptyState.tsx";
import ErrorState from "../components/ErrorState.tsx";
import LoadingState from "../components/LoadingState.tsx";
import OfferTable from "../components/OfferTable.tsx";
import { useOffers } from "../hooks/useOffers.ts";
import { useApplications } from "../hooks/useApplications.ts";
import { createApplication } from "../services/applications.service.ts";
import { PERIOD_CODES, type PeriodCode } from "../models/offer.ts";
import type { User } from "../models/user.ts";

interface OffersPageProps {
  user: User;
  token: string;
  onUnauthorized: () => void;
}

const DESCRIPTIONS = {
  ADMIN: "Toutes les offres, tous statuts confondus.",
  STUDENT: "Les offres publiées.",
  CONTACT: "Les offres que vous avez déposées.",
} as const;

const PERIOD_OPTIONS: { value: PeriodCode | ""; label: string }[] = [
  { value: "", label: "Toutes les périodes" },
  { value: "P1", label: "P1" },
  { value: "P2", label: "P2" },
  { value: "OTHER", label: "Autre" },
];

const OffersPage = ({ user, token, onUnauthorized }: OffersPageProps) => {
  const [period, setPeriod] = useState<PeriodCode | "">("");
  const [titleKeyword, setTitleKeyword] = useState("");
  const { offers, isLoading, error } = useOffers(
    token,
    onUnauthorized,
    period === "" ? undefined : period,
    titleKeyword,
  );
  const isStudent = user.kind === "STUDENT";
  const applications = useApplications(token, onUnauthorized, isStudent);
  const appliedOfferIds = new Set(
    applications.applications
      .filter((application) => application.status !== "WITHDRAWN")
      .map((application) => application.offer.id),
  );

  const apply = async (offerId: number, message: string) => {
    await createApplication(token, offerId, message);
    await applications.reload();
  };

  const renderContent = () => {
    if (error) return <ErrorState message={error} />;
    if (isLoading) return <LoadingState />;
    if (offers.length === 0) {
      return (
        <EmptyState
          message={
            titleKeyword.trim() === ""
              ? "Aucune offre à afficher."
              : "Aucune offre ne correspond à votre recherche."
          }
        />
      );
    }
    return (
      <>
        <p className="result-count">
          {offers.length} offre{offers.length > 1 ? "s" : ""}
        </p>
        <OfferTable
          offers={offers}
          canApply={isStudent}
          appliedOfferIds={appliedOfferIds}
          onApply={isStudent ? apply : undefined}
        />
      </>
    );
  };

  return (
    <section>
      <h1>Offres de stage</h1>
      <p>{DESCRIPTIONS[user.kind]}</p>
      <label htmlFor="offer-title-search">Recherche par titre</label>
      <input
        id="offer-title-search"
        type="search"
        value={titleKeyword}
        onChange={(event) => setTitleKeyword(event.target.value)}
      />
      <label htmlFor="offer-period">Période</label>
      <select
        id="offer-period"
        value={period}
        onChange={(event) => {
          const value = event.target.value;
          setPeriod(value === "" ? "" : PERIOD_CODES.find((code) => code === value) ?? "");
        }}
      >
        {PERIOD_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {renderContent()}
    </section>
  );
};

export default OffersPage;
