import React from 'react';
import FormField, { TextInput, TextArea } from './common/FormField';
import TagInput from './common/TagInput';

interface Veo3EditorProps {
  params: any;
  onParamsChange: (newParams: any) => void;
}

const Veo3Editor: React.FC<Veo3EditorProps> = ({ params, onParamsChange }) => {
  const handleChange = (field: string, value: any) => {
    onParamsChange({ ...params, [field]: value });
  };
  const handleCameraChange = (field: string, value: any) => {
    onParamsChange({ ...params, camera: { ...params.camera, [field]: value } });
  }

  return (
    <div className="space-y-4">
      <FormField label="Genre" id="genre">
        <TextInput id="genre" value={params.genre || ''} onChange={e => handleChange('genre', e.target.value)} />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Location" id="location">
          <TextInput id="location" value={params.location || ''} onChange={e => handleChange('location', e.target.value)} />
        </FormField>
        <FormField label="Time of Day" id="timeOfDay">
          <TextInput id="timeOfDay" value={params.timeOfDay || ''} onChange={e => handleChange('timeOfDay', e.target.value)} />
        </FormField>
      </div>
      <FormField label="Action" id="action">
        <TextArea id="action" value={params.action || ''} onChange={e => handleChange('action', e.target.value)} />
      </FormField>
      <FormField label="Ambience / Mood" id="ambience">
        <TextInput id="ambience" value={params.ambience || ''} onChange={e => handleChange('ambience', e.target.value)} />
      </FormField>
      <FormField label="Lighting" id="lighting">
        <TextInput id="lighting" value={params.lighting || ''} onChange={e => handleChange('lighting', e.target.value)} />
      </FormField>
      <fieldset className="border border-gray-300 dark:border-gray-600 rounded-md p-4">
        <legend className="text-sm font-medium px-1">Camera</legend>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Lens" id="camera-lens"><TextInput id="camera-lens" value={params.camera?.lens || ''} onChange={e => handleCameraChange('lens', e.target.value)} /></FormField>
          <FormField label="Movement" id="camera-movement"><TextInput id="camera-movement" value={params.camera?.movement || ''} onChange={e => handleCameraChange('movement', e.target.value)} /></FormField>
          <FormField label="Framing" id="camera-framing"><TextInput id="camera-framing" value={params.camera?.framing || ''} onChange={e => handleCameraChange('framing', e.target.value)} /></FormField>
          <FormField label="Duration (s)" id="camera-duration"><TextInput type="number" id="camera-duration" value={params.camera?.duration || 8} onChange={e => handleCameraChange('duration', e.target.value)} /></FormField>
        </div>
      </fieldset>
      <FormField label="Palette" id="palette" helpText="e.g., 'Vibrant neon colors', 'Monochromatic blues'">
        <TextInput id="palette" value={params.palette || ''} onChange={e => handleChange('palette', e.target.value)} />
      </FormField>
       <FormField label="Style References" id="style-refs">
          <TagInput id="style-refs" tags={params.styleRefs || []} setTags={tags => handleChange('styleRefs', tags)} placeholder="Add style ref..."/>
       </FormField>
       <FormField label="Negative Prompts" id="negative-prompts">
          <TagInput id="negative-prompts" tags={params.negative || []} setTags={tags => handleChange('negative', tags)} placeholder="Add negative prompt..."/>
       </FormField>
    </div>
  );
};

export default Veo3Editor;
