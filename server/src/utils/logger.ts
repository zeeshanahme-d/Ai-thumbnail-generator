// The only place that writes to the console. On Vercel, stdout and stderr are the runtime logs,
// and the console method decides the level shown, so nothing here writes files or ships logs.
// Never pass passwords, tokens, codes, cookies, emails or prompts: identify people by userId.

type Level = "debug" | "info" | "warn" | "error";
type Context = Record<string, unknown>;

const LEVELS: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };

const isProduction = () => process.env.NODE_ENV === "production";

// Read on every call: dotenv may load after this module is imported.
const minLevel = (): number => LEVELS[process.env.LOG_LEVEL as Level] ?? (isProduction() ? LEVELS.info : LEVELS.debug);

// Error fields are not enumerable, so JSON.stringify would print {}.
function serialize(value: unknown, depth = 0): unknown {
  if (!(value instanceof Error)) return value;
  const { code, status } = value as Error & { code?: unknown; status?: unknown };
  return {
    name: value.name,
    message: value.message,
    ...(code !== undefined && { code }),
    ...(status !== undefined && { status }),
    stack: value.stack,
    ...(value.cause !== undefined && depth < 3 && { cause: serialize(value.cause, depth + 1) }),
  };
}

function write(level: Level, msg: string, context: Context = {}) {
  if (LEVELS[level] < minLevel()) return;

  const print = level === "error" ? console.error : level === "warn" ? console.warn : console.log;

  if (!isProduction()) {
    const time = new Date().toISOString().slice(11, 23);
    const extra = Object.keys(context).length ? [context] : [];
    print(`${time} ${level.toUpperCase().padEnd(5)} ${msg}`, ...extra);
    return;
  }

  const fields: Context = {};
  for (const [key, value] of Object.entries(context)) fields[key] = serialize(value);

  try {
    print(JSON.stringify({ level, time: new Date().toISOString(), msg, ...fields }));
  } catch {
    // A circular value must not take the request down with it.
    print(JSON.stringify({ level, time: new Date().toISOString(), msg, context: "[unserializable]" }));
  }
}

export const logger = {
  debug: (msg: string, context?: Context) => write("debug", msg, context),
  info: (msg: string, context?: Context) => write("info", msg, context),
  warn: (msg: string, context?: Context) => write("warn", msg, context),
  error: (msg: string, context?: Context) => write("error", msg, context),
};

export default logger;
