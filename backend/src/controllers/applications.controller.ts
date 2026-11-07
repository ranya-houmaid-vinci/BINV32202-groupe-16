import { Router } from "express";
import { toApplicationDto } from "../mappers/application.mapper.ts";
import { getCurrentUser } from "../middlewares/authenticate.ts";
import type { ApplicationsService } from "../services/applications.service.ts";
import { MAX_MESSAGE_LENGTH } from "../services/applications.service.ts";
import { HttpError } from "../utils/httpError.ts";

const parsePositiveInteger = (value: unknown, field: string): number => {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value <= 0
  ) {
    throw new HttpError(400, "INVALID_BODY", `${field} doit être un entier positif`);
  }
  return value;
};

const parseApplicationBody = (body: unknown): { offerId: number; message: string | null } => {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new HttpError(400, "INVALID_BODY", "Le corps doit être un objet JSON");
  }
  const { offerId, message } = body as { offerId?: unknown; message?: unknown };
  if (message !== undefined && message !== null && typeof message !== "string") {
    throw new HttpError(400, "INVALID_BODY", "Le message doit être une chaîne de caractères");
  }
  const normalizedMessage = typeof message === "string" ? message.trim() : null;
  if (normalizedMessage !== null && normalizedMessage.length > MAX_MESSAGE_LENGTH) {
    throw new HttpError(
      400,
      "INVALID_BODY",
      `Le message ne peut pas dépasser ${MAX_MESSAGE_LENGTH} caractères`,
    );
  }
  return {
    offerId: parsePositiveInteger(offerId, "offerId"),
    message: normalizedMessage === "" ? null : normalizedMessage,
  };
};

const parseId = (value: string): number => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, "INVALID_QUERY", "L'identifiant doit être un entier positif");
  }
  return id;
};

export const createApplicationsRouter = (service: ApplicationsService) => {
  const router = Router();

  router.get("/", (req, res) => {
    res.json(service.listApplications(getCurrentUser(req)).map(toApplicationDto));
  });

  router.post("/", (req, res) => {
    const { offerId, message } = parseApplicationBody(req.body);
    res.status(201).json(toApplicationDto(service.apply(getCurrentUser(req), offerId, message)));
  });

  router.delete("/:id", (req, res) => {
    service.withdraw(getCurrentUser(req), parseId(req.params.id));
    res.status(204).send();
  });

  return router;
};
