import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { OFFER, STUDENT } from "../src/db/seed/seedIds.ts";
import { createTestApp, tokenFor } from "./helpers/testApp.ts";

let app: ReturnType<typeof createTestApp>;

beforeEach(() => {
  app = createTestApp();
});

const studentToken = (id = STUDENT.LUCAS_DUPONT) => tokenFor("STUDENT", id);

describe("GET /applications", () => {
  it("liste toutes les candidatures de l'étudiant avec les statuts stockés", async () => {
    const response = await request(app)
      .get("/applications")
      .set("Authorization", studentToken());

    expect(response.status).toBe(200);
    expect(response.body.map((application: { status: string }) => application.status).sort()).toEqual([
      "IN_PROGRESS",
    ]);
    expect(response.body[0]).toMatchObject({
      offer: {
        id: OFFER.FLEET_APP,
        title: "Application React de gestion de flotte",
        companyShortName: "Lumen Digital",
      },
      message: "Le développement React m'intéresse particulièrement.",
    });
  });

  it("refuse l'accès à un administrateur", async () => {
    const response = await request(app)
      .get("/applications")
      .set("Authorization", tokenFor("ADMIN", 1));

    expect(response.status).toBe(403);
  });
});

describe("POST /applications", () => {
  it("crée une candidature sur une offre publiée et normalise le message", async () => {
    const response = await request(app)
      .post("/applications")
      .set("Authorization", studentToken())
      .send({ offerId: OFFER.DATA_QUALITY, message: "  Un message de test  " });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      offer: { id: OFFER.DATA_QUALITY },
      message: "Un message de test",
      status: "IN_PROGRESS",
    });
  });

  it("accepte une candidature sans message", async () => {
    const response = await request(app)
      .post("/applications")
      .set("Authorization", studentToken())
      .send({ offerId: OFFER.DATA_QUALITY });

    expect(response.status).toBe(201);
    expect(response.body.message).toBeNull();
  });

  it("refuse une deuxième candidature active pour la même offre", async () => {
    const response = await request(app)
      .post("/applications")
      .set("Authorization", studentToken())
      .send({ offerId: OFFER.FLEET_APP });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("APPLICATION_EXISTS");
  });

  it("refuse une offre non publiée", async () => {
    const response = await request(app)
      .post("/applications")
      .set("Authorization", studentToken())
      .send({ offerId: OFFER.CLIENT_PORTAL });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("OFFER_NOT_PUBLISHED");
  });

  it("valide le message et l'identifiant de l'offre", async () => {
    const tooLong = "x".repeat(1001);
    const response = await request(app)
      .post("/applications")
      .set("Authorization", studentToken())
      .send({ offerId: OFFER.DATA_QUALITY, message: tooLong });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_BODY");
  });
});

describe("DELETE /applications/:id", () => {
  it("retire une candidature en cours", async () => {
    const response = await request(app)
      .delete("/applications/1")
      .set("Authorization", studentToken());

    expect(response.status).toBe(204);
    const applications = await request(app)
      .get("/applications")
      .set("Authorization", studentToken());
    expect(applications.body[0].status).toBe("WITHDRAWN");
  });

  it("permet de candidater à nouveau après un retrait", async () => {
    await request(app).delete("/applications/1").set("Authorization", studentToken());

    const response = await request(app)
      .post("/applications")
      .set("Authorization", studentToken())
      .send({ offerId: OFFER.FLEET_APP, message: "Nouvelle candidature" });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Nouvelle candidature");
  });

  it("refuse le retrait d'une candidature déjà traitée", async () => {
    const response = await request(app)
      .delete("/applications/3")
      .set("Authorization", tokenFor("STUDENT", STUDENT.MATEUSZ_KOWALSKI));

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("APPLICATION_ALREADY_PROCESSED");
  });
});
