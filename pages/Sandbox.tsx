import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Search, Plus, Trash2, ArrowUp, ArrowDown, Download, AlertTriangle, X, GripVertical } from 'lucide-react';
import { getPrompts, getCAP, getCAPs } from '../data/store';
import type { Prompt, CAP } from '../types';
import { composePrompt } from '../lib/promptComposer';
import { useToast } from '../hooks/useToast';

interface ValidationIssue {
  type: 'duplicate_cap' | 'forbid_collision';
  message: string;
}

const downloadFile = (content: string, fileName: string, contentType: string) => {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
};

const Sandbox: React.FC = () => {
  const { t } = useAppContext();
  const { addToast } = useToast();
  
  const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPromptIds, setSelectedPromptIds] = useState<Set<string>>(new Set());
  const [scenes, setScenes] = useState<Prompt[]>([]);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [draggedSceneId, setDraggedSceneId] = useState<string | null>(null);

  useEffect(() => {
    setAllPrompts(getPrompts());
  }, []);

  const filteredPrompts = useMemo(() => {
    return allPrompts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [allPrompts, searchTerm]);
  
  useEffect(() => {
    const issues: ValidationIssue[] = [];
    if (scenes.length < 2) {
      setValidationIssues([]);
      return;
    }

    const allCapsInScenes = scenes.flatMap(s => s.caps.map(getCAP)).filter((c): c is CAP => !!c);
    
    // Check for duplicate CAPs
    const capCounts = allCapsInScenes.reduce<Record<string, number>>((acc, cap) => {
        acc[cap.id] = (acc[cap.id] || 0) + 1;
        return acc;
    }, {});
    
    Object.entries(capCounts).forEach(([capId, count]) => {
        if (count > 1) {
            const cap = getCAP(capId);
            issues.push({ type: 'duplicate_cap', message: `CAP "${cap?.signature[0]}" is used in ${count} scenes.` });
        }
    });

    // Check for forbid collisions
    const allForbiddenTerms = new Set(allCapsInScenes.flatMap(c => c.forbid));
    scenes.forEach((scene, index) => {
        const composedText = composePrompt(scene).toLowerCase();
        allForbiddenTerms.forEach(term => {
            if (composedText.includes(term.toLowerCase())) {
                issues.push({ type: 'forbid_collision', message: `Scene ${index + 1} ("${scene.title}") contains forbidden term: "${term}".` });
            }
        });
    });

    setValidationIssues(issues);

  }, [scenes]);


  const handleTogglePromptSelection = (promptId: string) => {
    const newSelection = new Set(selectedPromptIds);
    if (newSelection.has(promptId)) {
      newSelection.delete(promptId);
    } else {
      newSelection.add(promptId);
    }
    setSelectedPromptIds(newSelection);
  };
  
  const handleAddSelectedToScenes = () => {
    const promptsToAdd = allPrompts.filter(p => selectedPromptIds.has(p.id));
    setScenes(prevScenes => [...prevScenes, ...promptsToAdd]);
    setSelectedPromptIds(new Set());
  };

  const handleRemoveScene = (index: number) => {
    setScenes(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleExport = () => {
      if (scenes.length === 0) {
          addToast("Add at least one scene to export.", "error");
          return;
      }
      let markdown = `# Story Outline\n\n`;
      scenes.forEach((scene, index) => {
          markdown += `## Scene ${index + 1}: ${scene.title}\n\n`;
          markdown += `**Applied CAPs:** ${scene.caps.map(id => getCAP(id)?.signature[0] || 'Unknown').join(', ') || 'None'}\n\n`;
          markdown += "```\n";
          markdown += composePrompt(scene);
          markdown += "\n```\n\n---\n\n";
      });
      downloadFile(markdown, 'sandbox-export.md', 'text/markdown');
      addToast("Exported successfully!", "success");
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, sceneId: string) => {
    e.dataTransfer.setData('text/plain', sceneId);
    setDraggedSceneId(sceneId);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetSceneId: string) => {
    e.preventDefault();
    const sourceSceneId = e.dataTransfer.getData('text/plain');
    if (sourceSceneId === targetSceneId) return;

    const sourceIndex = scenes.findIndex(s => s.id === sourceSceneId);
    const targetIndex = scenes.findIndex(s => s.id === targetSceneId);
    
    const reorderedScenes = [...scenes];
    const [removed] = reorderedScenes.splice(sourceIndex, 1);
    reorderedScenes.splice(targetIndex, 0, removed);
    
    setScenes(reorderedScenes);
    setDraggedSceneId(null);
  };


  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 mb-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('welcome_to_sandbox')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{t('sandbox_description')}</p>
      </div>
      
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        
        {/* Left: Prompts List */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col">
          <h2 className="text-xl font-semibold mb-3">{t('prompts_list')}</h2>
          <div className="relative mb-3">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={t('search')}
              className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
            />
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <div className="flex-grow overflow-y-auto space-y-2 pr-2 -mr-2">
            {filteredPrompts.map(p => (
              <div key={p.id} className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <input
                  type="checkbox"
                  id={`prompt-${p.id}`}
                  checked={selectedPromptIds.has(p.id)}
                  onChange={() => handleTogglePromptSelection(p.id)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor={`prompt-${p.id}`} className="ml-3 block text-sm font-medium w-full cursor-pointer">{p.title}</label>
              </div>
            ))}
          </div>
          <button 
            onClick={handleAddSelectedToScenes} 
            disabled={selectedPromptIds.size === 0}
            className="mt-4 w-full flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed">
            <Plus className="h-5 w-5 mr-2"/> {t('add_to_scenes')} ({selectedPromptIds.size})
          </button>
        </div>
        
        {/* Center: Scenes */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col">
          <h2 className="text-xl font-semibold mb-3">{t('scenes')} ({scenes.length})</h2>
          <div className="flex-grow overflow-y-auto space-y-3">
            {scenes.map((scene, index) => (
              <div 
                key={`${scene.id}-${index}`} // Unique key for re-renders
                draggable
                onDragStart={e => handleDragStart(e, scene.id)}
                onDragOver={handleDragOver}
                onDrop={e => handleDrop(e, scene.id)}
                className={`p-3 border rounded-lg flex gap-2 ${draggedSceneId === scene.id ? 'opacity-50' : ''} ${draggedSceneId ? 'cursor-grabbing' : 'cursor-grab'}`}
                >
                <GripVertical className="h-5 w-5 mt-1 text-gray-400 flex-shrink-0" />
                <div className="flex-grow">
                    <div className="flex justify-between items-start">
                        <p className="font-semibold">{index + 1}. {scene.title}</p>
                        <button onClick={() => handleRemoveScene(index)} className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500"><X className="h-4 w-4"/></button>
                    </div>
                    <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-900/50 rounded text-xs text-gray-600 dark:text-gray-400 font-mono max-h-20 overflow-y-auto">
                        <pre className="whitespace-pre-wrap">{composePrompt(scene)}</pre>
                    </div>
                </div>
              </div>
            ))}
             {scenes.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-10">Add prompts from the left to build your sequence.</p>}
          </div>
        </div>
        
        {/* Right: Validation & Export */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col">
          <h2 className="text-xl font-semibold mb-3">{t('validation_panel')}</h2>
          <div className="flex-grow overflow-y-auto space-y-4">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">{t('continuity_across_scenes')}</h3>
             {validationIssues.length > 0 ? (
                <div className="space-y-2">
                    {validationIssues.map((issue, i) => (
                        <div key={i} className="flex items-start gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 rounded">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">{issue.message}</p>
                        </div>
                    ))}
                </div>
             ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No continuity issues detected across scenes.</p>
             )}
          </div>
           <button onClick={handleExport} className="mt-4 w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition">
            <Download className="h-5 w-5 mr-2"/> {t('export_combined')}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Sandbox;