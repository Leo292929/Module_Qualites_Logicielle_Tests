import { test, expect } from '@playwright/test';

test.describe("Inscription utilisateur", () => {
  test.beforeEach(async ({ page }) => {
    // Nettoyage côté app (users en localStorage)
    await page.addInitScript(() => localStorage.clear());
    await page.goto('/');
  });

  test("création de compte réussie affiche un message et vide le formulaire", async ({ page }) => {
    await page.getByLabel("Nom d'utilisateur").fill('jdupont');
    await page.getByLabel("E-mail").fill('jean.dupont@example.com');
    await page.getByLabel("Mot de passe").fill('secret123');
    await page.getByRole('button', { name: 'Créer mon compte' }).click();

    await expect(page.getByRole('alert')).toHaveText(/Compte créé avec succès/i);

    // Vérifie que les champs sont vidés
    await expect(page.getByLabel("Nom d'utilisateur")).toHaveValue('');
    await expect(page.getByLabel("E-mail")).toHaveValue('');
    await expect(page.getByLabel("Mot de passe")).toHaveValue('');
  });

  test("refuse un email déjà utilisé", async ({ page }) => {
    // 1ère inscription
    await page.getByLabel("Nom d'utilisateur").fill('jdupont');
    await page.getByLabel("E-mail").fill('jean.dupont@example.com');
    await page.getByLabel("Mot de passe").fill('secret123');
    await page.getByRole('button', { name: 'Créer mon compte' }).click();
    await expect(page.getByRole('alert')).toHaveText(/succès/i);

    // 2ème inscription même e-mail
    await page.getByLabel("Nom d'utilisateur").fill('autreuser');
    await page.getByLabel("E-mail").fill('jean.dupont@example.com');
    await page.getByLabel("Mot de passe").fill('secret456');
    await page.getByRole('button', { name: 'Créer mon compte' }).click();

    await expect(page.getByRole('alert')).toHaveText(/existe déjà/i);
  });
});
