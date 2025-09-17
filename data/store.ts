import type { Project, Prompt, CAP, Template } from '../types';

// In-memory store
let projects: Project[] = [];
let prompts: Prompt[] = [];
let caps: CAP[] = [];
let templates: Template[] = [];

// --- Private utility functions ---

const persist = (key: string, data: any) => {
  // TODO_CONNECT: This would be an API call in a real app
  try {
    localStorage.setItem(`prompt-studio:${key}`, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to persist ${key} to localStorage`, error);
  }
};

const load = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(`prompt-studio:${key}`);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Failed to load ${key} from localStorage`, error);
    return [];
  }
};

export const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

// --- Seeding ---

const seedData = () => {
  // CAPS
  const cap1: CAP = { id: 'cap-char-hero', scope: 'character', signature: ['brave', 'heroic', 'cybernetic implants'], forbid: ['cowardly', 'weak'], usageHint: 'Main protagonist' };
  const cap2: CAP = { id: 'cap-env-dystopia', scope: 'env', signature: ['dystopian city', 'neon-lit rain', 'flying vehicles'], forbid: ['sunny', 'utopian'], palette: ['#FF00FF', '#00FFFF', '#39FF14'] };
  caps = [cap1, cap2];
  persist('caps', caps);
  
  // Projects
  const project1: Project = { id: 'proj-1', name: 'Cyberpunk Saga', description: 'A VEO3 short film project.', tags: ['sci-fi', 'dystopian'], createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), updatedAt: new Date(Date.now() - 86400000 * 2).toISOString() };
  const project2: Project = { id: 'proj-2', name: 'Marketing Images', description: 'Generates images for social media campaigns.', tags: ['marketing', 'social-media'], createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), updatedAt: new Date(Date.now() - 86400000 * 1).toISOString() };
  projects = [project1, project2];
  persist('projects', projects);

  // Prompts
  const prompt1: Prompt = { id: 'p-1', projectId: 'proj-1', type: 'veo3', title: 'Opening Scene', content: 'A high-speed chase through the neon-drenched canyons of a futuristic city. The hero, {{hero_name}}, is on a stolen hoverbike.', params: { hero_name: 'Jax' }, caps: ['cap-char-hero', 'cap-env-dystopia'], version: 3, tags: ['action', 'intro'], updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(), score: { clarity: 8, constraints: 9, continuity: 7, risk: 4 } };
  const prompt2: Prompt = { id: 'p-2', projectId: 'proj-1', type: 'story', title: 'Jax\'s Backstory', content: 'Describe the tragic event from {{hero_name}}\'s past that motivates him.', params: { hero_name: 'Jax' }, caps: ['cap-char-hero'], version: 1, tags: ['exposition', 'character'], updatedAt: new Date(Date.now() - 86400000 * 1).toISOString() };
  const prompt3: Prompt = { id: 'p-3', projectId: 'proj-2', type: 'image', title: 'Summer Sale Ad', content: 'A vibrant, sunny beach scene with our product, {{product_name}}, displayed prominently. Style: photorealistic.', params: { product_name: 'Sun-B-Gone 3000' }, caps: [], version: 5, tags: ['summer', 'sale'], updatedAt: new Date().toISOString() };
  prompts = [prompt1, prompt2, prompt3];
  persist('prompts', prompts);

  // Templates
  const template1: Template = { id: 't-1', type: 'image', title: 'Product Showcase', inputs: ['product_name', 'background_setting', 'style'], content: 'A marketing image of {{product_name}} in a {{background_setting}}. Style: {{style}}.', bestPractices: 'Be specific with the style. Use words like "photorealistic", "cinematic", "anime", etc.', tags: ['e-commerce', 'marketing'] };
  const template2: Template = { id: 't-2', type: 'story', title: 'Character Introduction', inputs: ['character_name', 'key_trait'], content: 'Introduce a new character named {{character_name}} whose most defining trait is being {{key_trait}}.', tags: ['creative-writing'] };
  templates = [template1, template2];
  persist('templates', templates);
  
  localStorage.setItem('prompt-studio:seeded', 'true');
};

export const initializeStore = () => {
  const isSeeded = localStorage.getItem('prompt-studio:seeded');
  if (!isSeeded) {
    seedData();
  } else {
    projects = load<Project>('projects');
    prompts = load<Prompt>('prompts');
    caps = load<CAP>('caps');
    templates = load<Template>('templates');
  }
};

// --- Data Access & Modification ---
export interface FullStoreData {
    projects: Project[];
    prompts: Prompt[];
    caps: CAP[];
    templates: Template[];
}

export const getAllData = (): FullStoreData => {
    // TODO_CONNECT: Fetch all data from backend
    return { projects: [...projects], prompts: [...prompts], caps: [...caps], templates: [...templates] };
}

export const importData = (data: FullStoreData): void => {
    // TODO_CONNECT: Send imported data to backend
    projects = [...projects, ...data.projects];
    prompts = [...prompts, ...data.prompts];
    caps = [...caps, ...data.caps];
    templates = [...templates, ...data.templates];
    
    persist('projects', projects);
    persist('prompts', prompts);
    persist('caps', caps);
    persist('templates', templates);
}


// --- CRUD Functions ---

// Projects
export const getProjects = (): Project[] => {
  // TODO_CONNECT: Fetch from backend
  return [...projects];
};

export const getProject = (id: string): Project | undefined => {
  // TODO_CONNECT: Fetch from backend
  return projects.find(p => p.id === id);
};

export const createProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project => {
  // TODO_CONNECT: POST to backend
  const newProject: Project = {
    ...projectData,
    id: generateId('proj'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  projects.push(newProject);
  persist('projects', projects);
  return newProject;
};

export const updateProject = (id: string, updates: Partial<Project>): Project | undefined => {
  // TODO_CONNECT: PUT/PATCH to backend
  const index = projects.findIndex(p => p.id === id);
  if (index > -1) {
    projects[index] = { ...projects[index], ...updates, updatedAt: new Date().toISOString() };
    persist('projects', projects);
    return projects[index];
  }
  return undefined;
};

export const deleteProject = (id: string): boolean => {
  // TODO_CONNECT: DELETE to backend
  const initialLength = projects.length;
  projects = projects.filter(p => p.id !== id);
  // Also delete associated prompts
  prompts = prompts.filter(p => p.projectId !== id);
  persist('prompts', prompts);
  if (projects.length < initialLength) {
    persist('projects', projects);
    return true;
  }
  return false;
};

// Prompts
export const getPrompts = (): Prompt[] => {
  // TODO_CONNECT: Fetch from backend
  return [...prompts];
};
export const getPromptsByProjectId = (projectId: string): Prompt[] => {
  // TODO_CONNECT: Fetch from backend
  return prompts.filter(p => p.projectId === projectId);
};
export const getPrompt = (id: string): Prompt | undefined => {
  // TODO_CONNECT: Fetch from backend
  return prompts.find(p => p.id === id);
};
export const createPrompt = (promptData: Omit<Prompt, 'id' | 'updatedAt' | 'version'>): Prompt => {
  // TODO_CONNECT: POST to backend
  const newPrompt: Prompt = {
    ...promptData,
    id: generateId('p'),
    version: 1,
    updatedAt: new Date().toISOString(),
  };
  prompts.push(newPrompt);
  persist('prompts', prompts);
  return newPrompt;
};
export const updatePrompt = (id: string, updates: Partial<Prompt>): Prompt | undefined => {
  // TODO_CONNECT: PUT/PATCH to backend
  const index = prompts.findIndex(p => p.id === id);
  if (index > -1) {
    const currentPrompt = prompts[index];
    const newVersion = (updates.content && updates.content !== currentPrompt.content) 
      ? currentPrompt.version + 1 
      : currentPrompt.version;
      
    prompts[index] = { ...currentPrompt, ...updates, updatedAt: new Date().toISOString(), version: newVersion };
    persist('prompts', prompts);
    return prompts[index];
  }
  return undefined;
};
export const deletePrompt = (id: string): boolean => {
  // TODO_CONNECT: DELETE to backend
  const initialLength = prompts.length;
  prompts = prompts.filter(p => p.id !== id);
  if (prompts.length < initialLength) {
    persist('prompts', prompts);
    return true;
  }
  return false;
};

// CAPs
export const getCAPs = (): CAP[] => {
  // TODO_CONNECT: Fetch from backend
  return [...caps];
};
export const getCAP = (id: string): CAP | undefined => {
  // TODO_CONNECT: Fetch from backend
  return caps.find(c => c.id === id);
};
export const createCAP = (capData: Omit<CAP, 'id'>): CAP => {
  // TODO_CONNECT: POST to backend
  const newCap: CAP = { ...capData, id: generateId('cap') };
  caps.push(newCap);
  persist('caps', caps);
  return newCap;
};
export const updateCAP = (id: string, updates: Partial<CAP>): CAP | undefined => {
  // TODO_CONNECT: PUT/PATCH to backend
  const index = caps.findIndex(c => c.id === id);
  if (index > -1) {
    caps[index] = { ...caps[index], ...updates };
    persist('caps', caps);
    return caps[index];
  }
  return undefined;
};
export const deleteCAP = (id: string): boolean => {
  // TODO_CONNECT: DELETE to backend
  const initialLength = caps.length;
  caps = caps.filter(c => c.id !== id);
  if (caps.length < initialLength) {
    persist('caps', caps);
    return true;
  }
  return false;
};

// Templates
export const getTemplates = (): Template[] => {
  // TODO_CONNECT: Fetch from backend
  return [...templates];
};
export const getTemplate = (id: string): Template | undefined => {
  // TODO_CONNECT: Fetch from backend
  return templates.find(t => t.id === id);
};
export const createTemplate = (templateData: Omit<Template, 'id'>): Template => {
  // TODO_CONNECT: POST to backend
  const newTemplate: Template = { ...templateData, id: generateId('t') };
  templates.push(newTemplate);
  persist('templates', templates);
  return newTemplate;
};
export const updateTemplate = (id: string, updates: Partial<Template>): Template | undefined => {
  // TODO_CONNECT: PUT/PATCH to backend
  const index = templates.findIndex(t => t.id === id);
  if (index > -1) {
    templates[index] = { ...templates[index], ...updates };
    persist('templates', templates);
    return templates[index];
  }
  return undefined;
};
export const deleteTemplate = (id: string): boolean => {
  // TODO_CONNECT: DELETE to backend
  const initialLength = templates.length;
  templates = templates.filter(t => t.id !== id);
  if (templates.length < initialLength) {
    persist('templates', templates);
    return true;
  }
  return false;
};


// Initialize store on script load
initializeStore();