import { describe, it, vi, expect, afterEach } from "vitest";
import { createAccount, getAccounts, deleteAccount } from "./account.service.js";
import {
  createAccountInRepository,
  getAccountsFromRepository,
  deleteAccountInRepository,
} from "./account.repository.js";

vi.mock("./account.repository", async (importOriginal) => ({
  ...(await importOriginal()),
  createAccountInRepository: vi.fn((data) => ({
    id: 10,
    userId: data.userId,
    amount: data.amount,
  })),
  getAccountsFromRepository: vi.fn((userId) => ([
    { id: 1, userId, amount: 100 },
    { id: 2, userId, amount: 250.5 },
  ])),
  deleteAccountInRepository: vi.fn(({ userId, accountId }) => ({
    id: accountId,
    userId,
    amount: 0,
  })),
}));

describe("Account Service", () => {
  afterEach(() => vi.clearAllMocks());

  it("createAccount réussi", async () => {
    const account = await createAccount({ userId: 1, amount: 150 });

    expect(account).toBeDefined();
    expect(account.id).toBeDefined();
    expect(account.id).toBeTypeOf("number");
    expect(account.userId).toBe(1);
    expect(account.amount).toBe(150);

    expect(createAccountInRepository).toHaveBeenCalledTimes(1);
    expect(createAccountInRepository).toHaveBeenCalledWith({
      userId: 1,
      amount: 150,
    });
  });

  it("createAccount échoue avec de mauvais paramètres", async () => {
    // manque amount -> HttpBadRequest
    await expect(createAccount({ userId: 1 })).rejects.toMatchObject({
      name: "HttpBadRequest",
      statusCode: 400,
    });

    // amount négatif -> HttpForbidden
    await expect(
      createAccount({ userId: 1, amount: -5 })
    ).rejects.toMatchObject({
      name: "HttpForbidden",
      statusCode: 403,
    });

    expect(createAccountInRepository).not.toHaveBeenCalled();
  });

  it("getAccounts réussi en vérifiant chaque élément de la liste", async () => {
    const userId = 2;
    const accounts = await getAccounts({ userId });

    expect(Array.isArray(accounts)).toBe(true);
    expect(accounts.length).toBe(2);

    for (const a of accounts) {
      expect(a).toHaveProperty("id");
      expect(a.id).toBeTypeOf("number");
      expect(a.userId).toBe(userId);
      expect(a.amount).toBeTypeOf("number");
    }

    expect(getAccountsFromRepository).toHaveBeenCalledTimes(1);
    expect(getAccountsFromRepository).toHaveBeenCalledWith(userId);
  });

  it("deleteAccount réussi", async () => {
    const userId = 3;
    const accountId = 42;

    const deleted = await deleteAccount({ userId, accountId });

    expect(deleted).toBeDefined();
    expect(deleted.id).toBe(accountId);
    expect(deleted.userId).toBe(userId);

    expect(deleteAccountInRepository).toHaveBeenCalledTimes(1);
    expect(deleteAccountInRepository).toHaveBeenCalledWith({ userId, accountId });
  });

  it("deleteAccount échoue avec un mauvais id d'Account", async () => {
    // on change le mock pour renvoyer null (account inexistant)
    deleteAccountInRepository.mockImplementationOnce(() => null);

    await expect(
      deleteAccount({ userId: 1, accountId: 9999 })
    ).rejects.toMatchObject({
      name: "HttpBadRequest",
      statusCode: 400,
    });

    expect(deleteAccountInRepository).toHaveBeenCalledTimes(1);
    expect(deleteAccountInRepository).toHaveBeenCalledWith({
      userId: 1,
      accountId: 9999,
    });
  });
});
