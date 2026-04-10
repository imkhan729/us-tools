import { ReactNode, useState } from "react";
import { Link } from "wouter";
import { Check, ChevronRight, Copy } from "lucide-react";

export interface ToolSidebarRelatedItem {
  title: string;
  href: string;
  benefit?: string;
  icon?: ReactNode;
  color?: number;
}

export interface ToolSidebarTocItem {
  label: string;
  href: string;
}

interface ToolRightSidebarProps {
  relatedTools: ToolSidebarRelatedItem[];
  onThisPageItems: ToolSidebarTocItem[];
}

export function ToolRightSidebar({ relatedTools, onThisPageItems }: ToolRightSidebarProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-28 space-y-6">
        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
          <div className="space-y-0.5">
            {relatedTools.map((tool) => {
              const hue = typeof tool.color === "number" ? tool.color : 217;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all"
                >
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5"
                    style={{ background: `linear-gradient(135deg, hsl(${hue} 70% 55%), hsl(${hue} 75% 42%))` }}
                  >
                    {tool.icon ?? <ChevronRight className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">
                      {tool.title}
                    </p>
                    {tool.benefit ? (
                      <p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p>
                    ) : null}
                  </div>
                  <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-blue-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
          <p className="text-xs text-muted-foreground mb-3">Copy and share this tool link.</p>
          <button
            onClick={copyLink}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Link
              </>
            )}
          </button>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
          <div className="space-y-0.5">
            {onThisPageItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-blue-500 font-medium py-1.5 transition-colors"
              >
                <div className="w-1 h-1 rounded-full bg-blue-500/40 flex-shrink-0" />
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

