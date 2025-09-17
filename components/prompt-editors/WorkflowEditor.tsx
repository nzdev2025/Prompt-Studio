import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { TextArea } from './common/FormField';

interface WorkflowEditorProps {
  params: any;
  onParamsChange: (newParams: any) => void;
}

const WorkflowEditor: React.FC<WorkflowEditorProps> = ({ params, onParamsChange }) => {
  const steps = params.steps || [];

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    onParamsChange({ ...params, steps: newSteps });
  };

  const addStep = () => {
    onParamsChange({ ...params, steps: [...steps, ''] });
  };
  
  const removeStep = (index: number) => {
    const newSteps = steps.filter((_: any, i: number) => i !== index);
     onParamsChange({ ...params, steps: newSteps });
  };

  return (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold">Workflow Steps</h3>
        {steps.map((step: string, index: number) => (
            <div key={index} className="flex items-start gap-2">
                <span className="pt-2 font-semibold">{index + 1}.</span>
                <TextArea
                    value={step}
                    onChange={e => handleStepChange(index, e.target.value)}
                    className="flex-grow"
                    placeholder={`Describe step ${index + 1}...`}
                />
                <button 
                    onClick={() => removeStep(index)}
                    className="p-2 mt-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500"
                    aria-label={`Remove step ${index + 1}`}
                >
                    <Trash2 className="h-5 w-5" />
                </button>
            </div>
        ))}
        <button onClick={addStep} className="flex items-center bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold py-2 px-4 rounded-md transition">
            <Plus className="h-4 w-4 mr-1"/> Add Step
        </button>
    </div>
  );
};

export default WorkflowEditor;
