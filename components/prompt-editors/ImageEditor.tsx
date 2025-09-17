import React from 'react';
import FormField, { TextInput } from './common/FormField';
import TagInput from './common/TagInput';

interface ImageEditorProps {
  params: any;
  onParamsChange: (newParams: any) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ params, onParamsChange }) => {
  const handleChange = (field: string, value: any) => {
    onParamsChange({ ...params, [field]: value });
  };

  return (
    <div className="space-y-4">
      <FormField label="Subject" id="subject"><TextInput id="subject" value={params.subject || ''} onChange={e => handleChange('subject', e.target.value)} /></FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Pose" id="pose"><TextInput id="pose" value={params.pose || ''} onChange={e => handleChange('pose', e.target.value)} /></FormField>
        <FormField label="Wardrobe" id="wardrobe"><TextInput id="wardrobe" value={params.wardrobe || ''} onChange={e => handleChange('wardrobe', e.target.value)} /></FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Framing" id="framing"><TextInput id="framing" value={params.framing || ''} onChange={e => handleChange('framing', e.target.value)} /></FormField>
        <FormField label="Composition" id="composition"><TextInput id="composition" value={params.composition || ''} onChange={e => handleChange('composition', e.target.value)} /></FormField>
      </div>
       <div className="grid grid-cols-2 gap-4">
        <FormField label="Lighting" id="lighting"><TextInput id="lighting" value={params.lighting || ''} onChange={e => handleChange('lighting', e.target.value)} /></FormField>
        <FormField label="Mood" id="mood"><TextInput id="mood" value={params.mood || ''} onChange={e => handleChange('mood', e.target.value)} /></FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Lens" id="lens"><TextInput id="lens" value={params.lens || ''} onChange={e => handleChange('lens', e.target.value)} /></FormField>
        <FormField label="Depth of Field" id="depth"><TextInput id="depth" value={params.depth || ''} onChange={e => handleChange('depth', e.target.value)} /></FormField>
      </div>
      <FormField label="Post-processing Style" id="postStyle"><TextInput id="postStyle" value={params.postStyle || ''} onChange={e => handleChange('postStyle', e.target.value)} /></FormField>
       <div className="grid grid-cols-2 gap-4">
        <FormField label="Palette" id="palette"><TextInput id="palette" value={params.palette || ''} onChange={e => handleChange('palette', e.target.value)} /></FormField>
        <FormField label="Grain" id="grain"><TextInput id="grain" value={params.grain || ''} onChange={e => handleChange('grain', e.target.value)} /></FormField>
      </div>
      <FormField label="Negative Prompts" id="negative-prompts">
          <TagInput id="negative-prompts" tags={params.negative || []} setTags={tags => handleChange('negative', tags)} placeholder="Add negative prompt..."/>
       </FormField>
    </div>
  );
};

export default ImageEditor;
