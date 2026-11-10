import { eq } from 'drizzle-orm';
import { db } from './index.ts';
import { users } from './schema.ts';

export async function getOrCreateUser(uid: string, email: string) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in getOrCreateUser:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function findUserByUid(uid: string) {
  try {
    const rows = await db.select().from(users).where(eq(users.uid, uid));
    return rows[0] || null;
  } catch (error) {
    console.error('Database query failed in findUserByUid:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function registerOrUpdateAccount(params: {
  uid: string;
  email: string;
  authType: string;
  secretHash: string;
  payloadJson: string;
}) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid: params.uid,
        email: params.email,
        authType: params.authType,
        secretHash: params.secretHash,
        payloadJson: params.payloadJson,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email: params.email,
          authType: params.authType,
          secretHash: params.secretHash,
          payloadJson: params.payloadJson,
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in registerOrUpdateAccount:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function updateAccountPayload(uid: string, email: string, payloadJson: string) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        payloadJson,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          payloadJson,
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in updateAccountPayload:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}
