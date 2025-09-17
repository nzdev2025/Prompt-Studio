import type { Project, Prompt, Template } from '../types';

// FIX: Updated mockProjects to match the Project interface in types.ts.
// Removed `promptCount` and `lastEdited`, and added `tags`, `createdAt`, and `updatedAt`.
export const mockProjects: Project[] = [
  { id: 'proj-1', name: 'E-commerce Chatbot', description: 'Customer support bot for an online store.', tags: ['chatbot', 'e-commerce'], createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), updatedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'proj-2', name: 'Content Summarizer', description: 'Generates summaries for articles and blogs.', tags: ['nlp', 'content'], createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), updatedAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'proj-3', name: 'Code Generation Tool', description: 'Assists developers by generating boilerplate code.', tags: ['developer-tools', 'code-gen'], createdAt: new Date(Date.now() - 86400000 * 14).toISOString(), updatedAt: new Date(Date.now() - 86400000 * 7).toISOString() },
  { id: 'proj-4', name: 'Social Media Assistant', description: 'Creates engaging posts for social platforms.', tags: ['social-media', 'marketing'], createdAt: new Date(Date.now() - 86400000 * 30).toISOString(), updatedAt: new Date(Date.now() - 86400000 * 14).toISOString() },
];

// FIX: Updated mockPrompts to match the Prompt interface in types.ts.
// Renamed `name` to `title`, converted `version` to a number, converted `variables` to `params` object,
// replaced `performance` with `score`, renamed `lastEdited` to `updatedAt`, and added missing fields.
export const mockPrompts: Prompt[] = [
  { id: 'p-1', projectId: 'proj-1', type: 'story', title: 'Greeting Prompt', content: 'Welcome our customer {{customer_name}} and ask how you can help them today.', version: 2, params: {customer_name: 'guest'}, caps: [], tags: ['greeting'], updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(), score: { clarity: 8, constraints: 7, continuity: 9, risk: 2 } },
  { id: 'p-2', projectId: 'proj-1', type: 'story', title: 'Return Policy', content: 'Explain the return policy clearly. Mention the {{days}} day return window.', version: 1, params: {days: 30}, caps: [], tags: ['policy'], updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(), score: { clarity: 9, constraints: 8, continuity: 9, risk: 1 } },
  { id: 'p-3', projectId: 'proj-2', type: 'story', title: 'Summarize Article', content: 'Summarize the following article in {{word_count}} words: {{article_text}}', version: 2, params: {word_count: 100, article_text: '...'}, caps: [], tags: ['summarization'], updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(), score: { clarity: 7, constraints: 6, continuity: 8, risk: 3 } },
  { id: 'p-4', projectId: 'proj-3', type: 'workflow', title: 'React Component Generator', content: 'Create a React functional component named {{component_name}} with the following props: {{props}}. Use TypeScript.', version: 5, params: {component_name: 'MyComponent', props: '...'}, caps: [], tags: ['react', 'code-gen'], updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(), score: { clarity: 9, constraints: 9, continuity: 9, risk: 5 } },
  { id: 'p-5', projectId: 'proj-1', type: 'story', title: 'Product Recommendation', content: 'Based on the user\'s interest in {{category}}, recommend 3 products.', version: 1, params: {category: 'electronics'}, caps: [], tags: ['recommendation', 'e-commerce'], updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(), score: { clarity: 8, constraints: 7, continuity: 7, risk: 2 } },
];

// FIX: Updated mockTemplates to match the Template interface in types.ts.
// Renamed `name` to `title` and replaced deprecated fields with `type`, `inputs`, `content`, and `tags`.
export const mockTemplates: Template[] = [
    { id: 't-1', type: 'story', title: 'Sentiment Analysis', inputs: ['text_to_analyze'], content: 'Analyze the sentiment of the following text and classify it as positive, negative, or neutral. Text: {{text_to_analyze}}', tags: ['Text Analysis', 'Customer Feedback', 'Social Media Monitoring'] },
    { id: 't-2', type: 'story', title: 'Translation', inputs: ['text_to_translate', 'target_language'], content: 'Translate the following text to {{target_language}}. Text: {{text_to_translate}}', tags: ['Language', 'Content Localization', 'Communication'] },
    { id: 't-3', type: 'story', title: 'Question Answering', inputs: ['context', 'question'], content: 'Based on the following context, answer the question.\n\nContext: {{context}}\n\nQuestion: {{question}}', tags: ['Information Retrieval', 'Documentation Search', 'Customer Support'] },
    { id: 't-4', type: 'story', title: 'Creative Writing', inputs: ['topic'], content: 'Write a creative piece about {{topic}}.', bestPractices: 'Can be a poem, code, script, musical piece, email, letter, etc.', tags: ['Content Generation', 'Marketing Copy', 'Story Writing'] },
];
