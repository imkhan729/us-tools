import { useState, useEffect } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { Palette, Copy, Hash as HashIcon } from "lucide-react";
import { motion } from "framer-motion";

// Color Conversion Helpers
const hexToRgb = (hex: string) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

export default function ColorConverter() {
  const [hex, setHex] = useState("#00E5FF");
  const [rgb, setRgb] = useState("rgb(0, 229, 255)");
  const [hsl, setHsl] = useState("hsl(186, 100%, 50%)");
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    handleHexChange(hex);
  }, []);

  const handleHexChange = (value: string) => {
    setHex(value);
    const rgbVal = hexToRgb(value);
    if (rgbVal) {
      setIsValid(true);
      setRgb(`rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b})`);
      const hslVal = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
      setHsl(`hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)`);
    } else {
      setIsValid(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast here if required
  };

  const ToolUI = (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Color Preview */}
      <div className="lg:col-span-5 relative">
        <div className="sticky top-28">
          <div className="glass-card rounded-3xl p-4 h-full aspect-square md:aspect-auto lg:aspect-square flex flex-col items-center justify-center relative overflow-hidden group">
            <div 
              className="absolute inset-0 transition-colors duration-300"
              style={{ backgroundColor: isValid ? hex : 'transparent' }}
            ></div>
            
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

            <div className="relative z-10 bg-black/40 backdrop-blur-md rounded-2xl p-6 text-center border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="font-mono text-2xl font-bold text-white mb-2">{hex}</p>
              <p className="font-mono text-sm text-white/80">{rgb}</p>
            </div>

            {!isValid && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-20">
                <span className="text-red-400 font-medium px-4 py-2 rounded-xl bg-red-500/10">Invalid Color Format</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Converter Inputs */}
      <div className="lg:col-span-7 space-y-6">
        {/* HEX */}
        <div className="glass-card p-6 rounded-3xl relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white flex items-center">
              <HashIcon className="w-5 h-5 mr-2 text-pink-400" />
              HEX
            </h3>
            <button onClick={() => copyToClipboard(hex)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <input 
            type="text" 
            value={hex}
            onChange={(e) => handleHexChange(e.target.value)}
            className="glass-input w-full px-4 py-4 text-xl font-mono uppercase tracking-wider"
            placeholder="#000000"
          />
        </div>

        {/* RGB */}
        <div className="glass-card p-6 rounded-3xl relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white flex items-center">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-500 via-green-500 to-blue-500 mr-2 border border-white/20"></div>
              RGB
            </h3>
            <button onClick={() => copyToClipboard(rgb)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <input 
            type="text" 
            value={rgb}
            readOnly
            className="glass-input w-full px-4 py-4 text-xl font-mono opacity-80"
          />
        </div>

        {/* HSL */}
        <div className="glass-card p-6 rounded-3xl relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white flex items-center">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 mr-2 border border-white/20"></div>
              HSL
            </h3>
            <button onClick={() => copyToClipboard(hsl)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <input 
            type="text" 
            value={hsl}
            readOnly
            className="glass-input w-full px-4 py-4 text-xl font-mono opacity-80"
          />
        </div>
      </div>
    </div>
  );

  return (
    <ToolPageLayout
      title="Color Converter"
      description="Translate colors seamlessly between HEX, RGB, and HSL formats. Essential for web designers and developers."
      tool={ToolUI}
      howToUse={
        <>
          <p>Converting colors is fast and straightforward:</p>
          <ol>
            <li>Type or paste a HEX code (e.g., <code>#FF5733</code>) into the top box.</li>
            <li>The RGB and HSL formats will automatically generate in the boxes below.</li>
            <li>Use the copy icon next to any format to instantly copy it to your clipboard.</li>
            <li>The preview box on the left will display the visual color so you know you have the right one.</li>
          </ol>
        </>
      }
      faq={[
        { q: "What is the difference between HEX and RGB?", a: "HEX is a base-16 representation of a color primarily used in HTML/CSS. RGB defines the Red, Green, and Blue light values from 0-255 used by screens." },
        { q: "Why use HSL?", a: "HSL (Hue, Saturation, Lightness) is often preferred by designers because it's more intuitive to adjust. You can easily make a color darker or lighter just by changing the L value." },
      ]}
      related={[
        { title: "Word Counter", path: "/tools/word-counter", icon: <Palette className="w-5 h-5" /> },
      ]}
    />
  );
}
