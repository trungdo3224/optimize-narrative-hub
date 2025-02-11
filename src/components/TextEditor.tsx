
import React from "react";
import { cn } from "@/lib/utils";

interface TextEditorProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const TextEditor = React.forwardRef<HTMLTextAreaElement, TextEditorProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "w-full min-h-[200px] p-4 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none bg-white/50 backdrop-blur-sm",
            "placeholder:text-gray-400",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
TextEditor.displayName = "TextEditor";

export default TextEditor;
