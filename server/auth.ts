import type { IncomingMessage, ServerResponse } from 'http';
import { getAuthEnvironment } from './env';
import { getPrisma } from './prisma';

type NodeAuthHandler = (
  request: IncomingMessage,
  response: ServerResponse
) => Promise<void>;

let authHandlerPromise: Promise<NodeAuthHandler> | undefined;

async function createAuthHandler(): Promise<NodeAuthHandler> {
  const [{ prismaAdapter }, { betterAuth }, { toNodeHandler }] = await Promise.all([
    import('@better-auth/prisma-adapter'),
    import('better-auth'),
    import('better-auth/node'),
  ]);

  const environment = getAuthEnvironment();
  const prisma = getPrisma();
  const socialProviders = environment.google
    ? {
        google: {
          clientId: environment.google.clientId,
          clientSecret: environment.google.clientSecret,
        },
      }
    : {};

  const auth = betterAuth({
    appName: 'DreamShop',
    baseURL: environment.baseUrl,
    basePath: '/api/auth',
    secret: environment.secret,
    database: prismaAdapter(prisma, {
      provider: 'postgresql',
      transaction: true,
    }),
    trustedOrigins: environment.trustedOrigins,
    socialProviders,
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      requireEmailVerification: true,
      minPasswordLength: 10,
      maxPasswordLength: 128,
      autoSignIn: false,
      revokeSessionsOnPasswordReset: true,
    },
    user: {
      additionalFields: {
        phoneNumber: {
          type: 'string',
          required: false,
          input: false,
        },
        phoneNumberVerified: {
          type: 'boolean',
          required: false,
          defaultValue: false,
          input: false,
        },
        role: {
          type: 'string',
          required: true,
          defaultValue: 'CUSTOMER',
          input: false,
        },
        telegramUserId: {
          type: 'string',
          required: false,
          input: false,
        },
        telegramUsername: {
          type: 'string',
          required: false,
          input: false,
        },
        firebaseUid: {
          type: 'string',
          required: false,
          input: false,
        },
      },
      changeEmail: {
        enabled: false,
      },
      deleteUser: {
        enabled: false,
      },
      accountLinking: {
        enabled: true,
        trustedProviders: ['google'],
        allowDifferentEmails: false,
        allowUnlinkingAll: false,
      },
    },
    account: {
      encryptOAuthTokens: true,
      storeStateStrategy: 'database',
    },
    verification: {
      storeIdentifier: 'hashed',
      storeInDatabase: true,
    },
    rateLimit: {
      enabled: true,
      window: 60,
      max: 60,
      customRules: {
        '/sign-in/email': {
          window: 60,
          max: 10,
        },
        '/sign-up/email': {
          window: 60,
          max: 5,
        },
        '/forget-password': {
          window: 300,
          max: 5,
        },
      },
    },
  });

  return toNodeHandler(auth);
}

export function getAuthHandler(): Promise<NodeAuthHandler> {
  if (!authHandlerPromise) {
    authHandlerPromise = createAuthHandler();
  }

  return authHandlerPromise;
}
