
import { useState } from "react";
import Button from "@/components/Button";
import TextEditor from "@/components/TextEditor";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            SEO Article Optimizer
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your content into SEO-optimized articles with our intelligent
            optimization engine.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="backdrop-blur-lg bg-white/30 p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Original Content</h2>
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
            <div className="backdrop-blur-lg bg-white/30 p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Optimized Content</h2>
              <TextEditor
                value={optimizedText}
                readOnly
                placeholder="Your optimized content will appear here..."
                className="bg-gray-50"
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
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transform hover:scale-105 transition-all duration-300"
          >
            {isOptimizing ? "Optimizing..." : "Optimize Content"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
