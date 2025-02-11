
import { useState } from "react";
import Button from "@/components/Button";
import TextEditor from "@/components/TextEditor";
import { motion } from "framer-motion";

const Index = () => {
  const [originalText, setOriginalText] = useState("");
  const [optimizedText, setOptimizedText] = useState("");

  const handleOptimize = () => {
    // This is a placeholder function for the optimization logic
    // In the future, this will integrate with an AI service
    setOptimizedText(originalText);
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
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transform hover:scale-105 transition-all duration-300"
          >
            Optimize Content
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
