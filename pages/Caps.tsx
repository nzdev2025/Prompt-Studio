import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Plus, FolderKanban } from 'lucide-react';
import type { CAP } from '../types';
import { getCAPs, createCAP, updateCAP, deleteCAP } from '../data/store';
import { useToast } from '../hooks/useToast';
import CapCard from '../components/caps/CapCard';
import CapEditorModal from '../components/caps/CapEditorModal';


const Caps: React.FC = () => {
  const { t } = useAppContext();
  const { addToast } = useToast();
  
  const [caps, setCaps] = useState<CAP[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCap, setEditingCap] = useState<CAP | null>(null);

  useEffect(() => {
    setCaps(getCAPs());
  }, []);
  
  const handleOpenCreateModal = () => {
    setEditingCap(null);
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (cap: CAP) => {
    setEditingCap(cap);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this CAP?')) {
        deleteCAP(id);
        setCaps(getCAPs());
        addToast('CAP deleted successfully', 'success');
    }
  };
  
  const handleSave = (capData: Omit<CAP, 'id'> | CAP) => {
      if ('id' in capData) {
          updateCAP(capData.id, capData);
          addToast('CAP updated successfully', 'success');
      } else {
          createCAP(capData);
          addToast('CAP created successfully', 'success');
      }
      setCaps(getCAPs());
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('caps')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage reusable Continuity & Asset Profiles for your prompts.</p>
        </div>
        <button onClick={handleOpenCreateModal} className="flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          <Plus className="h-5 w-5 mr-2" />
          New CAP
        </button>
      </div>
      
      {caps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caps.map(cap => (
                <CapCard key={cap.id} cap={cap} onEdit={handleOpenEditModal} onDelete={handleDelete} />
            ))}
        </div>
      ) : (
         <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <FolderKanban className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">No CAPs found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new Continuity & Asset Profile.</p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleOpenCreateModal}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  New CAP
                </button>
              </div>
        </div>
      )}

      <CapEditorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        capToEdit={editingCap}
      />
    </div>
  );
};

export default Caps;
