import React from 'react';
import FormField, { TextInput, TextArea } from './common/FormField';

interface StoryEditorProps {
  params: any;
  onParamsChange: (newParams: any) => void;
}

const StoryEditor: React.FC<StoryEditorProps> = ({ params, onParamsChange }) => {
  const handleChange = (field: string, value: any) => {
    onParamsChange({ ...params, [field]: value });
  };
  
  const handleBeatChange = (beat: string, value: string) => {
    onParamsChange({ ...params, beats: { ...params.beats, [beat]: value } });
  }

  const handleSceneCardChange = (field: string, value: string) => {
    onParamsChange({ ...params, sceneCard: { ...params.sceneCard, [field]: value } });
  }

  const storyBeats = ['opening', 'inciting incident', 'rising action', 'climax', 'falling action', 'resolution'];

  return (
    <div className="space-y-4">
      <FormField label="Logline" id="logline"><TextArea id="logline" value={params.logline || ''} onChange={e => handleChange('logline', e.target.value)} /></FormField>
      <FormField label="Theme" id="theme"><TextInput id="theme" value={params.theme || ''} onChange={e => handleChange('theme', e.target.value)} /></FormField>
      
      <fieldset className="border border-gray-300 dark:border-gray-600 rounded-md p-4">
        <legend className="text-sm font-medium px-1">Story Beats</legend>
        <div className="space-y-3">
          {storyBeats.map(beat => (
            <FormField label={beat.charAt(0).toUpperCase() + beat.slice(1)} id={`beat-${beat}`} key={beat}>
              <TextInput id={`beat-${beat}`} value={params.beats?.[beat] || ''} onChange={e => handleBeatChange(beat, e.target.value)} />
            </FormField>
          ))}
        </div>
      </fieldset>
      
      <fieldset className="border border-gray-300 dark:border-gray-600 rounded-md p-4">
        <legend className="text-sm font-medium px-1">Scene Card</legend>
         <div className="grid grid-cols-2 gap-4">
            <FormField label="INT/EXT" id="scene-intext"><TextInput id="scene-intext" value={params.sceneCard?.intExt || ''} onChange={e => handleSceneCardChange('intExt', e.target.value)} /></FormField>
            <FormField label="Location" id="scene-location"><TextInput id="scene-location" value={params.sceneCard?.location || ''} onChange={e => handleSceneCardChange('location', e.target.value)} /></FormField>
            <FormField label="Time" id="scene-time"><TextInput id="scene-time" value={params.sceneCard?.time || ''} onChange={e => handleSceneCardChange('time', e.target.value)} /></FormField>
            <FormField label="Dialogue Style" id="scene-dialogueStyle"><TextInput id="scene-dialogueStyle" value={params.sceneCard?.dialogueStyle || ''} onChange={e => handleSceneCardChange('dialogueStyle', e.target.value)} /></FormField>
        </div>
        <div className="space-y-3 mt-3">
            <FormField label="Goal" id="scene-goal"><TextInput id="scene-goal" value={params.sceneCard?.goal || ''} onChange={e => handleSceneCardChange('goal', e.target.value)} /></FormField>
            <FormField label="Conflict" id="scene-conflict"><TextInput id="scene-conflict" value={params.sceneCard?.conflict || ''} onChange={e => handleSceneCardChange('conflict', e.target.value)} /></FormField>
            <FormField label="Stakes" id="scene-stakes"><TextInput id="scene-stakes" value={params.sceneCard?.stakes || ''} onChange={e => handleSceneCardChange('stakes', e.target.value)} /></FormField>
            <FormField label="Motif" id="scene-motif"><TextInput id="scene-motif" value={params.sceneCard?.motif || ''} onChange={e => handleSceneCardChange('motif', e.target.value)} /></FormField>
        </div>
      </fieldset>
    </div>
  );
};

export default StoryEditor;
