import React, { useState, useEffect } from 'react';
import { getTemplates } from '../data/store';
import { useAppContext } from '../hooks/useAppContext';
import { Search } from 'lucide-react';
import type { Template } from '../types';

const TemplateCard: React.FC<{ template: Template }> = ({ template }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-primary-500 transition-all duration-300 flex flex-col">
        <h3 className="text-lg font-bold text-primary-600 dark:text-primary-400">{template.title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wider mt-1">{template.type}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 mb-4 flex-grow font-mono bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md">`{template.content.substring(0, 100)}{template.content.length > 100 ? '...' : ''}`</p>
        <div className="flex flex-wrap gap-2">
            {template.tags.map(tag => (
                <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">#{tag}</span>
            ))}
        </div>
        <button className="w-full mt-6 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
            Use Template
        </button>
    </div>
);


const Templates: React.FC = () => {
  const { t } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    setTemplates(getTemplates());
  }, []);

  const filteredTemplates = templates.filter(template => 
    template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('templates')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Browse our collection of pre-built prompts to get started quickly.</p>
      </div>

      <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search templates by title, content, or #tag..."
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map(template => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
};

export default Templates;
