import bcrypt from 'bcryptjs';
import { db } from './db';
import { users, userSessions, moduleProgress } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import type { InsertUser, PathType, ModuleType } from '@shared/schema';

const MODULES: ModuleType[] = [
  'welcome',
  'job-listings',
  'skill-discovery',
  'resume-builder',
  'ats-optimization',
  'linkedin-optimizer',
  'interview-coach',
  'document-writer',
];

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createUser(email: string, password: string, fullName?: string) {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    throw new Error('Email already registered');
  }

  const passwordHash = await hashPassword(password);

  const [newUser] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      fullName,
    })
    .returning();

  return newUser;
}

export async function getUserByEmail(email: string) {
  return db.query.users.findFirst({
    where: eq(users.email, email),
  });
}

export async function getUserById(id: string) {
  return db.query.users.findFirst({
    where: eq(users.id, id),
  });
}

export async function createUserSession(userId: string, pathType: PathType) {
  // Create user session
  const [newSession] = await db
    .insert(userSessions)
    .values({
      userId,
      pathType,
      currentModule: 'welcome',
    })
    .returning();

  // Initialize module progress
  for (const moduleName of MODULES) {
    const isFirst = moduleName === 'welcome';
    await db.insert(moduleProgress).values({
      sessionId: newSession.id,
      moduleName,
      status: isFirst ? 'in_progress' : 'locked',
      progress: 0,
      startedAt: isFirst ? new Date() : null,
    });
  }

  return newSession;
}

export async function getUserSession(sessionId: string) {
  return db.query.userSessions.findFirst({
    where: eq(userSessions.id, sessionId),
  });
}

export async function getUserSessions(userId: string) {
  return db.query.userSessions.findMany({
    where: eq(userSessions.userId, userId),
  });
}

export async function updateCurrentModule(sessionId: string, moduleName: ModuleType) {
  return db
    .update(userSessions)
    .set({ currentModule: moduleName })
    .where(eq(userSessions.id, sessionId))
    .returning();
}

export async function completeModule(sessionId: string, moduleName: ModuleType) {
  const modules = MODULES;
  const currentIndex = modules.indexOf(moduleName);
  const nextModule = modules[currentIndex + 1];

  // Mark current module as completed
  await db
    .update(moduleProgress)
    .set({
      status: 'completed',
      completedAt: new Date(),
      progress: 100,
    })
    .where(
      and(
        eq(moduleProgress.sessionId, sessionId),
        eq(moduleProgress.moduleName, moduleName)
      )
    );

  // Unlock next module if exists
  if (nextModule) {
    await db
      .update(moduleProgress)
      .set({
        status: 'in_progress',
        startedAt: new Date(),
      })
      .where(
        and(
          eq(moduleProgress.sessionId, sessionId),
          eq(moduleProgress.moduleName, nextModule)
        )
      );
  }

  return true;
}

export async function getModuleProgress(sessionId: string) {
  return db.query.moduleProgress.findMany({
    where: eq(moduleProgress.sessionId, sessionId),
  });
}

export async function isModuleUnlocked(sessionId: string, moduleName: ModuleType) {
  const progress = await db.query.moduleProgress.findFirst({
    where: (t) =>
      eq(t.sessionId, sessionId) &&
      eq(t.moduleName, moduleName),
  });

  return progress && (progress.status === 'in_progress' || progress.status === 'completed');
}

export async function updateModuleProgress(
  sessionId: string,
  moduleName: ModuleType,
  progress: number
) {
  return db
    .update(moduleProgress)
    .set({ progress: Math.min(100, progress) })
    .where(
      and(
        eq(moduleProgress.sessionId, sessionId),
        eq(moduleProgress.moduleName, moduleName)
      )
    )
    .returning();
}
