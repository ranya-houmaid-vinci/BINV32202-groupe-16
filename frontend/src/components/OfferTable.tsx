import type { Offer } from "../models/offer.ts";
import { useState } from "react";
import { OFFER_STATUS_LABELS, OFFER_STATUS_TONES, PERIOD_LABELS } from "../utils/labels.ts";
import StatusBadge from "./StatusBadge.tsx";

interface OfferTableProps {
  offers: Offer[];
  canApply?: boolean;
  appliedOfferIds?: Set<number>;
  onApply?: (offerId: number, message: string) => Promise<void>;
}

const OfferTable = ({ offers, canApply = false, appliedOfferIds = new Set(), onApply }: OfferTableProps) => {
  const [offerInForm, setOfferInForm] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (offerInForm === null || onApply === undefined) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onApply(offerInForm, message);
      setOfferInForm(null);
      setMessage("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Candidature impossible");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="table-wrapper">
      {error && <p className="state state-error" role="alert">{error}</p>}
      <table className="data-table">
      <thead>
        <tr>
          <th scope="col">Titre</th>
          <th scope="col">Entreprise</th>
          <th scope="col">Année</th>
          <th scope="col">Période</th>
          <th scope="col">Statut</th>
          {canApply && <th scope="col">Action</th>}
        </tr>
      </thead>
      <tbody>
        {offers.map((offer) => (
          <tr key={offer.id}>
            <td>{offer.title}</td>
            <td>{offer.companyShortName}</td>
            <td>{offer.academicYear}</td>
            <td>{PERIOD_LABELS[offer.period]}</td>
            <td>
              <StatusBadge
                label={OFFER_STATUS_LABELS[offer.status]}
                tone={OFFER_STATUS_TONES[offer.status]}
              />
            </td>
            {canApply && (
              <td>
                {appliedOfferIds.has(offer.id) ? (
                  <span>Candidature envoyée</span>
                ) : (
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={() => {
                      setOfferInForm(offer.id);
                      setMessage("");
                    }}
                  >
                    Candidater
                  </button>
                )}
                {offerInForm === offer.id && (
                  <div className="application-form">
                    <label htmlFor={`application-message-${offer.id}`}>Message (facultatif)</label>
                    <textarea
                      id={`application-message-${offer.id}`}
                      maxLength={1000}
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                    />
                    <div>
                      <button type="button" className="button button-primary" disabled={isSubmitting} onClick={() => void submit()}>
                        {isSubmitting ? "Envoi…" : "Envoyer"}
                      </button>
                      <button type="button" className="button" onClick={() => setOfferInForm(null)}>
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default OfferTable;
