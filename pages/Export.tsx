import React, { useState, useCallback } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { useToast } from '../hooks/useToast';
import { DownloadCloud, UploadCloud, FileJson, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { getAllData, importData, generateId, getProjects, getPrompts, getCAPs, getTemplates } from '../data/store';
import type { FullStoreData } from '../data/store';
import type { Project, Prompt, CAP, Template } from '../types';

interface ImportPreview {
  counts: Record<string, number>;
  collisions: Record<string, string[]>;
  data: FullStoreData;
}

const downloadFile = (content: string, fileName: string, contentType: string) => {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
};

const Export: React.FC = () => {
  const { t } = useAppContext();
  const { addToast } = useToast();

  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [fileName, setFileName] = useState<string>('');
  
  const handleExportJson = useCallback(() => {
    // TODO_CONNECT: Implement actual export logic
    const allData = getAllData();
    const jsonString = JSON.stringify(allData, null, 2);
    downloadFile(jsonString, 'prompt-studio-export.json', 'application/json');
    addToast('Exported as JSON successfully!', 'success');
  }, [addToast]);

  const handleExportMarkdown = useCallback(() => {
    // TODO_CONNECT: Implement actual export logic
    const { projects, prompts } = getAllData();
    let md = `# Prompt Studio Export\n\n`;
    projects.forEach(p => {
        md += `## Project: ${p.name}\n\n`;
        const projectPrompts = prompts.filter(prompt => prompt.projectId === p.id);
        projectPrompts.forEach(prompt => {
            md += `### Prompt: ${prompt.title}\n`;
            md += `**Type:** ${prompt.type}\n`;
            md += `**Tags:** ${prompt.tags.join(', ')}\n\n`;
            md += "```\n" + prompt.content + "\n```\n\n";
        });
    });
    downloadFile(md, 'prompt-studio-export.md', 'text/markdown');
    addToast('Exported as Markdown successfully!', 'success');
  }, [addToast]);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/json') {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content) as FullStoreData;
          
          // Validate data structure
          if (!data.projects || !data.prompts || !data.caps || !data.templates) {
              throw new Error("Invalid JSON structure.");
          }

          // Create preview with collision detection
          const currentData = getAllData();
          const collisions: Record<string, string[]> = {
              projects: data.projects.filter(p => currentData.projects.some(cp => cp.id === p.id)).map(p => p.name),
              prompts: data.prompts.filter(p => currentData.prompts.some(cp => cp.id === p.id)).map(p => p.title),
              caps: data.caps.filter(c => currentData.caps.some(cc => cc.id === c.id)).map(c => c.signature[0]),
              templates: data.templates.filter(t => currentData.templates.some(ct => ct.id === t.id)).map(t => t.title),
          };

          setImportPreview({
            counts: {
              projects: data.projects.length,
              prompts: data.prompts.length,
              caps: data.caps.length,
              templates: data.templates.length,
            },
            collisions,
            data
          });

        } catch (error) {
          addToast('Failed to parse file. Ensure it is a valid JSON export.', 'error');
          setImportPreview(null);
          setFileName('');
        }
      };
      reader.readAsText(file);
    } else {
      addToast('Please select a valid .json file.', 'error');
    }
     // Reset file input value to allow re-selection of the same file
    event.target.value = '';
  };

  const handleConfirmImport = () => {
    if (!importPreview) return;
    
    // Remap IDs to prevent collisions
    const idMap = new Map<string, string>();
    const remapId = (oldId: string) => {
        if (!idMap.has(oldId)) {
            const prefix = oldId.split('-')[0] || 'imported';
            idMap.set(oldId, generateId(prefix));
        }
        return idMap.get(oldId)!;
    }

    const remappedData: FullStoreData = {
        projects: importPreview.data.projects.map(p => ({ ...p, id: remapId(p.id) })),
        prompts: importPreview.data.prompts.map(p => ({ 
            ...p, 
            id: remapId(p.id),
            projectId: remapId(p.projectId),
            caps: p.caps.map(remapId),
        })),
        caps: importPreview.data.caps.map(c => ({...c, id: remapId(c.id)})),
        templates: importPreview.data.templates.map(t => ({...t, id: remapId(t.id)})),
    };

    importData(remappedData);
    addToast('Data imported successfully!', 'success');
    setImportPreview(null);
    setFileName('');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('export')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Export your projects and prompts, or import from a file.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* EXPORT */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <div className="text-center">
            <DownloadCloud className="mx-auto h-12 w-12 text-primary-500" />
            <h2 className="mt-4 text-2xl font-semibold">{t('export_project')}</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Download a complete archive of your work.</p>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4">
                <button onClick={handleExportJson} className="flex items-center justify-center w-full p-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition">
                    <FileJson className="h-6 w-6 mr-3 text-yellow-500" />
                    <span className="font-semibold">{t('export_as_json')}</span>
                </button>
                 <button onClick={handleExportMarkdown} className="flex items-center justify-center w-full p-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition">
                    <FileText className="h-6 w-6 mr-3 text-blue-500" />
                    <span className="font-semibold">{t('export_as_markdown')}</span>
                </button>
            </div>
        </div>
        {/* IMPORT */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <div className="text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-green-500" />
                <h2 className="mt-4 text-2xl font-semibold">{t('import_project')}</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{t('import_from_json')}</p>
            </div>
            <div className="mt-8">
                <label htmlFor="file-upload" className="w-full cursor-pointer flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition">
                    <FileJson className="h-6 w-6 mr-3 text-yellow-500" />
                    <span className="font-semibold">{fileName || t('select_json_file')}</span>
                </label>
                <input id="file-upload" type="file" className="hidden" accept=".json" onChange={handleFileChange} />
            </div>
            {importPreview && (
                <div className="mt-6 space-y-4 animate-fade-in">
                    <h3 className="font-semibold text-lg">{t('import_preview')}</h3>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md space-y-2">
                        {Object.entries(importPreview.counts).map(([key, value]) => value > 0 && (
                            <div key={key} className="flex justify-between text-sm">
                                <span>{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                                <strong>{value}</strong>
                            </div>
                        ))}
                    </div>
                    {Object.values(importPreview.collisions).some(arr => arr.length > 0) && (
                         <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 rounded">
                            <div className="flex items-center">
                                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">{t('collisions_found')}</h4>
                            </div>
                            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">ID collisions detected. New unique IDs will be generated on import to prevent conflicts.</p>
                         </div>
                    )}
                    <button onClick={handleConfirmImport} className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition">
                        <CheckCircle className="h-5 w-5 mr-2"/> {t('confirm_import')}
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Export;