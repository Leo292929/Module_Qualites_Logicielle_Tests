import { HttpBadRequest, HttpForbidden } from "@httpx/exception";
import { z } from "zod";
import {
  createAccountInRepository,
  getAccountsFromRepository,
  deleteAccountInRepository,
} from "./account.repository";

const CreateAccountSchema = z.object({
  userId: z.number().int().positive(),
  amount: z.number(),
});

const GetAccountsSchema = z.object({
  userId: z.number().int().positive(),
});

const DeleteAccountSchema = z.object({
  userId: z.number().int().positive(),
  accountId: z.number().int().positive(),
});

export async function createAccount(data) {
  const result = CreateAccountSchema.safeParse(data);

  if (result.success) {
    if (result.data.amount < 0) {
      throw new HttpForbidden("Initial amount cannot be negative.");
    }
    return createAccountInRepository(result.data);
  } else {
    throw new HttpBadRequest(result.error);
  }
}

export async function getAccounts(data) {
  const result = GetAccountsSchema.safeParse(data);

  if (result.success) {
    return getAccountsFromRepository(result.data.userId);
  } else {
    throw new HttpBadRequest(result.error);
  }
}

export async function deleteAccount(data) {
  const result = DeleteAccountSchema.safeParse(data);

  if (result.success) {
    const deleted = await deleteAccountInRepository(result.data);
    if (!deleted) {
      throw new HttpBadRequest("Account not found for this user.");
    }
    return deleted;
  } else {
    throw new HttpBadRequest(result.error);
  }
}