import type { Prompt, Score } from '../types';
import { validateContinuity, ContinuityIssue } from './continuityValidator';
import { composePrompt } from './promptComposer';

const countFilled = (obj: any, keys: string[]): number => {
    if (!obj) return 0;
    return keys.reduce((count, key) => count + (obj[key] ? 1 : 0), 0);
}

const calculateContinuityScore = (issues: ContinuityIssue[]): number => {
    if (issues.length === 0) return 10;
    
    let score = 10;
    if (issues.some(i => i.startsWith('forbid_violation'))) {
        return 1; // Major violation
    }
    if (issues.includes('missing_cap')) {
        score -= 5;
    }
    if (issues.includes('no_camera')) {
        score -= 2;
    }
    if (issues.includes('no_lighting')) {
        score -= 2;
    }

    return Math.max(1, score);
}


export const scorePrompt = (prompt: Prompt): Score => {
    const { type, params, caps } = prompt;
    let clarity = 0;
    let constraints = 0;
    const risk = 2; // Placeholder for risk score

    // Run validation to determine continuity score
    const composedText = composePrompt(prompt);
    const issues = validateContinuity(prompt, composedText);
    const continuity = calculateContinuityScore(issues);

    switch (type) {
        case 'veo3':
        case 'image':
            const coreFields = (type === 'veo3') 
                ? ['genre', 'location', 'action'] 
                : ['subject', 'pose', 'composition'];
            const proFields = ['lighting', 'palette', 'negative'];
            
            clarity = Math.round((countFilled(params, coreFields) / coreFields.length) * 10);
            constraints = Math.round((countFilled(params, proFields) / proFields.length) * 10);
            break;
        case 'story':
            const storyFields = ['logline', 'theme'];
            clarity = Math.round((countFilled(params, storyFields) / storyFields.length) * 10);
            constraints = params.beats && Object.values(params.beats).some(v => v) ? 8 : 4;
            break;
        case 'workflow':
            clarity = params.steps && params.steps.length > 2 ? 9 : 5;
            constraints = 7;
            break;
        default:
            return prompt.score || { clarity: 0, constraints: 0, continuity: 0, risk: 0 };
    }

    return {
        clarity: Math.max(1, clarity),
        constraints: Math.max(1, constraints),
        continuity,
        risk
    }
};
