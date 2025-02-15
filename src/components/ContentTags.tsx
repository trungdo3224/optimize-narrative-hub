import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface Tag {
  id: string;
  name: string;
  category: 'Technology' | 'Software' | 'Marketing' | 'Science' | 'Business' | 'Health';
}

const tags: Tag[] = [
  // Technology
  { id: 'web-dev', name: 'Web Development', category: 'Technology' },
  { id: 'ai', name: 'Artificial Intelligence', category: 'Technology' },
  { id: 'blockchain', name: 'Blockchain', category: 'Technology' },
  { id: 'cloud', name: 'Cloud Computing', category: 'Technology' },
  { id: 'cybersecurity', name: 'Cybersecurity', category: 'Technology' },
  
  // Software
  { id: 'agile', name: 'Agile Development', category: 'Software' },
  { id: 'devops', name: 'DevOps', category: 'Software' },
  { id: 'testing', name: 'Software Testing', category: 'Software' },
  { id: 'architecture', name: 'Software Architecture', category: 'Software' },
  
  // Marketing
  { id: 'digital-marketing', name: 'Digital Marketing', category: 'Marketing' },
  { id: 'seo', name: 'SEO', category: 'Marketing' },
  { id: 'social-media', name: 'Social Media', category: 'Marketing' },
  { id: 'content-marketing', name: 'Content Marketing', category: 'Marketing' },
  
  // Science
  { id: 'data-science', name: 'Data Science', category: 'Science' },
  { id: 'machine-learning', name: 'Machine Learning', category: 'Science' },
  { id: 'quantum', name: 'Quantum Computing', category: 'Science' },
  { id: 'biotech', name: 'Biotechnology', category: 'Science' },
  
  // Business
  { id: 'startup', name: 'Startups', category: 'Business' },
  { id: 'entrepreneurship', name: 'Entrepreneurship', category: 'Business' },
  { id: 'management', name: 'Management', category: 'Business' },
  { id: 'finance', name: 'Finance', category: 'Business' },
  
  // Health
  { id: 'wellness', name: 'Wellness', category: 'Health' },
  { id: 'mental-health', name: 'Mental Health', category: 'Health' },
  { id: 'nutrition', name: 'Nutrition', category: 'Health' },
  { id: 'fitness', name: 'Fitness', category: 'Health' },
];

interface ContentTagsProps {
  onTagsChange: (selectedTags: Tag[]) => void;
}

const ContentTags: React.FC<ContentTagsProps> = ({ onTagsChange }) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  useEffect(() => {
    onTagsChange(selectedTags);
  }, [selectedTags, onTagsChange]);

  const handleTagClick = (tag: Tag) => {
    setSelectedTags((prevSelectedTags) => {
      const isSelected = prevSelectedTags.some(t => t.id === tag.id);
      let newTags;

      if (isSelected) {
        newTags = prevSelectedTags.filter(t => t.id !== tag.id);
      } else if (prevSelectedTags.length < 4) {
        newTags = [...prevSelectedTags, tag];
      } else {
        return prevSelectedTags;
      }

      return newTags;
    });
  };

  const categories = Array.from(new Set(tags.map(tag => tag.category)));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map(tag => (
          <Badge
            key={tag.id}
            variant="default"
            className="cursor-pointer"
            onClick={() => handleTagClick(tag)}
          >
            {tag.name} ×
          </Badge>
        ))}
      </div>
      <ScrollArea className="h-[300px] rounded-md border p-4">
        {categories.map(category => (
          <div key={category} className="mb-4">
            <h3 className="text-sm font-semibold mb-2">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {tags
                .filter(tag => tag.category === category)
                .map(tag => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className={cn(
                      "cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors",
                      selectedTags.find(t => t.id === tag.id) && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag.name}
                  </Badge>
                ))}
            </div>
          </div>
        ))}
      </ScrollArea>
      <p className="text-sm text-muted-foreground">
        Select up to 4 tags to generate content. Click a tag again to deselect it.
      </p>
    </div>
  );
};

export default ContentTags;
