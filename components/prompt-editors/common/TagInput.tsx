import React, { useState } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  id: string;
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({ id, tags, setTags, placeholder }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
        {tags.map(tag => (
          <span key={tag} className="flex items-center bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-200 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {tag}
            <button onClick={() => removeTag(tag)} className="ml-1.5 -mr-1 p-0.5 rounded-full hover:bg-primary-200 dark:hover:bg-primary-800">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          id={id}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Add a tag and press Enter...'}
          className="flex-grow bg-transparent focus:outline-none p-1"
        />
      </div>
    </div>
  );
};

export default TagInput;
