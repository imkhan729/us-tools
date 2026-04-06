import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, Copy, FileJson, KeyRound, RefreshCw, ShieldAlert, Wand2 } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type TimestampState = {
  label: string;
  value: string;
  status: string;
};

function normalizeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4;
  return padding ? normalized.padEnd(normalized.length + (4 - padding), "=") : normalized;
}

function decodeBase64UrlToBytes(input: string) {
  const binary = window.atob(normalizeBase64Url(input));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function decodeJwtSegment(segment: string) {
  const bytes = decodeBase64UrlToBytes(segment);
  const text = new TextDecoder().decode(bytes);
  return {
    raw: text,
    json: JSON.parse(text) as Record<string, unknown>,
  };
}

function formatTimestamp(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "n/a";
  return new Date(value * 1000).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

function getTimestampState(label: string, value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return { label, value: "n/a", status: "Not present" };
  }

  const nowSeconds = Date.now() / 1000;
  if (label === "exp") {
    return {
      label,
      value: formatTimestamp(value),
      status: value < nowSeconds ? "Expired" : "Active",
    };
  }

  if (label === "nbf") {
    return {
      label,
      value: formatTimestamp(value),
      status: value > nowSeconds ? "Not active yet" : "Already valid",
    };
  }

  return {
    label,
    value: formatTimestamp(value),
    status: "Recorded",
  };
}

const SAMPLE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRlbW8ta2V5LTEifQ.eyJzdWIiOiJ1c2VyXzEyMyIsIm5hbWUiOiJBdmEgU3RvbmUiLCJyb2xlIjoiYWRtaW4iLCJpc3MiOiJ1dGlsaXR5LWh1YiIsImF1ZCI6IndlYi1hcHAiLCJpYXQiOjE4OTM0NTYwMDAsIm5iZiI6MTg5MzQ1NjAwMCwiZXhwIjoxODk2MDQ4MDAwLCJzY29wZSI6InJlYWQ6dG9vbHMgd3JpdGU6cmVwb3J0cyJ9.c2lnbmF0dXJlLXBsYWNlaG9sZGVy";

export default function JwtDecoder() {
  const [token, setToken] = useState(SAMPLE_TOKEN);
  const [copiedLabel, setCopiedLabel] = useState("");

  const analysis = useMemo(() => {
    const trimmed = token.trim();
    if (!trimmed) {
      return {
        error: "Paste a JWT to decode it.",
        header: null as null | Record<string, unknown>,
        payload: null as null | Record<string, unknown>,
        segments: [] as string[],
        headerText: "",
        payloadText: "",
      };
    }

    const segments = trimmed.split(".");
    if (segments.length !== 3) {
      return {
        error: "A JWT should contain exactly three segments separated by periods.",
        header: null,
        payload: null,
        segments,
        headerText: "",
        payloadText: "",
      };
    }

    try {
      const header = decodeJwtSegment(segments[0]);
      const payload = decodeJwtSegment(segments[1]);
      return {
        error: "",
        header: header.json,
        payload: payload.json,
        segments,
        headerText: JSON.stringify(header.json, null, 2),
        payloadText: JSON.stringify(payload.json, null, 2),
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to decode the JWT.",
        header: null,
        payload: null,
        segments,
        headerText: "",
        payloadText: "",
      };
    }
  }, [token]);

  const signatureSegment = analysis.segments[2] ?? "";
  const timestampCards: TimestampState[] = analysis.payload
    ? [getTimestampState("iat", analysis.payload.iat), getTimestampState("nbf", analysis.payload.nbf), getTimestampState("exp", analysis.payload.exp)]
    : [];

  const summaryClaims = analysis.payload
    ? [
        { label: "Issuer", value: String(analysis.payload.iss ?? "n/a") },
        { label: "Audience", value: Array.isArray(analysis.payload.aud) ? analysis.payload.aud.join(", ") : String(analysis.payload.aud ?? "n/a") },
        { label: "Subject", value: String(analysis.payload.sub ?? "n/a") },
        { label: "Role", value: String(analysis.payload.role ?? "n/a") },
      ]
    : [];

  const copyValue = async (label: string, value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const loadSample = () => setToken(SAMPLE_TOKEN);
  const clearAll = () => setToken("");

  return (
    <UtilityToolPageShell
      title="JWT Decoder"
      seoTitle="JWT Decoder - Decode JSON Web Tokens Online"
      seoDescription="Free JWT decoder with local Base64URL parsing, header and payload inspection, claim summaries, timestamp decoding, and signature-length checks."
      canonical="https://usonlinetools.com/developer/jwt-decoder"
      categoryName="Developer Tools"
      categoryHref="/category/developer"
      heroDescription="Decode JSON Web Tokens locally in the browser and inspect the header, payload, claims, and token timestamps without sending the token to a server. This JWT decoder is built for debugging auth flows, checking sample tokens, inspecting claims, and understanding what a token contains before you move into verification or backend troubleshooting."
      heroIcon={<KeyRound className="w-3.5 h-3.5" />}
      calculatorLabel="JWT Decode Workspace"
      calculatorDescription="Paste a JWT, decode the header and payload, inspect claims and timestamps, and confirm token structure without verifying the signature."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
            <div className="space-y-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <div className="grid grid-cols-2 gap-3">
                <button onClick={loadSample} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted">
                  <Wand2 className="w-4 h-4" />
                  Sample
                </button>
                <button onClick={clearAll} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted">
                  <RefreshCw className="w-4 h-4" />
                  Clear
                </button>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Decode Status</p>
                <div className={`rounded-2xl border p-4 ${analysis.error ? "border-rose-500/20 bg-rose-500/5" : "border-emerald-500/20 bg-emerald-500/5"}`}>
                  <div className="flex items-start gap-3">
                    {analysis.error ? <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />}
                    <div>
                      <p className="font-bold text-foreground mb-1">{analysis.error ? "Needs attention" : "Decoded locally"}</p>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {analysis.error || "The token structure is intact and the header and payload were decoded successfully. This page does not verify the signature."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Token Snapshot</p>
                <div className="space-y-2">
                  {[
                    { label: "Segments", value: String(analysis.segments.length) },
                    { label: "Algorithm", value: String(analysis.header?.alg ?? "n/a") },
                    { label: "Type", value: String(analysis.header?.typ ?? "n/a") },
                    { label: "Signature chars", value: signatureSegment ? String(signatureSegment.length) : "n/a" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="text-sm font-bold text-foreground break-all text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Important</p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Decoding a JWT is not the same as verifying it. This page reads the visible header and payload only. Signature validation still needs the correct secret or public key in the system that issued the token.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">JWT Input</p>
                  <p className="text-xs text-muted-foreground">{token.length} characters</p>
                </div>
                <textarea
                  value={token}
                  onChange={(event) => setToken(event.target.value)}
                  placeholder="Paste a JWT here..."
                  spellCheck={false}
                  className="min-h-[180px] w-full rounded-2xl border border-border bg-background p-4 font-mono text-sm leading-relaxed text-foreground outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Header</p>
                    <button onClick={() => copyValue("header", analysis.headerText)} className="text-xs font-bold text-blue-600 hover:text-blue-700" disabled={!analysis.headerText}>
                      {copiedLabel === "header" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={analysis.headerText || "Header will appear here when the token decodes successfully."}
                    spellCheck={false}
                    className="min-h-[260px] w-full rounded-2xl border border-border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none resize-none"
                  />
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Payload</p>
                    <button onClick={() => copyValue("payload", analysis.payloadText)} className="text-xs font-bold text-blue-600 hover:text-blue-700" disabled={!analysis.payloadText}>
                      {copiedLabel === "payload" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={analysis.payloadText || "Payload will appear here when the token decodes successfully."}
                    spellCheck={false}
                    className="min-h-[260px] w-full rounded-2xl border border-border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Common Claim Summary</p>
                  <div className="space-y-2">
                    {summaryClaims.length ? (
                      summaryClaims.map((item) => (
                        <div key={item.label} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                          <span className="text-sm font-bold text-foreground break-all text-right">{item.value}</span>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
                        Decode the token successfully to inspect issuer, audience, subject, and common custom claims.
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock3 className="w-4 h-4 text-blue-600" />
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">JWT Timestamps</p>
                  </div>
                  <div className="space-y-3">
                    {timestampCards.length ? (
                      timestampCards.map((item) => (
                        <div key={item.label} className="rounded-xl border border-border bg-muted/40 p-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-mono text-xs text-foreground">{item.label}</p>
                            <p className="text-xs font-bold text-blue-600">{item.status}</p>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{item.value}</p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
                        Decode the token to inspect issued-at, not-before, and expiration timestamps.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Copy-Ready Snippets</p>
                  <div className="space-y-3">
                    {[
                      { label: "Header JSON", value: analysis.headerText },
                      { label: "Payload JSON", value: analysis.payloadText },
                      { label: "Bearer Header", value: token ? `Authorization: Bearer ${token}` : "" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-border bg-muted/40 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                          <button onClick={() => copyValue(item.label, item.value)} className="text-xs font-bold text-blue-600 hover:text-blue-700" disabled={!item.value}>
                            {copiedLabel === item.label ? "Copied" : "Copy"}
                          </button>
                        </div>
                        <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100">
                          <code>{item.value || "Available after the token decodes successfully."}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <FileJson className="w-4 h-4 text-blue-600" />
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Segment Detail</p>
                    </div>
                    <div className="space-y-2">
                      {analysis.segments.map((segment, index) => (
                        <div key={`${index}-${segment.length}`} className="rounded-xl border border-border bg-muted/40 p-3">
                          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Segment {index + 1}</p>
                          <p className="mt-1 font-mono text-xs text-foreground break-all">{segment}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Debugging Tip</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      If a token decodes but authentication still fails, compare the issuer, audience, not-before, and expiration claims with what your backend expects before you assume the signature is the problem.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Paste the token exactly as it was issued", description: "A JWT is made of three Base64URL-encoded segments separated by periods. To decode it cleanly, paste the full token with no missing dots, no extra quotes, and no line breaks injected by logs or transport layers. Many JWT problems come from copy-paste damage rather than from the token itself, so starting with the exact raw token matters." },
        { title: "Check whether the header and payload decode successfully", description: "A JWT decoder first answers a structural question: does the token look like a JWT and do the visible segments decode into valid JSON objects? If the answer is no, you are dealing with a malformed token or a non-JWT string. If the answer is yes, you can move on to inspecting the claims and the surrounding auth flow with better context." },
        { title: "Inspect the claims that drive auth decisions", description: "The payload often contains the information that explains why a request is accepted or rejected. Issuer, audience, subject, roles, scopes, issued-at, not-before, and expiration timestamps all shape how a backend interprets the token. Seeing them in a readable form is often enough to spot an environment mismatch, a stale token, or a claim that does not line up with what the receiving service expects." },
        { title: "Treat decoding and verification as separate steps", description: "A decoder is useful because it lets you inspect a token quickly, but it is not the same as validating trust. The header and payload are just the visible portions of the token. The signature still needs to be verified by the right secret or public key in the correct auth context. That distinction is important because a token can decode perfectly and still fail verification or authorization." },
      ]}
      interpretationCards={[
        { title: "Decoded does not mean trusted", description: "If a JWT decodes successfully, it only proves that the visible header and payload are structurally readable. It does not prove that the token was issued by a trusted system or that the signature is valid." },
        { title: "Expiration and not-before claims explain many auth failures", description: "A token can look fine and still fail because it is expired or because the current time falls before the `nbf` claim. Timestamp decoding is one of the fastest ways to spot that kind of issue.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Issuer and audience mismatches are common across environments", description: "A token minted for one environment, tenant, or client app may be rejected somewhere else even if the signature is valid. Decoding the payload makes those mismatches visible immediately.", className: "bg-violet-500/5 border-violet-500/20" },
        { title: "The signature segment is not meant to be human-readable JSON", description: "Unlike the header and payload, the signature is not a JSON object. It is a cryptographic output. A decoder can measure or display the segment, but real trust decisions require verification in the issuing auth system.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Check a staging access token", input: "Paste full bearer token", output: "Readable header, payload, and timestamps" },
        { scenario: "Debug expired auth", input: "JWT with old `exp` claim", output: "Expiration shown as expired" },
        { scenario: "Confirm issuer mismatch", input: "Token from wrong environment", output: "Unexpected `iss` or `aud` claim" },
        { scenario: "Inspect custom roles", input: "Token with app-specific claims", output: "Claims visible in decoded payload" },
      ]}
      whyChoosePoints={[
        "This JWT decoder is built as a real token-inspection tool instead of a thin placeholder. It performs local Base64URL decoding, separates header and payload cleanly, surfaces common auth claims, interprets JWT timestamps, and makes it explicit that decoding is not verification. That gives developers the practical context they usually need when they are debugging auth rather than just dumping raw text.",
        "The page is designed around how JWT troubleshooting actually happens. Teams usually start with a failed request, a suspicious bearer token, or a question about whether a claim is present. They need to know which algorithm is declared, who issued the token, who it is meant for, whether it has already expired, and whether the roles or scopes match expectations. The interface supports that workflow directly instead of forcing users to decode everything manually.",
        "Timestamp interpretation matters because raw epoch values slow people down. When `iat`, `nbf`, and `exp` are converted into readable dates and paired with simple status labels, it becomes much faster to understand whether the token is merely readable or actually usable at the current moment. That is especially valuable in staging environments, time-sensitive QA workflows, and support investigations where token freshness is often the real issue.",
        "A good JWT decoder also has to be explicit about limits. Many people confuse decoding with validation, and that confusion leads to incorrect debugging. This page highlights the trust boundary clearly: the visible data can be inspected locally, but the signature still has to be verified in the right auth context. That makes the tool more accurate and more useful than decoders that encourage false confidence.",
        "Everything runs locally in the browser, which is the right default for access tokens, staging tokens, internal test credentials, and auth artifacts that should not be pasted into a third-party server just to inspect visible claims. That privacy-preserving behavior makes the tool appropriate for real developer workflows rather than only for disposable demo tokens.",
      ]}
      faqs={[
        { q: "What does a JWT decoder do?", a: "A JWT decoder reads the visible header and payload segments of a JSON Web Token and converts them from Base64URL-encoded text into readable JSON. It helps you inspect claims and token structure." },
        { q: "Does decoding a JWT verify the signature?", a: "No. Decoding only reads the visible token data. Signature verification requires the correct secret or public key and has to be performed by the appropriate auth system or verification library." },
        { q: "Why can a JWT decode successfully but still fail authentication?", a: "Because a readable token can still be expired, not yet valid, issued for the wrong audience, minted by the wrong issuer, signed with the wrong key, or missing a claim your backend requires." },
        { q: "What is the difference between Base64 and Base64URL in JWTs?", a: "JWTs use Base64URL, which is a URL-safe variant of Base64. It replaces certain characters and often omits padding so the token can travel safely in headers and URLs." },
        { q: "What should I inspect first when a JWT seems wrong?", a: "Start with the token structure, then check issuer, audience, subject, scopes or roles, and the `iat`, `nbf`, and `exp` claims. Those fields explain a large share of token-related issues before you even get to signature verification." },
        { q: "Can the signature segment be decoded into JSON too?", a: "No. The signature is a cryptographic output, not a JSON object. A decoder can display the raw signature segment, but that segment is not meant to be interpreted as human-readable structured data." },
        { q: "Is it safe to paste a JWT into an online decoder?", a: "That depends on the tool. This page performs decoding locally in the browser so the token does not need to be sent to a server just to inspect the visible claims." },
        { q: "Who uses a JWT decoder most often?", a: "Developers, QA engineers, DevOps teams, support engineers, and security reviewers use JWT decoders when diagnosing auth flows, environment mismatches, stale tokens, and unexpected claims in bearer tokens." },
      ]}
      relatedTools={[
        { title: "Base64 Encoder & Decoder", slug: "base64-encoder-decoder", icon: <FileJson className="w-4 h-4" />, color: 205, benefit: "Work with adjacent encoded text workflows" },
        { title: "Hash Generator", slug: "hash-generator", icon: <ShieldAlert className="w-4 h-4" />, color: 170, benefit: "Compare digest workflows next to token inspection" },
        { title: "JSON Validator", slug: "json-validator", icon: <CheckCircle2 className="w-4 h-4" />, color: 145, benefit: "Validate copied claim objects and payload fragments" },
        { title: "JSON Formatter", slug: "json-formatter", icon: <KeyRound className="w-4 h-4" />, color: 28, benefit: "Beautify claim payloads after decoding" },
        { title: "URL Encoder & Decoder", slug: "url-encoder-decoder", icon: <Copy className="w-4 h-4" />, color: 280, benefit: "Inspect encoded auth-related strings in adjacent flows" },
        { title: "HTML Entity Encoder & Decoder", slug: "html-entity-encoder", icon: <Clock3 className="w-4 h-4" />, color: 330, benefit: "Handle copied token strings from markup-heavy contexts" },
      ]}
      ctaTitle="Need More Auth and Payload Tools?"
      ctaDescription="Move from JWT inspection into adjacent encoding, validation, formatting, and debugging workflows without leaving the developer tools hub."
      ctaHref="/category/developer"
    />
  );
}
