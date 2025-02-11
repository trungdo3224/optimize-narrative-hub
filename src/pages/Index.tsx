import { useState } from "react";
import Button from "@/components/Button";
import TextEditor from "@/components/TextEditor";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";

const Index = () => {
  const [originalText, setOriginalText] = useState("");
  const [optimizedText, setOptimizedText] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = async () => {
    if (!originalText.trim()) {
      toast.error("Please enter some text to optimize");
      return;
    }

    setIsOptimizing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Please sign in to optimize content");
        return;
      }

      const response = await fetch(
        'https://ielivqlbpmcqpixcbpdc.supabase.co/functions/v1/optimize-content',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ text: originalText }),
        }
      );

      if (!response.ok) {
        throw new Error('Optimization failed');
      }

      const data = await response.json();
      setOptimizedText(data.optimized_text);
      toast.success(`Content optimized! SEO Score: ${data.seo_score}`);
    } catch (error) {
      console.error('Optimization error:', error);
      toast.error("Failed to optimize content. Please try again.");
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="container max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            SEO Content Optimizer
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transform your content into SEO-optimized articles with our AI-powered optimization engine
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="glass-morphism p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Original Content</h2>
              <TextEditor
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="Paste your article here..."
                disabled={isOptimizing}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <div className="glass-morphism p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Optimized Content</h2>
              <TextEditor
                value={optimizedText}
                readOnly
                placeholder="Your optimized content will appear here..."
                className="bg-white/5 dark:bg-black/5"
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-center mt-8"
        >
          <Button
            onClick={handleOptimize}
            size="lg"
            disabled={isOptimizing}
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 transform hover:scale-105 transition-all duration-300"
          >
            {isOptimizing ? "Optimizing..." : "Optimize Content"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
