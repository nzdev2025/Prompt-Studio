import React from 'react';
import { Clipboard } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

interface ComposedPromptProps {
  composedText: string;
}

const ComposedPrompt: React.FC<ComposedPromptProps> = ({ composedText }) => {
  const { addToast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(composedText);
    addToast('Prompt copied to clipboard!', 'success');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Composed Prompt</h3>
        <button onClick={handleCopy} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
          <Clipboard className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-grow bg-gray-50 dark:bg-gray-900/50 rounded-md p-3 overflow-y-auto">
        <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-mono">
          {composedText}
        </pre>
      </div>
      <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-2">
        {composedText.length} characters
      </div>
    </div>
  );
};

export default ComposedPrompt;
