const express = require("express");
const helmet = require("helmet");
const path = require("path");
const { createClient } = require("redis");

const app = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_TRANSLATIONS = new Set(["web", "kjv", "asv", "bbe"]);
const MAX_REFERENCE_LENGTH = 80;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 60;
const rateBuckets = new Map();
const TRUST_PROXY_SETTING = process.env.TRUST_PROXY === "1";
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const REDIS_URL = process.env.REDIS_URL || "";
const LOG_REQUESTS = process.env.LOG_REQUESTS !== "0";
const ALERT_WINDOW_MS = Number(process.env.ALERT_WINDOW_MS || 60_000);
const ALERT_4XX_THRESHOLD = Number(process.env.ALERT_4XX_THRESHOLD || 25);
const ALERT_429_THRESHOLD = Number(process.env.ALERT_429_THRESHOLD || 10);
const TOPICS = [
  {
    id: "holy-spirit",
    name: "Holy Spirit",
    description: "Key passages on the person and work of the Holy Spirit.",
    references: [
      "John 14:26",
      "John 16:13",
      "Acts 1:8",
      "Romans 8:26",
      "Galatians 5:22-23",
    ],
  },
  {
    id: "burial-resurrection",
    name: "Jesus' Burial and Resurrection",
    description: "Core passages on Christ's death, burial, and resurrection.",
    references: [
      "Matthew 27:59-60",
      "Mark 16:6",
      "Luke 24:6-7",
      "John 20:1-2",
      "1 Corinthians 15:3-4",
    ],
  },
  {
    id: "creation",
    name: "Creation of the Universe",
    description: "Passages describing God as Creator.",
    references: [
      "Genesis 1:1",
      "Psalm 19:1",
      "John 1:1-3",
      "Colossians 1:16",
      "Hebrews 11:3",
    ],
  },
  {
    id: "salvation",
    name: "Salvation",
    description: "Verses about grace, faith, and redemption.",
    references: [
      "John 3:16",
      "Romans 10:9",
      "Ephesians 2:8-9",
      "Titus 3:5",
      "1 Peter 1:3",
    ],
  },
  {
    id: "prayer",
    name: "Prayer",
    description: "Encouragement and instruction for prayer.",
    references: [
      "Matthew 6:9-13",
      "Philippians 4:6-7",
      "1 Thessalonians 5:17",
      "James 5:16",
      "1 John 5:14",
    ],
  },
  {
    id: "faith",
    name: "Faith",
    description: "Passages about trusting God and living by faith.",
    references: [
      "Hebrews 11:1",
      "Romans 1:17",
      "2 Corinthians 5:7",
      "James 1:3",
      "Mark 11:24",
    ],
  },
];
const alertBuckets = new Map();
let redisClient = null;
let redisReady = false;

if (REDIS_URL) {
  redisClient = createClient({
    url: REDIS_URL,
    socket: {
      reconnectStrategy(retries) {
        return Math.min(retries * 100, 3000);
      },
    },
  });

  redisClient.on("ready", () => {
    redisReady = true;
    console.log("Redis rate limiter connected.");
  });

  redisClient.on("error", (error) => {
    redisReady = false;
    console.warn(
      `Redis unavailable, using in-memory rate limiter: ${error.message}`,
    );
  });

  redisClient.connect().catch((error) => {
    redisReady = false;
    console.warn(
      `Redis connection failed, using in-memory rate limiter: ${error.message}`,
    );
  });
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, bucket] of rateBuckets.entries()) {
    if (now > bucket.resetAt) {
      rateBuckets.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW_MS).unref();

setInterval(() => {
  const now = Date.now();
  for (const [ip, bucket] of alertBuckets.entries()) {
    if (now > bucket.resetAt) {
      alertBuckets.delete(ip);
    }
  }
}, ALERT_WINDOW_MS).unref();

function getClientIp(req) {
  return req.ip || req.socket.remoteAddress || "unknown";
}

function recordSecurityTelemetry(req, statusCode, durationMs) {
  if (LOG_REQUESTS) {
    console.log(
      JSON.stringify({
        ts: new Date().toISOString(),
        method: req.method,
        path: req.originalUrl,
        ip: getClientIp(req),
        status: statusCode,
        durationMs,
      }),
    );
  }

  if (statusCode < 400 || statusCode >= 500) {
    return;
  }

  const now = Date.now();
  const ip = getClientIp(req);
  let bucket = alertBuckets.get(ip);

  if (!bucket || now > bucket.resetAt) {
    bucket = {
      status4xx: 0,
      status429: 0,
      resetAt: now + ALERT_WINDOW_MS,
      lastAlertAt: 0,
    };
    alertBuckets.set(ip, bucket);
  }

  bucket.status4xx += 1;
  if (statusCode === 429) {
    bucket.status429 += 1;
  }

  const overLimit =
    bucket.status4xx >= ALERT_4XX_THRESHOLD ||
    bucket.status429 >= ALERT_429_THRESHOLD;
  const alertCooldown = ALERT_WINDOW_MS / 2;

  if (overLimit && now - bucket.lastAlertAt >= alertCooldown) {
    bucket.lastAlertAt = now;
    console.warn(
      JSON.stringify({
        level: "warn",
        event: "traffic_threshold_exceeded",
        ip,
        status4xx: bucket.status4xx,
        status429: bucket.status429,
        windowMs: ALERT_WINDOW_MS,
      }),
    );
  }
}

function applyInMemoryRateLimit(ip) {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);

  if (!bucket || now > bucket.resetAt) {
    rateBuckets.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  bucket.count += 1;
  return true;
}

async function applyRedisRateLimit(ip) {
  if (!redisClient || !redisReady) {
    return null;
  }

  const windowId = Math.floor(Date.now() / RATE_LIMIT_WINDOW_MS);
  const key = `rl:${ip}:${windowId}`;
  const tx = redisClient.multi();
  tx.incr(key);
  tx.pExpire(key, RATE_LIMIT_WINDOW_MS, "NX");
  const results = await tx.exec();
  const currentCount = Number(results && results[0]);

  if (Number.isNaN(currentCount)) {
    return null;
  }

  return currentCount <= RATE_LIMIT_MAX_REQUESTS;
}

app.disable("x-powered-by");
app.set("trust proxy", TRUST_PROXY_SETTING);

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    recordSecurityTelemetry(req, res.statusCode, Date.now() - start);
  });
  next();
});

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'"],
        imgSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
    referrerPolicy: { policy: "no-referrer" },
    frameguard: { action: "deny" },
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-origin" },
    permissionsPolicy: {
      features: {
        camera: [],
        microphone: [],
        geolocation: [],
      },
    },
    hsts: IS_PRODUCTION
      ? {
          maxAge: 15552000,
          includeSubDomains: true,
          preload: false,
        }
      : false,
  }),
);

app.use(async (req, res, next) => {
  const ip = getClientIp(req);

  try {
    const redisDecision = await applyRedisRateLimit(ip);
    const allowed =
      redisDecision === null ? applyInMemoryRateLimit(ip) : redisDecision;

    if (!allowed) {
      return res.status(429).json({
        error: "Too many requests. Please wait and try again.",
      });
    }

    return next();
  } catch (error) {
    const allowed = applyInMemoryRateLimit(ip);
    if (!allowed) {
      return res.status(429).json({
        error: "Too many requests. Please wait and try again.",
      });
    }
    return next();
  }
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/README.md", (req, res) => {
  return res.sendFile(path.join(__dirname, "README.md"));
});

function cleanTranslation(raw) {
  const translation = String(raw || "")
    .trim()
    .toLowerCase();
  if (!translation) {
    return "";
  }
  return ALLOWED_TRANSLATIONS.has(translation) ? translation : null;
}

function isValidReference(reference) {
  if (!reference || reference.length > MAX_REFERENCE_LENGTH) {
    return false;
  }
  return /^[a-z0-9\s:;,.\-']+$/i.test(reference);
}

function isValidBook(book) {
  if (!book || book.length > 40) {
    return false;
  }
  return /^[1-3]?\s?[a-z]+(?:\s+[a-z]+)*$/i.test(book);
}

function isValidChapter(chapter) {
  return /^\d{1,3}$/.test(chapter);
}

function isValidTopicId(topicId) {
  return /^[a-z0-9-]{2,40}$/.test(topicId);
}

async function fetchBibleData(reference, translation) {
  const params = new URLSearchParams();

  if (translation) {
    params.set("translation", translation);
  }

  const query = params.toString();
  const upstreamUrl = `https://bible-api.com/${encodeURIComponent(reference)}${query ? `?${query}` : ""}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  let response;
  try {
    response = await fetch(upstreamUrl, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });
  } catch (error) {
    if (error && error.name === "AbortError") {
      return {
        ok: false,
        status: 504,
        data: null,
      };
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      data: null,
    };
  }

  const data = await response.json();
  return {
    ok: true,
    status: response.status,
    data,
  };
}

app.get("/api/verse", async (req, res) => {
  const reference = (req.query.reference || "").trim();
  const translation = cleanTranslation(req.query.translation);

  res.setHeader("Cache-Control", "no-store");

  if (!reference) {
    return res.status(400).json({
      error: "Missing reference query parameter",
      example: "/api/verse?reference=John 3:16",
    });
  }

  if (!isValidReference(reference)) {
    return res.status(400).json({
      error: "Invalid reference format.",
    });
  }

  if (translation === null) {
    return res.status(400).json({
      error: "Unsupported translation.",
    });
  }

  try {
    const result = await fetchBibleData(reference, translation);

    if (!result.ok) {
      return res.status(result.status).json({
        error: "Could not find verse",
        reference,
        translation: translation || null,
      });
    }
    const data = result.data;

    return res.json({
      query: reference,
      canonicalReference: data.reference,
      translation: data.translation_name,
      translationId: data.translation_id,
      text: data.text,
      verses: data.verses || [],
    });
  } catch (error) {
    return res.status(500).json({
      error: "Server error while fetching verse",
    });
  }
});

app.get("/api/chapter-meta", async (req, res) => {
  const book = (req.query.book || "").trim();
  const chapter = (req.query.chapter || "").trim();
  const translation = cleanTranslation(req.query.translation);

  res.setHeader("Cache-Control", "no-store");

  if (!book || !chapter) {
    return res.status(400).json({
      error: "Missing book or chapter query parameter",
      example: "/api/chapter-meta?book=John&chapter=3",
    });
  }

  if (!isValidBook(book) || !isValidChapter(chapter)) {
    return res.status(400).json({
      error: "Invalid book or chapter format.",
    });
  }

  if (translation === null) {
    return res.status(400).json({
      error: "Unsupported translation.",
    });
  }

  const reference = `${book} ${chapter}`;

  try {
    const result = await fetchBibleData(reference, translation);

    if (!result.ok) {
      return res.status(result.status).json({
        error: "Could not find chapter",
        reference,
        translation: translation || null,
      });
    }

    const data = result.data;
    return res.json({
      reference: data.reference,
      translation: data.translation_name,
      translationId: data.translation_id,
      verseCount: (data.verses || []).length,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Server error while fetching chapter metadata",
    });
  }
});

app.get("/api/topics", (req, res) => {
  const q = String(req.query.q || "")
    .trim()
    .toLowerCase();

  const list = TOPICS.filter((topic) => {
    if (!q) {
      return true;
    }

    return (
      topic.name.toLowerCase().includes(q) ||
      topic.description.toLowerCase().includes(q)
    );
  }).map((topic) => ({
    id: topic.id,
    name: topic.name,
    description: topic.description,
  }));

  return res.json({
    count: list.length,
    topics: list,
  });
});

app.get("/api/topic-verses", async (req, res) => {
  const topicId = String(req.query.topic || "")
    .trim()
    .toLowerCase();
  const translation = cleanTranslation(req.query.translation);

  res.setHeader("Cache-Control", "no-store");

  if (!topicId || !isValidTopicId(topicId)) {
    return res.status(400).json({
      error: "Missing or invalid topic query parameter.",
    });
  }

  if (translation === null) {
    return res.status(400).json({
      error: "Unsupported translation.",
    });
  }

  const topic = TOPICS.find((item) => item.id === topicId);
  if (!topic) {
    return res.status(404).json({
      error: "Topic not found.",
    });
  }

  try {
    const results = await Promise.all(
      topic.references.map(async (reference) => {
        const fetched = await fetchBibleData(reference, translation);

        if (!fetched.ok || !fetched.data) {
          return null;
        }

        return {
          query: reference,
          canonicalReference: fetched.data.reference,
          translation: fetched.data.translation_name,
          translationId: fetched.data.translation_id,
          text: fetched.data.text,
        };
      }),
    );

    const verses = results.filter(Boolean);
    return res.json({
      topic: {
        id: topic.id,
        name: topic.name,
        description: topic.description,
      },
      count: verses.length,
      verses,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Server error while fetching topic verses",
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `Bible API running at http://localhost:${PORT} (trust proxy: ${TRUST_PROXY_SETTING ? "enabled" : "disabled"})`,
  );
});
