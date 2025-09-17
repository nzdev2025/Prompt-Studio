import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPrompt, getProject, updatePrompt, getCAPs, getCAP, createTemplate } from '../data/store';
import type { Prompt, Project, CAP } from '../types';
import { useAppContext } from '../hooks/useAppContext';
import { useToast } from '../hooks/useToast';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import { ArrowLeft, Tag, Save, Copy, Brain, Wand2, AlertTriangle, CheckCircle, XCircle, X } from 'lucide-react';

import Veo3Editor from '../components/prompt-editors/Veo3Editor';
import ImageEditor from '../components/prompt-editors/ImageEditor';
import StoryEditor from '../components/prompt-editors/StoryEditor';
import WorkflowEditor from '../components/prompt-editors/WorkflowEditor';
import ComposedPrompt from '../components/prompt-editors/ComposedPrompt';
import { composePrompt } from '../lib/promptComposer';
import { scorePrompt } from '../lib/promptScorer';
import TagInput from '../components/prompt-editors/common/TagInput';
import { validateContinuity, ContinuityIssue } from '../lib/continuityValidator';


const issueMessages: Record<string, { message: string, icon: React.ReactNode }> = {
    missing_cap: { message: "For best continuity, apply a Character, Environment, or Style CAP.", icon: <AlertTriangle className="h-5 w-5 text-yellow-500"/> },
    no_camera: { message: "Consider defining camera parameters for better control.", icon: <AlertTriangle className="h-5 w-5 text-yellow-500"/> },
    no_lighting: { message: "Consider defining lighting conditions for better control.", icon: <AlertTriangle className="h-5 w-5 text-yellow-500"/> },
    forbid_violation: { message: "Forbidden term found in prompt:", icon: <XCircle className="h-5 w-5 text-red-500"/> },
};


const PromptDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useAppContext();
  const { addToast } = useToast();
  
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [composedText, setComposedText] = useState('');
  const [continuityIssues, setContinuityIssues] = useState<ContinuityIssue[]>([]);
  
  const [errors, setErrors] = useState<{ title?: string }>({});

  useEffect(() => {
    if (id) {
        const foundPrompt = getPrompt(id);
        if (foundPrompt) {
            setPrompt(foundPrompt);
            const foundProject = getProject(foundPrompt.projectId);
            if (foundProject) {
                setProject(foundProject);
            } else {
                 navigate('/404');
            }
        } else {
            navigate('/404');
        }
    }
  }, [id, navigate]);
  
  useEffect(() => {
    if (prompt) {
      const newComposedText = composePrompt(prompt);
      setComposedText(newComposedText);
      setContinuityIssues(validateContinuity(prompt, newComposedText));
    }
  }, [prompt]);


  const validate = () => {
    const newErrors: { title?: string } = {};
    if (!prompt?.title.trim()) newErrors.title = 'Prompt title cannot be empty.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = () => {
    if (!prompt || !validate()) {
      addToast('Please fix the errors before saving.', 'error');
      return;
    }
    const updatedPromptData = { ...prompt, content: composedText };
    const updatedPrompt = updatePrompt(prompt.id, updatedPromptData);

    setPrompt(updatedPrompt || null);
    addToast(t('saved_successfully'), 'success');
  };
  
  useKeyboardShortcut(['Meta', 's'], handleSave);
  useKeyboardShortcut(['Control', 's'], handleSave);

  const handleParamsChange = (newParams: any) => {
    if (prompt) {
      setPrompt({ ...prompt, params: newParams });
    }
  };
  
  const handleScore = () => {
    if(prompt) {
        const newScore = scorePrompt(prompt);
        setPrompt({...prompt, score: newScore});
        addToast('Prompt scored!', 'info');
    }
  }
  
  const handleRefine = () => {
      if(prompt && (prompt.type === 'veo3' || prompt.type === 'image')) {
          const newParams = { ...prompt.params };
          if(!newParams.lighting) newParams.lighting = 'cinematic lighting';
          if(!newParams.negative) newParams.negative = [];
          if(!newParams.negative.includes('blurry')) newParams.negative.push('blurry');
          if(!newParams.negative.includes('low quality')) newParams.negative.push('low quality');
          if(prompt.type === 'veo3' && !newParams.camera) newParams.camera = { lens: '35mm' };
          setPrompt({ ...prompt, params: newParams });
          addToast('Prompt refined with pro controls!', 'info');
      } else {
          addToast('Refine is only available for VEO3 and Image prompts.', 'info');
      }
  }

  const handleDuplicateAsTemplate = () => {
      if(prompt) {
          const inputs = Object.keys(prompt.params);
          createTemplate({
              title: `${prompt.title} Template`,
              type: prompt.type,
              inputs,
              content: composedText,
              tags: prompt.tags,
          });
          addToast('Template created successfully!', 'success');
          navigate('/templates');
      }
  }

  const handleRemoveCap = (capIdToRemove: string) => {
    if(!prompt) return;
    const newCaps = prompt.caps.filter(c => c !== capIdToRemove);
    setPrompt({ ...prompt, caps: newCaps });
  }

  const renderEditor = () => {
    if (!prompt) return null;
    switch (prompt.type) {
      case 'veo3': return <Veo3Editor params={prompt.params} onParamsChange={handleParamsChange} />;
      case 'image': return <ImageEditor params={prompt.params} onParamsChange={handleParamsChange} />;
      case 'story': return <StoryEditor params={prompt.params} onParamsChange={handleParamsChange} />;
      case 'workflow': return <WorkflowEditor params={prompt.params} onParamsChange={handleParamsChange} />;
      default: return <p>This prompt type does not have a structured editor.</p>;
    }
  };

  const appliedCaps = useMemo(() => {
    return (prompt?.caps || []).map(id => getCAP(id)).filter((c): c is CAP => !!c);
  }, [prompt?.caps]);


  if (!prompt || !project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex items-center space-x-4 mb-4">
            <button onClick={() => navigate(`/projects/${prompt.projectId}`)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
                <input 
                    type="text"
                    value={prompt.title}
                    onChange={(e) => setPrompt({ ...prompt, title: e.target.value })}
                    className="text-3xl font-bold bg-transparent border-none p-0 focus:ring-0 w-full"
                    aria-label="Prompt title"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                <div className="text-gray-600 dark:text-gray-400 text-sm">
                    In <Link to={`/projects/${project.id}`} className="text-primary-600 dark:text-primary-400 hover:underline">{project.name}</Link>
                    <span className="mx-2">|</span>
                    v{prompt.version}
                    <span className="mx-2">|</span>
                    Last updated: {new Date(prompt.updatedAt).toLocaleString()}
                </div>
            </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
            <div className="flex-grow max-w-sm">
                <TagInput id="prompt-tags" tags={prompt.tags} setTags={(tags) => setPrompt({...prompt, tags})} placeholder="Add tags..." />
            </div>
            {appliedCaps.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">Applied CAPs:</span>
                    {appliedCaps.map(cap => (
                        <span key={cap.id} className="flex items-center bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 text-sm font-medium px-2.5 py-0.5 rounded-full">
                            {cap.signature[0]}
                            <button onClick={() => handleRemoveCap(cap.id)} className="ml-1.5 -mr-1 p-0.5 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800"><X className="h-3 w-3" /></button>
                        </span>
                    ))}
                </div>
            )}
            <div className="flex-grow"/>
            <div className="flex items-center gap-2">
                 <select onChange={e => {
                    const capId = e.target.value;
                    if (capId && !prompt.caps.includes(capId)) {
                        const cap = getCAP(capId);
                        const newNegatives = [...(prompt.params.negative || [])];
                        if (cap?.forbid) {
                            cap.forbid.forEach(f => {
                                if (!newNegatives.includes(f)) newNegatives.push(f);
                            })
                        }
                        setPrompt({...prompt, caps: [...prompt.caps, capId], params: {...prompt.params, negative: newNegatives}});
                    }
                    e.target.value = ''; // Reset select
                 }} className="p-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                    <option value="">Apply CAP...</option>
                    {getCAPs().filter(c => !prompt.caps.includes(c.id)).map(cap => <option key={cap.id} value={cap.id}>{cap.scope}: {cap.signature[0]}</option>)}
                 </select>
                <button onClick={handleScore} className="p-2 text-sm flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"><Brain className="h-4 w-4"/> Score</button>
                <button onClick={handleRefine} className="p-2 text-sm flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"><Wand2 className="h-4 w-4"/> Refine</button>
                <button onClick={handleDuplicateAsTemplate} className="p-2 text-sm flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"><Copy className="h-4 w-4"/> Duplicate as Template</button>
                <button onClick={handleSave} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition text-sm flex items-center gap-2">
                    <Save className="h-4 w-4"/> Save (⌘S)
                </button>
            </div>
        </div>
        
        {continuityIssues.length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 rounded-md text-sm space-y-2">
                <h4 className="font-semibold flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-yellow-500" /> Continuity Feedback</h4>
                {continuityIssues.map(issue => {
                    const issueKey = issue.startsWith('forbid_violation') ? 'forbid_violation' : issue;
                    const { message, icon } = issueMessages[issueKey];
                    return (
                        <div key={issue} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            {icon}
                            <span>{message} {issue.startsWith('forbid_violation') && <strong className="font-mono bg-red-100 dark:bg-red-900/50 p-1 rounded">'{issue.split(':')[1]}'</strong>}</span>
                        </div>
                    );
                })}
            </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md overflow-y-auto">
          {renderEditor()}
        </div>
        <div className="overflow-y-auto">
          <ComposedPrompt composedText={composedText} />
        </div>
      </div>
    </div>
  );
};

export default PromptDetail;
