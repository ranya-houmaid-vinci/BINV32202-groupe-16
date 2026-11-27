import { expect, test } from "@playwright/test";

test("un étudiant trouve une offre publiée en recherchant par titre et période", async ({
  page,
}) => {
  await page.goto("http://localhost:5173");

  await page.getByRole("button", { name: "Dmytro Kovalenko" }).click();
  await page.getByRole("link", { name: "Offres" }).click();
  await expect(page).toHaveURL(/\/offres$/);

  await page.getByLabel("Période").selectOption("P2");
  await page.getByLabel("Recherche par titre").fill("  ReAcT  ");

  await expect(
    page.getByText("Application React de gestion de flotte", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Aucune offre ne correspond à votre recherche.", { exact: true }),
  ).toBeHidden();
});

test("un étudiant voit un message lorsqu'aucune offre ne correspond à sa recherche", async ({
  page,
}) => {
  await page.goto("http://localhost:5173");

  await page.getByRole("button", { name: "Dmytro Kovalenko" }).click();
  await page.getByRole("link", { name: "Offres" }).click();
  await expect(page).toHaveURL(/\/offres$/);

  await page.getByLabel("Recherche par titre").fill("e2e-aucun-resultat-9x7");

  await expect(page.locator(".data-table tbody tr")).toHaveCount(0);
  await expect(
    page.getByText("Aucune offre ne correspond à votre recherche.", { exact: true }),
  ).toBeVisible();
});
