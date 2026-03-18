import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Bolt, Menu, X, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Calculators", path: "/#calculators" },
    { name: "Generators", path: "/#generators" },
    { name: "Converters", path: "/#converters" },
  ];

  return (
    <div className="min-h-screen flex flex-col relative bg-background text-foreground">
      <div className="noise-overlay"></div>
      <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 group">
              <Bolt className="w-8 h-8 text-primary" strokeWidth={2.5} />
              <span className="font-display font-black text-2xl tracking-tighter text-foreground uppercase">
                US Online <span className="text-primary">Tools</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.path}
                  className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-primary ${
                    location === link.path ? "text-primary border-b-2 border-primary pb-1" : "text-foreground"
                  } hover:underline decoration-primary decoration-2 underline-offset-4`}
                >
                  {link.name}
                </Link>
              ))}
              
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-xl border-2 border-border bg-card text-foreground hover:border-primary hover:text-primary transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </nav>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center space-x-4 md:hidden">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-xl border-2 border-border bg-card text-foreground hover:border-primary hover:text-primary transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                className="p-2 text-foreground border-2 border-border rounded-xl hover:border-primary hover:text-primary"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
              </button>
            </div>
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
            className="md:hidden fixed top-16 left-0 right-0 z-40 bg-background border-b-2 border-border shadow-lg"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.path}
                  className="block text-xl font-bold uppercase tracking-wider text-foreground hover:text-primary"
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

      <footer className="w-full mt-24 bg-[#111111] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <Bolt className="w-8 h-8 text-primary" strokeWidth={2.5} />
                <span className="font-display font-black text-2xl tracking-tighter uppercase">
                  US Online <span className="text-primary">Tools</span>
                </span>
              </div>
              <p className="text-gray-400 mb-6 font-medium">
                Your ultimate collection of free, blazing fast online tools. No tracking, purely client-side.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-primary uppercase tracking-wider mb-6 text-lg">Top Tools</h4>
              <ul className="space-y-3 font-medium">
                <li><Link href="/tools/percentage-calculator" className="text-gray-300 hover:text-primary transition-colors">Percentage Calculator</Link></li>
                <li><Link href="/tools/password-generator" className="text-gray-300 hover:text-primary transition-colors">Password Generator</Link></li>
                <li><Link href="/tools/word-counter" className="text-gray-300 hover:text-primary transition-colors">Word Counter</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-primary uppercase tracking-wider mb-6 text-lg">Categories</h4>
              <ul className="space-y-3 font-medium">
                <li><Link href="/#calculators" className="text-gray-300 hover:text-primary transition-colors">Calculators</Link></li>
                <li><Link href="/#generators" className="text-gray-300 hover:text-primary transition-colors">Generators</Link></li>
                <li><Link href="/#converters" className="text-gray-300 hover:text-primary transition-colors">Converters</Link></li>
                <li><Link href="/#text" className="text-gray-300 hover:text-primary transition-colors">Text Tools</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-primary uppercase tracking-wider mb-6 text-lg">Legal</h4>
              <ul className="space-y-3 font-medium">
                <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-primary py-4 text-center text-primary-foreground font-bold">
          <p>&copy; {new Date().getFullYear()} USOnlineTools.com. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
}