import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ParticlesBackground } from "./ParticlesBackground";
import { Hexagon, Wrench, Menu, X, Github, Twitter } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Calculators", path: "/#calculators" },
    { name: "Generators", path: "/#generators" },
    { name: "Converters", path: "/#converters" },
  ];

  return (
    <div className="min-h-screen flex flex-col relative text-foreground">
      <ParticlesBackground />
      
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary p-[2px] shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
                <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
                  <Hexagon className="w-6 h-6 text-primary" />
                </div>
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                Tools<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Hub</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === link.path ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <a 
                href="#"
                className="px-6 py-2.5 rounded-full font-semibold bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-300 backdrop-blur-md text-white"
              >
                Pro Tools
              </a>
            </nav>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-muted-foreground hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-20 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-b border-white/10"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.path}
                  className="block text-lg font-medium text-muted-foreground hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col relative z-10">
        {children}
      </main>

      <footer className="w-full border-t border-white/10 bg-background/80 backdrop-blur-lg mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Wrench className="w-6 h-6 text-primary" />
                <span className="font-display font-bold text-xl text-white">ToolsHub</span>
              </div>
              <p className="text-muted-foreground max-w-sm mb-6">
                Your ultimate collection of free, beautiful, and blazing fast online tools. No tracking, no saving your data, purely client-side utilities.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Top Tools</h4>
              <ul className="space-y-2">
                <li><Link href="/tools/percentage-calculator" className="text-muted-foreground hover:text-primary transition-colors">Percentage Calculator</Link></li>
                <li><Link href="/tools/password-generator" className="text-muted-foreground hover:text-primary transition-colors">Password Generator</Link></li>
                <li><Link href="/tools/word-counter" className="text-muted-foreground hover:text-primary transition-colors">Word Counter</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-muted-foreground text-sm">
            <p>&copy; {new Date().getFullYear()} ToolsHub. Crafted with precision.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
