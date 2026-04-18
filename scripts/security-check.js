const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const ADMIN_API_KEY_TEST = process.env.ADMIN_API_KEY_TEST || "";

const checks = [];

function assert(name, condition, details) {
  checks.push({ name, passed: Boolean(condition), details: details || "" });
}

async function fetchJson(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, options);
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }
  return { response, payload };
}

async function main() {
  const homeResponse = await fetch(`${BASE_URL}/`);

  assert(
    "Home responds",
    homeResponse.status === 200,
    `status=${homeResponse.status}`,
  );

  const csp = homeResponse.headers.get("content-security-policy") || "";
  assert(
    "CSP header exists",
    csp.includes("default-src 'self'"),
    csp || "missing",
  );

  assert(
    "Frame protection",
    (homeResponse.headers.get("x-frame-options") || "").toUpperCase() ===
      "DENY",
    homeResponse.headers.get("x-frame-options") || "missing",
  );

  assert(
    "No MIME sniffing",
    (homeResponse.headers.get("x-content-type-options") || "").toLowerCase() ===
      "nosniff",
    homeResponse.headers.get("x-content-type-options") || "missing",
  );

  const validVerse = await fetchJson(
    "/api/verse?reference=John%203:16&translation=web",
  );
  assert(
    "Valid verse returns 200",
    validVerse.response.status === 200,
    `status=${validVerse.response.status}`,
  );

  const badReference = await fetchJson(
    "/api/verse?reference=%3Cscript%3Ealert(1)%3C/script%3E&translation=web",
  );
  assert(
    "Bad reference rejected",
    badReference.response.status === 400,
    `status=${badReference.response.status}`,
  );

  const badTranslation = await fetchJson(
    "/api/verse?reference=John%203:16&translation=hacker",
  );
  assert(
    "Bad translation rejected",
    badTranslation.response.status === 400,
    `status=${badTranslation.response.status}`,
  );

  const adminNoKey = await fetchJson("/api/admin/telemetry");
  const adminNoKeyAllowedStatuses = new Set([401, 503]);
  assert(
    "Admin telemetry blocked without key",
    adminNoKeyAllowedStatuses.has(adminNoKey.response.status),
    `status=${adminNoKey.response.status}`,
  );

  if (ADMIN_API_KEY_TEST) {
    const adminWithKey = await fetchJson("/api/admin/telemetry", {
      headers: {
        "x-admin-key": ADMIN_API_KEY_TEST,
      },
    });

    assert(
      "Admin telemetry works with key",
      adminWithKey.response.status === 200,
      `status=${adminWithKey.response.status}`,
    );
  }

  let tooMany = 0;
  for (let i = 0; i < 70; i += 1) {
    const response = await fetch(
      `${BASE_URL}/api/chapter-meta?book=John&chapter=3&translation=web`,
    );
    if (response.status === 429) {
      tooMany += 1;
    }
  }

  assert("Rate limiting triggers", tooMany > 0, `429_count=${tooMany}`);

  const failed = checks.filter((check) => !check.passed);
  for (const check of checks) {
    const status = check.passed ? "PASS" : "FAIL";
    const suffix = check.details ? ` (${check.details})` : "";
    console.log(`${status}: ${check.name}${suffix}`);
  }

  if (failed.length > 0) {
    process.exitCode = 1;
    return;
  }

  console.log("All security checks passed.");
}

main().catch((error) => {
  console.error("Security checks failed to run:", error.message);
  process.exit(1);
});
