import EmptyState from "../components/EmptyState.tsx";
import ErrorState from "../components/ErrorState.tsx";
import LoadingState from "../components/LoadingState.tsx";
import StatusBadge from "../components/StatusBadge.tsx";
import { useApplications } from "../hooks/useApplications.ts";
import { withdrawApplication } from "../services/applications.service.ts";
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_TONES, PERIOD_LABELS } from "../utils/labels.ts";

interface ApplicationsPageProps {
  token: string;
  onUnauthorized: () => void;
}

const ApplicationsPage = ({ token, onUnauthorized }: ApplicationsPageProps) => {
  const { applications, isLoading, error, reload } = useApplications(token, onUnauthorized);

  if (error) return <ErrorState message={error} />;
  if (isLoading) return <LoadingState />;

  return (
    <section>
      <h1>Mes candidatures</h1>
      {applications.length === 0 ? (
        <EmptyState message="Vous n'avez encore aucune candidature." />
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Offre</th>
                <th scope="col">Entreprise</th>
                <th scope="col">Année</th>
                <th scope="col">Période</th>
                <th scope="col">Message</th>
                <th scope="col">Statut</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.id}>
                  <td>{application.offer.title}</td>
                  <td>{application.offer.companyShortName}</td>
                  <td>{application.offer.academicYear}</td>
                  <td>{PERIOD_LABELS[application.offer.period]}</td>
                  <td>{application.message ?? "—"}</td>
                  <td>
                    <StatusBadge
                      label={APPLICATION_STATUS_LABELS[application.status]}
                      tone={APPLICATION_STATUS_TONES[application.status]}
                    />
                  </td>
                  <td>
                    {application.status === "IN_PROGRESS" && (
                      <button
                        type="button"
                        className="button button-danger"
                        onClick={() => {
                          void withdrawApplication(token, application.id).then(() => reload());
                        }}
                      >
                        Retirer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default ApplicationsPage;
