import type { Prompt, CAP } from '../types';
import { getCAP } from '../data/store';

export type ContinuityIssue = 'missing_cap' | `forbid_violation:${string}` | 'no_camera' | 'no_lighting';

const lowerCaseIncludes = (text: string, term: string): boolean => {
    return text.toLowerCase().includes(term.toLowerCase());
}

/**
 * Validates a prompt for continuity issues.
 * @param prompt - The prompt object to validate.
 * @param composedText - The fully composed text of the prompt.
 * @returns An array of continuity issue strings.
 */
export const validateContinuity = (prompt: Prompt, composedText: string): ContinuityIssue[] => {
    if (!prompt) return [];

    const issues: ContinuityIssue[] = [];
    const isVisualPrompt = prompt.type === 'veo3' || prompt.type === 'image';

    // 1. Check for missing CAPs on visual prompts
    if (isVisualPrompt && (!prompt.caps || prompt.caps.length === 0)) {
        issues.push('missing_cap');
    }

    // 2. Check for "forbid" violations
    if (prompt.caps && prompt.caps.length > 0) {
        prompt.caps.forEach(capId => {
            const cap = getCAP(capId);
            if (cap && cap.forbid) {
                cap.forbid.forEach(term => {
                    if (lowerCaseIncludes(composedText, term)) {
                        issues.push(`forbid_violation:${term}`);
                    }
                });
            }
        });
    }

    // 3. Check for missing camera on VEO prompts
    if (prompt.type === 'veo3') {
        if (!prompt.params.camera || Object.values(prompt.params.camera).every(v => !v)) {
            issues.push('no_camera');
        }
    }

    // 4. Check for missing lighting on visual prompts
    if (isVisualPrompt && !prompt.params.lighting) {
        issues.push('no_lighting');
    }

    return issues;
};
