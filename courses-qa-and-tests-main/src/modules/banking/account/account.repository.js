import { sql } from "../../../infrastructure/db";

export async function createAccountInRepository({ userId, amount }) {
  const accounts = await sql`
    INSERT INTO accounts ("userId", amount)
    VALUES (${userId}, ${amount})
    RETURNING *
  `;

  return accounts[0];
}

export async function getAccountsFromRepository(userId) {
  return sql`
    SELECT * FROM accounts
    WHERE "userId" = ${userId}
    ORDER BY id ASC
  `;
}

export async function deleteAccountInRepository({ userId, accountId }) {
  const accounts = await sql`
    DELETE FROM accounts
    WHERE id = ${accountId} AND "userId" = ${userId}
    RETURNING *
  `;

  return accounts[0];
}