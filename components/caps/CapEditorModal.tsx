
import React, { useState, useEffect } from 'react';
import type { CAP } from '../../types';
import Modal from '../ui/Modal';
import FormField, { TextInput, TextArea } from '../prompt-editors/common/FormField';
import TagInput from '../prompt-editors/common/TagInput';

interface CapEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cap: Omit<CAP, 'id'> | CAP) => void;
  capToEdit?: CAP | null;
}

const initialCapState: Omit<CAP, 'id'> = {
  scope: 'character',
  signature: [],
  forbid: [],
  palette: [],
  camera: [],
  usageHint: ''
};

const CapEditorModal: React.FC<CapEditorModalProps> = ({ isOpen, onClose, onSave, capToEdit }) => {
  const [cap, setCap] = useState(capToEdit || initialCapState);

  useEffect(() => {
    setCap(capToEdit || initialCapState);
  }, [capToEdit, isOpen]);

  const handleChange = (field: keyof Omit<CAP, 'id'>, value: any) => {
    setCap(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSave = () => {
      // Basic validation
      if (cap.signature.length === 0) {
          alert('Signature must have at least one entry.');
          return;
      }
      onSave(cap);
      onClose();
  }

  const title = capToEdit ? 'Edit CAP' : 'Create New CAP';

  const footerContent = (
    <div className="flex gap-2">
        <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
        <button onClick={handleSave} className="px-4 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-semibold">Save CAP</button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footerContent}>
      <div className="space-y-4">
        <FormField label="Scope" id="cap-scope">
          <select 
            id="cap-scope"
            value={cap.scope}
            onChange={(e) => handleChange('scope', e.target.value as CAP['scope'])}
            className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
          >
            <option value="character">Character</option>
            <option value="env">Environment</option>
            <option value="style">Style</option>
          </select>
        </FormField>
        <FormField label="Signature" id="cap-signature" helpText="Core defining keywords (e.g., character traits, location markers). The first tag is the display name.">
          <TagInput id="cap-signature" tags={cap.signature} setTags={(tags) => handleChange('signature', tags)} placeholder="Add signature keyword..." />
        </FormField>
        <FormField label="Forbid" id="cap-forbid" helpText="Keywords that should NEVER appear when this CAP is used.">
          <TagInput id="cap-forbid" tags={cap.forbid} setTags={(tags) => handleChange('forbid', tags)} placeholder="Add forbidden keyword..." />
        </FormField>
        <FormField label="Palette" id="cap-palette" helpText="Optional: Specific colors or color mood descriptions.">
          <TagInput id="cap-palette" tags={cap.palette || []} setTags={(tags) => handleChange('palette', tags)} placeholder="Add color or mood..." />
        </FormField>
         <FormField label="Camera" id="cap-camera" helpText="Optional: Suggested camera settings (e.g., 'wide-angle', 'dolly zoom').">
          <TagInput id="cap-camera" tags={cap.camera || []} setTags={(tags) => handleChange('camera', tags)} placeholder="Add camera setting..." />
        </FormField>
         <FormField label="Usage Hint" id="cap-usageHint">
            <TextArea id="cap-usageHint" value={cap.usageHint || ''} onChange={(e) => handleChange('usageHint', e.target.value)} />
         </FormField>
      </div>
    </Modal>
  );
};

export default CapEditorModal;
