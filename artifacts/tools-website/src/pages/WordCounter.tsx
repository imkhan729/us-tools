import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { Type, AlignLeft, Hash, Clock, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function WordCounter() {
  const [text, setText] = useState("");

  // Calculations
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const paragraphs = text.trim() === "" ? 0 : text.replace(/\n$/gm, '').split(/\n/).filter(line => line.trim().length > 0).length;
  const sentences = text.trim() === "" ? 0 : text.split(/[.!?]+/).filter(Boolean).length;
  
  // Avg reading speed is 225 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 225));

  const StatCard = ({ icon, label, value, colorClass }: { icon: React.ReactNode, label: string, value: number, colorClass: string }) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center border-t border-white/10"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white mb-3 shadow-lg`}>
        {icon}
      </div>
      <div className="text-3xl font-black text-white mb-1 font-mono tracking-tight">{value.toLocaleString()}</div>
      <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
    </motion.div>
  );

  const ToolUI = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard 
          icon={<Type className="w-6 h-6" />} 
          label="Words" 
          value={words} 
          colorClass="from-orange-400 to-red-500" 
        />
        <StatCard 
          icon={<Hash className="w-6 h-6" />} 
          label="Characters" 
          value={characters} 
          colorClass="from-blue-400 to-indigo-500" 
        />
        <StatCard 
          icon={<AlignLeft className="w-6 h-6" />} 
          label="Sentences" 
          value={sentences} 
          colorClass="from-emerald-400 to-teal-500" 
        />
        <StatCard 
          icon={<FileText className="w-6 h-6" />} 
          label="Paragraphs" 
          value={paragraphs} 
          colorClass="from-purple-400 to-pink-500" 
        />
        <div className="col-span-2 md:col-span-1 lg:col-span-1">
          <StatCard 
            icon={<Clock className="w-6 h-6" />} 
            label="Min Read Time" 
            value={readingTimeMinutes} 
            colorClass="from-cyan-400 to-blue-500" 
          />
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-3xl blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
        <div className="relative glass-card rounded-3xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/5 bg-black/20 flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Type or paste your text below</span>
            <div className="flex space-x-2">
              <button 
                onClick={() => setText("")}
                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-muted-foreground transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
          <textarea 
            className="w-full h-[400px] bg-transparent border-none p-6 text-white text-lg focus:outline-none resize-none placeholder:text-muted-foreground/50"
            placeholder="Start typing..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>
      </div>
      
      <div className="flex justify-between items-center px-4">
        <span className="text-sm text-muted-foreground">
          Characters without spaces: <strong className="text-white">{charactersNoSpaces.toLocaleString()}</strong>
        </span>
      </div>
    </div>
  );

  return (
    <ToolPageLayout
      title="Word Counter & Text Analyzer"
      description="Instantly count words, characters, sentences, and estimate reading time. Perfect for essays, tweets, and SEO."
      tool={ToolUI}
      howToUse={
        <>
          <p>Using the word counter is entirely seamless:</p>
          <ul>
            <li>Simply begin typing in the large text area above.</li>
            <li>Alternatively, you can copy text from Word, Google Docs, or a website and paste it directly into the box.</li>
            <li>The statistics cards at the top will update in real-time as you edit your text.</li>
          </ul>
        </>
      }
      faq={[
        { q: "How is reading time calculated?", a: "Reading time is estimated based on an average adult reading speed of 225 words per minute. It rounds up to the nearest minute." },
        { q: "Does this save my text?", a: "No. The word counting happens directly in your browser. If you refresh the page, your text will be lost. We do not transmit or save any text." },
      ]}
      related={[
        { title: "Password Generator", path: "/tools/password-generator", icon: <Type className="w-5 h-5" /> },
      ]}
    />
  );
}
