import type { Prompt } from '../types';

// A helper to format array inputs, like negative prompts
const formatArray = (label: string, items: string[] | undefined) => {
  if (!items || items.length === 0) return '';
  return `\n${label}: ${items.join(', ')}`;
};

// A helper to format object inputs, like camera settings
const formatObject = (label: string, obj: Record<string, any> | undefined) => {
    if (!obj) return '';
    const content = Object.entries(obj)
        .filter(([, value]) => value)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    return content ? `\n${label}: { ${content} }` : '';
}

// Main composer function
export const composePrompt = (prompt: Prompt | null): string => {
  if (!prompt) return '';

  const { type, params, caps } = prompt;
  let composed = '';

  // Inject CAP tokens first
  const capTokens = (caps || []).map(c => `[CAP:${c}]`).join(' ');
  if (capTokens) {
    composed += `${capTokens}\n\n`;
  }

  switch (type) {
    case 'veo3':
      composed += `A VEO video.\nGenre: ${params.genre || '{{genre}}'}. Location: ${params.location || '{{location}}'}. Time of Day: ${params.timeOfDay || '{{timeOfDay}}'}.`;
      composed += `\nAction: ${params.action || '{{action}}'}`;
      composed += `\nAmbience: ${params.ambience || '{{ambience}}'}`;
      composed += `\nLighting: ${params.lighting || '{{lighting}}'}`;
      composed += formatObject('Camera', params.camera);
      composed += `\nPalette: ${params.palette || '{{palette}}'}`;
      composed += formatArray('Style Refs', params.styleRefs);
      composed += formatArray('Negative', params.negative);
      break;
    
    case 'image':
      composed += `An image of ${params.subject || '{{subject}}'}.`;
      composed += `\nPose: ${params.pose || '{{pose}}'}`;
      composed += `\nWardrobe: ${params.wardrobe || '{{wardrobe}}'}`;
      composed += `\nFraming: ${params.framing || '{{framing}}'}`;
      composed += `\nComposition: ${params.composition || '{{composition}}'}`;
      composed += `\nLighting: ${params.lighting || '{{lighting}}'}`;
      composed += `\nMood: ${params.mood || '{{mood}}'}`;
      composed += `\nCamera Lens: ${params.lens || '{{lens}}'}`;
      composed += `\nDepth of Field: ${params.depth || '{{depth}}'}`;
      composed += `\nPost-processing Style: ${params.postStyle || '{{postStyle}}'}`;
      composed += `\nPalette: ${params.palette || '{{palette}}'}`;
      composed += `\nGrain: ${params.grain || '{{grain}}'}`;
      composed += formatArray('Negative', params.negative);
      break;

    case 'story':
        composed += `Logline: ${params.logline || '{{logline}}'}\nTheme: ${params.theme || '{{theme}}'}`;
        if(params.beats) {
            composed += '\n\nBeats:';
            Object.entries(params.beats).forEach(([beat, description]) => {
                composed += `\n- ${beat.charAt(0).toUpperCase() + beat.slice(1)}: ${description}`;
            });
        }
        if(params.sceneCard) {
            composed += '\n\nScene Card:';
            Object.entries(params.sceneCard).forEach(([key, value]) => {
                composed += `\n- ${key}: ${value}`;
            });
        }
      break;

    case 'workflow':
        composed += `Workflow Steps:`;
        (params.steps || []).forEach((step: string, index: number) => {
            composed += `\n${index + 1}. ${step}`;
        });
      break;

    default:
      composed = prompt.content;
      break;
  }

  return composed.trim();
};
