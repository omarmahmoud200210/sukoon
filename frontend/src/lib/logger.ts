import * as Sentry from "@sentry/react";

type LogArgs = unknown[];

const isDev = import.meta.env.DEV;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const noop = () => {};

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/**
 * Verbose debug output — dev only, stripped in production builds.
 */
const debug = isDev ? console.debug.bind(console) : noop;

/**
 * General informational messages — dev only.
 */
const info = isDev ? console.info.bind(console) : noop;

/**
 * Warnings — always printed.
 */
const warn = console.warn.bind(console);

/**
 * Errors — always printed, and forwarded to Sentry as a captured message or
 * exception so it surfaces in the Issues dashboard.
 */
function error(message: string, ...rest: LogArgs) {
  console.error(message, ...rest);

  // Forward to Sentry — prefer an Error instance if one was provided.
  const errorObj = rest.find((arg): arg is Error => arg instanceof Error);

  if (errorObj) {
    Sentry.captureException(errorObj, {
      extra: { context: message },
    });
  } else {
    Sentry.captureMessage(message, {
      level: "error",
      extra: { details: rest },
    });
  }
}

const logger = { debug, info, warn, error } as const;

export default logger;
