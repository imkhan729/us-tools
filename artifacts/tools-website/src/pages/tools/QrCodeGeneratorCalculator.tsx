import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { CheckCircle2, Download, Link2, QrCode, Wifi } from "lucide-react";

type ContentType = "url" | "text" | "wifi" | "email" | "contact";
type ErrorLevel = "L" | "M" | "Q" | "H";

function downloadSvg(svg: string, filename: string) {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeWifi(value: string) {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

export default function QrCodeGeneratorCalculator() {
  const [type, setType] = useState<ContentType>("url");
  const [url, setUrl] = useState("https://usonlinetools.com");
  const [text, setText] = useState("Scan this QR code to open the landing page.");
  const [ssid, setSsid] = useState("Guest WiFi");
  const [wifiPassword, setWifiPassword] = useState("Welcome2026");
  const [encryption, setEncryption] = useState<"WPA" | "WEP" | "nopass">("WPA");
  const [hidden, setHidden] = useState(false);
  const [email, setEmail] = useState("hello@example.com");
  const [subject, setSubject] = useState("Quick question");
  const [body, setBody] = useState("Hi team, I scanned the QR code and wanted to follow up.");
  const [name, setName] = useState("Alex Morgan");
  const [org, setOrg] = useState("Utility Hub");
  const [phone, setPhone] = useState("+1 555 0199");
  const [contactEmail, setContactEmail] = useState("alex@example.com");
  const [foreground, setForeground] = useState("#111827");
  const [background, setBackground] = useState("#ffffff");
  const [size, setSize] = useState(320);
  const [margin, setMargin] = useState(2);
  const [errorLevel, setErrorLevel] = useState<ErrorLevel>("M");
  const [pngUrl, setPngUrl] = useState("");
  const [svg, setSvg] = useState("");
  const [version, setVersion] = useState<number | null>(null);
  const [matrix, setMatrix] = useState(0);
  const [error, setError] = useState("");

  const payload = useMemo(() => {
    if (type === "url") return url.trim();
    if (type === "text") return text;
    if (type === "wifi") {
      const passwordPart = encryption === "nopass" ? "" : `P:${escapeWifi(wifiPassword)};`;
      return `WIFI:T:${encryption};S:${escapeWifi(ssid)};${passwordPart}H:${hidden ? "true" : "false"};;`;
    }
    if (type === "email") {
      const params = new URLSearchParams();
      if (subject) params.set("subject", subject);
      if (body) params.set("body", body);
      return `mailto:${email.trim()}${params.toString() ? `?${params.toString()}` : ""}`;
    }
    return ["BEGIN:VCARD", "VERSION:3.0", `FN:${name}`, `ORG:${org}`, `TEL:${phone}`, `EMAIL:${contactEmail}`, "END:VCARD"].join("\n");
  }, [body, contactEmail, email, encryption, hidden, name, org, phone, ssid, subject, text, type, url, wifiPassword]);

  useEffect(() => {
    let cancelled = false;
    const value = payload.trim();

    if (!value) {
      setPngUrl("");
      setSvg("");
      setVersion(null);
      setMatrix(0);
      setError("");
      return;
    }

    const options = {
      errorCorrectionLevel: errorLevel,
      margin,
      width: size,
      color: { dark: foreground, light: background },
    } as const;

    Promise.all([
      QRCode.toDataURL(value, options),
      QRCode.toString(value, { ...options, type: "svg" }),
      Promise.resolve(QRCode.create(value, { errorCorrectionLevel: errorLevel })),
    ])
      .then(([nextPng, nextSvg, qr]) => {
        if (!cancelled) {
          setPngUrl(nextPng);
          setSvg(nextSvg);
          setVersion(qr.version);
          setMatrix(qr.modules.size);
          setError("");
        }
      })
      .catch((nextError: unknown) => {
        if (!cancelled) {
          setError(nextError instanceof Error ? nextError.message : "Unable to generate the QR code.");
          setPngUrl("");
          setSvg("");
          setVersion(null);
          setMatrix(0);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [background, errorLevel, foreground, margin, payload, size]);

  const downloadPng = () => {
    if (!pngUrl) return;
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = "qr-code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const payloadLength = payload.length;
  const scanNote = errorLevel === "H" ? "High recovery for tougher print conditions." : errorLevel === "Q" ? "Strong recovery for posters and handouts." : errorLevel === "M" ? "Balanced choice for most links and menus." : "Lowest redundancy and smallest matrix.";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {[
          ["url", "URL"],
          ["text", "Text"],
          ["wifi", "Wi-Fi"],
          ["email", "Email"],
          ["contact", "Contact"],
        ].map(([value, label]) => (
          <button key={value} onClick={() => setType(value as ContentType)} className={`rounded-full border px-3 py-2 text-xs font-bold ${type === value ? "border-cyan-500 bg-cyan-500 text-white" : "border-border bg-card text-foreground hover:border-cyan-500/40 hover:bg-muted"}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_0.95fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">QR Content</p>
                <p className="text-sm text-muted-foreground">Choose the payload type and generate a scan-ready QR asset instantly.</p>
              </div>
              {type === "wifi" ? <Wifi className="w-5 h-5 text-cyan-600" /> : type === "url" ? <Link2 className="w-5 h-5 text-cyan-600" /> : <QrCode className="w-5 h-5 text-cyan-600" />}
            </div>

            {type === "url" ? <input value={url} onChange={(event) => setUrl(event.target.value)} spellCheck={false} className="tool-calc-input w-full" placeholder="https://example.com/menu" /> : null}
            {type === "text" ? <textarea value={text} onChange={(event) => setText(event.target.value)} className="tool-calc-input min-h-[140px] w-full resize-y text-sm" placeholder="Enter text to encode" /> : null}

            {type === "wifi" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={ssid} onChange={(event) => setSsid(event.target.value)} spellCheck={false} className="tool-calc-input md:col-span-2" placeholder="Wi-Fi network name" />
                <select value={encryption} onChange={(event) => setEncryption(event.target.value as "WPA" | "WEP" | "nopass")} className="tool-calc-input w-full">
                  <option value="WPA">WPA / WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">Open Network</option>
                </select>
                <input value={wifiPassword} onChange={(event) => setWifiPassword(event.target.value)} spellCheck={false} disabled={encryption === "nopass"} className="tool-calc-input w-full" placeholder="Wi-Fi password" />
                <label className="md:col-span-2 inline-flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" checked={hidden} onChange={(event) => setHidden(event.target.checked)} className="h-4 w-4 accent-cyan-600" />
                  Hidden network
                </label>
              </div>
            ) : null}

            {type === "email" ? (
              <div className="grid grid-cols-1 gap-4">
                <input value={email} onChange={(event) => setEmail(event.target.value)} spellCheck={false} className="tool-calc-input w-full" placeholder="team@example.com" />
                <input value={subject} onChange={(event) => setSubject(event.target.value)} spellCheck={false} className="tool-calc-input w-full" placeholder="Email subject" />
                <textarea value={body} onChange={(event) => setBody(event.target.value)} className="tool-calc-input min-h-[110px] w-full resize-y text-sm" placeholder="Pre-filled email body" />
              </div>
            ) : null}

            {type === "contact" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={name} onChange={(event) => setName(event.target.value)} spellCheck={false} className="tool-calc-input w-full" placeholder="Full name" />
                <input value={org} onChange={(event) => setOrg(event.target.value)} spellCheck={false} className="tool-calc-input w-full" placeholder="Organization" />
                <input value={phone} onChange={(event) => setPhone(event.target.value)} spellCheck={false} className="tool-calc-input w-full" placeholder="Phone number" />
                <input value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} spellCheck={false} className="tool-calc-input w-full" placeholder="Email address" />
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Appearance & Export</p>
                <p className="text-sm text-muted-foreground">Tune colors, size, and recovery level before downloading PNG or SVG.</p>
              </div>
              <Download className="w-5 h-5 text-cyan-600" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <input type="color" value={foreground} onChange={(event) => setForeground(event.target.value)} className="h-11 w-full rounded-xl border border-border bg-background p-1" />
              <input type="color" value={background} onChange={(event) => setBackground(event.target.value)} className="h-11 w-full rounded-xl border border-border bg-background p-1" />
              <select value={errorLevel} onChange={(event) => setErrorLevel(event.target.value as ErrorLevel)} className="tool-calc-input w-full">
                <option value="L">L - low</option>
                <option value="M">M - medium</option>
                <option value="Q">Q - quartile</option>
                <option value="H">H - high</option>
              </select>
              <input type="number" min="0" max="8" value={margin} onChange={(event) => setMargin(Number(event.target.value) || 0)} className="tool-calc-input w-full" />
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">PNG Size</label>
                <span className="text-xs font-bold text-cyan-600">{size}px</span>
              </div>
              <input type="range" min="180" max="1024" step="20" value={size} onChange={(event) => setSize(Number(event.target.value))} className="w-full accent-cyan-500" />
              <p className="mt-2 text-xs text-muted-foreground">{scanNote}</p>
            </div>

            <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Payload</p>
                <p className="mt-2 text-2xl font-black text-foreground">{payloadLength}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Matrix</p>
                <p className="mt-2 text-2xl font-black text-foreground">{matrix || "--"}</p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Version</p>
                <p className="mt-2 text-2xl font-black text-emerald-600">{version ?? "--"}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Quiet Zone</p>
                <p className="mt-2 text-2xl font-black text-foreground">{margin}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Live Preview</p>
                <p className="text-sm text-muted-foreground">The QR preview refreshes whenever the payload or styling changes.</p>
              </div>
              <QrCode className="w-5 h-5 text-cyan-600" />
            </div>

            <div className="flex items-center justify-center rounded-2xl border border-border bg-[linear-gradient(135deg,rgba(6,182,212,0.05),rgba(255,255,255,0.9))] p-5 min-h-[360px]">
              {error ? (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-sm text-rose-700 dark:text-rose-300">{error}</div>
              ) : pngUrl ? (
                <img src={pngUrl} alt="Generated QR code preview" className="w-full max-w-[320px] rounded-xl border border-border bg-white p-4 shadow-sm" />
              ) : (
                <p className="text-sm text-muted-foreground">Enter content to generate a QR code.</p>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={downloadPng} disabled={!pngUrl} className="rounded-full border border-cyan-500 bg-cyan-500 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">Download PNG</button>
              <button onClick={() => downloadSvg(svg, "qr-code.svg")} disabled={!svg} className="rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-foreground hover:border-cyan-500/40 disabled:opacity-50">Download SVG</button>
              <button onClick={() => navigator.clipboard.writeText(payload)} disabled={!payload} className="rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-foreground hover:border-cyan-500/40 disabled:opacity-50">Copy Payload</button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Output Notes</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Quiet Zone Matters</p>
                <p className="mt-1">Leave enough whitespace around the code so scanners can detect its boundaries quickly.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Dense Payloads Need Bigger Exports</p>
                <p className="mt-1">Longer content produces a denser matrix. Increase export size or shorten the payload before printing.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">SVG Is Best for Layout Work</p>
                <p className="mt-1">Use SVG when you need crisp scaling in print, presentations, or design tools.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
              <p className="text-sm leading-relaxed text-muted-foreground">Test every QR code on a real phone before printing at scale. Contrast and surrounding graphics affect scan reliability.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
