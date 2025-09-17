
import React from 'react';
import type { CAP } from '../../types';
import { Edit, Trash2, Palette, Video, User, Feather, Wind } from 'lucide-react';

interface CapCardProps {
  cap: CAP;
  onEdit: (cap: CAP) => void;
  onDelete: (id: string) => void;
}

const scopeIcons = {
    character: <User className="h-5 w-5" />,
    env: <Wind className="h-5 w-5" />,
    style: <Feather className="h-5 w-5" />,
}

const CapCard: React.FC<CapCardProps> = ({ cap, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
                <span className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-md text-primary-600 dark:text-primary-300">
                    {scopeIcons[cap.scope]}
                </span>
                <div>
                    <h3 className="text-lg font-bold text-primary-600 dark:text-primary-400">{cap.signature[0]}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wider">{cap.scope}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => onEdit(cap)} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"><Edit className="h-4 w-4"/></button>
                <button onClick={() => onDelete(cap.id)} className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500"><Trash2 className="h-4 w-4"/></button>
            </div>
        </div>

        {cap.usageHint && <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 italic">"{cap.usageHint}"</p>}
        
        <div className="mt-4 space-y-3 text-sm">
            <div>
                <h4 className="font-semibold">Signature:</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                    {cap.signature.map(s => <span key={s} className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 text-xs px-2 py-0.5 rounded-full">{s}</span>)}
                </div>
            </div>
             <div>
                <h4 className="font-semibold">Forbid:</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                    {cap.forbid.map(f => <span key={f} className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 text-xs px-2 py-0.5 rounded-full">{f}</span>)}
                </div>
            </div>
            {cap.palette && cap.palette.length > 0 && (
                <div>
                    <h4 className="font-semibold flex items-center gap-1.5"><Palette className="h-4 w-4 text-gray-500" /> Palette:</h4>
                    <div className="flex flex-wrap gap-1 mt-1 pl-5">
                        {cap.palette.map(p => <span key={p} className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs px-2 py-0.5 rounded-full">{p}</span>)}
                    </div>
                </div>
            )}
            {cap.camera && cap.camera.length > 0 && (
                <div>
                    <h4 className="font-semibold flex items-center gap-1.5"><Video className="h-4 w-4 text-gray-500" /> Camera:</h4>
                    <div className="flex flex-wrap gap-1 mt-1 pl-5">
                        {cap.camera.map(c => <span key={c} className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 text-xs px-2 py-0.5 rounded-full">{c}</span>)}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CapCard;
