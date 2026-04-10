import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <Layout>
      <SEO
        title="404 - Page Not Found"
        description="The requested page could not be found on US Online Tools."
        noindex
      />
      <div className="min-h-[70vh] flex items-center justify-center w-full px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass-card p-10 rounded-3xl text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>
          
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          
          <h1 className="text-4xl font-black text-white mb-2">404</h1>
          <h2 className="text-xl font-bold text-white mb-4">Tool Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page or tool you are looking for doesn't exist or has been moved to another URL.
          </p>
          
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition-colors w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to ToolsHub
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
}
