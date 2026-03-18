import { useState, useEffect } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { Copy, RefreshCw, Shield, KeyRound, Type } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = "";
    if (uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) charset += "0123456789";
    if (symbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (charset === "") {
      setPassword("Please select at least one character type");
      return;
    }

    let newPassword = "";
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
    setCopied(false);
  };

  useEffect(() => {
    generatePassword();
  }, [length, uppercase, lowercase, numbers, symbols]);

  const copyToClipboard = () => {
    if (password && !password.includes("Please select")) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStrength = () => {
    if (password.includes("Please select") || password.length === 0) return { label: "", color: "bg-muted", width: "w-0" };
    let score = 0;
    if (password.length > 8) score += 1;
    if (password.length > 12) score += 1;
    if (uppercase && lowercase) score += 1;
    if (numbers) score += 1;
    if (symbols) score += 1;

    if (score < 3) return { label: "Weak", color: "bg-red-500", width: "w-1/4" };
    if (score < 4) return { label: "Fair", color: "bg-yellow-500", width: "w-2/4" };
    if (score < 5) return { label: "Good", color: "bg-blue-500", width: "w-3/4" };
    return { label: "Strong", color: "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]", width: "w-full" };
  };

  const strength = getStrength();

  const ToolUI = (
    <div className="glass-card rounded-3xl p-6 md:p-10 space-y-8">
      {/* Password Display */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-secondary to-primary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
        <div className="relative bg-black/40 rounded-2xl p-6 flex items-center justify-between border border-white/10">
          <div className="font-mono text-2xl md:text-3xl text-white tracking-wider break-all mr-4 selection:bg-primary/30">
            {password}
          </div>
          <div className="flex space-x-2 shrink-0">
            <button 
              onClick={generatePassword}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-all hover:rotate-180"
              title="Generate New"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button 
              onClick={copyToClipboard}
              className={`p-3 rounded-xl flex items-center space-x-2 transition-all ${
                copied 
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50" 
                  : "bg-primary hover:bg-primary/80 text-background shadow-lg shadow-primary/25 hover:-translate-y-1"
              }`}
            >
              <Copy className="w-5 h-5" />
              <span className="hidden sm:inline font-bold">{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Strength Meter */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-muted-foreground flex items-center">
            <Shield className="w-4 h-4 mr-2" /> Password Strength
          </span>
          <span className={`text-transparent bg-clip-text bg-gradient-to-r ${
            strength.label === 'Strong' ? 'from-emerald-400 to-teal-500' : 'from-white to-white'
          }`}>
            {strength.label}
          </span>
        </div>
        <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
          <div 
            className={`h-full ${strength.color} ${strength.width} transition-all duration-500 ease-out`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {/* Length Slider */}
        <div className="space-y-4">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-white">Password Length</span>
            <span className="text-primary text-lg">{length}</span>
          </div>
          <input 
            type="range" 
            min="6" max="64" 
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-primary"
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) ${(length - 6) / (64 - 6) * 100}%, rgba(0,0,0,0.4) ${(length - 6) / (64 - 6) * 100}%)`
            }}
          />
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input 
                type="checkbox" 
                checked={uppercase} 
                onChange={(e) => setUppercase(e.target.checked)}
                className="peer appearance-none w-6 h-6 border-2 border-white/20 rounded-lg checked:bg-primary checked:border-primary transition-all"
              />
              <div className="absolute text-background opacity-0 peer-checked:opacity-100 pointer-events-none">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 10 8 14 16 6"></polyline></svg>
              </div>
            </div>
            <span className="text-muted-foreground group-hover:text-white transition-colors">Uppercase (A-Z)</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input 
                type="checkbox" 
                checked={lowercase} 
                onChange={(e) => setLowercase(e.target.checked)}
                className="peer appearance-none w-6 h-6 border-2 border-white/20 rounded-lg checked:bg-primary checked:border-primary transition-all"
              />
              <div className="absolute text-background opacity-0 peer-checked:opacity-100 pointer-events-none">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 10 8 14 16 6"></polyline></svg>
              </div>
            </div>
            <span className="text-muted-foreground group-hover:text-white transition-colors">Lowercase (a-z)</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input 
                type="checkbox" 
                checked={numbers} 
                onChange={(e) => setNumbers(e.target.checked)}
                className="peer appearance-none w-6 h-6 border-2 border-white/20 rounded-lg checked:bg-primary checked:border-primary transition-all"
              />
              <div className="absolute text-background opacity-0 peer-checked:opacity-100 pointer-events-none">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 10 8 14 16 6"></polyline></svg>
              </div>
            </div>
            <span className="text-muted-foreground group-hover:text-white transition-colors">Numbers (0-9)</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input 
                type="checkbox" 
                checked={symbols} 
                onChange={(e) => setSymbols(e.target.checked)}
                className="peer appearance-none w-6 h-6 border-2 border-white/20 rounded-lg checked:bg-primary checked:border-primary transition-all"
              />
              <div className="absolute text-background opacity-0 peer-checked:opacity-100 pointer-events-none">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 10 8 14 16 6"></polyline></svg>
              </div>
            </div>
            <span className="text-muted-foreground group-hover:text-white transition-colors">Symbols (!@#$)</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <ToolPageLayout
      title="Secure Password Generator"
      description="Create highly secure, random passwords instantly. Your data never leaves your browser."
      tool={ToolUI}
      howToUse={
        <>
          <p>Generating a secure password takes just seconds:</p>
          <ol>
            <li>Adjust the slider to choose your desired password length (12+ characters recommended).</li>
            <li>Check the boxes to include uppercase letters, lowercase letters, numbers, and symbols.</li>
            <li>Click the "Copy" button to save it to your clipboard.</li>
            <li>If you don't like the generated password, click the refresh icon next to it.</li>
          </ol>
          <p><strong>Note:</strong> Since this tool runs entirely in your browser using JavaScript, we never see, store, or transmit your generated passwords. It is completely safe.</p>
        </>
      }
      faq={[
        { q: "What makes a password strong?", a: "A strong password is long (at least 12 characters) and includes a mix of character types: uppercase, lowercase, numbers, and special symbols. It should not contain dictionary words or personal information." },
        { q: "Do you save my generated passwords?", a: "No. This tool runs 100% on your device (client-side). Passwords are never sent over the internet." },
      ]}
      related={[
        { title: "Word Counter", path: "/tools/word-counter", icon: <Type className="w-5 h-5" /> },
      ]}
    />
  );
}
