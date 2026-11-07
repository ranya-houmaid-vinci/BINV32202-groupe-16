import { toApplication } from "../mappers/application.mapper.ts";
import type { Application } from "../models/application.ts";
import type { User } from "../models/user.ts";
import type { ApplicationsRepository } from "../repositories/applications.repository.ts";
import type { OffersRepository } from "../repositories/offers.repository.ts";
import { HttpError } from "../utils/httpError.ts";
import { isStudent } from "./permissions.ts";

export const MAX_MESSAGE_LENGTH = 1000;

const requireStudent = (user: User): void => {
  if (!isStudent(user)) {
    throw new HttpError(403, "FORBIDDEN", "Seuls les étudiants peuvent gérer des candidatures");
  }
};

export const createApplicationsService = (
  repository: ApplicationsRepository,
  offersRepository: OffersRepository,
) => ({
  listApplications: (viewer: User): Application[] => {
    requireStudent(viewer);
    return repository.findByStudent(viewer.id).map(toApplication);
  },

  apply: (viewer: User, offerId: number, message: string | null): Application => {
    requireStudent(viewer);
    const offer = offersRepository.findById(offerId);
    if (offer === undefined) {
      throw new HttpError(404, "NOT_FOUND", "Offre introuvable");
    }
    if (offer.status !== "PUBLISHED") {
      throw new HttpError(409, "OFFER_NOT_PUBLISHED", "L'offre n'est plus publiée");
    }
    if (repository.findActiveByStudentAndOffer(viewer.id, offerId) !== undefined) {
      throw new HttpError(409, "APPLICATION_EXISTS", "Vous avez déjà candidaté à cette offre");
    }
    repository.insert(offerId, viewer.id, message);
    const application = repository.findActiveByStudentAndOffer(viewer.id, offerId);
    if (application === undefined) {
      throw new HttpError(500, "INTERNAL_ERROR", "La candidature n'a pas pu être créée");
    }
    return toApplication(application);
  },

  withdraw: (viewer: User, applicationId: number): void => {
    requireStudent(viewer);
    const application = repository.findByIdAndStudent(applicationId, viewer.id);
    if (application === undefined) {
      throw new HttpError(404, "NOT_FOUND", "Candidature introuvable");
    }
    if (application.status !== "IN_PROGRESS") {
      throw new HttpError(
        409,
        "APPLICATION_ALREADY_PROCESSED",
        "Cette candidature est déjà traitée",
      );
    }
    repository.withdraw(applicationId, viewer.id);
  },
});

export type ApplicationsService = ReturnType<typeof createApplicationsService>;
