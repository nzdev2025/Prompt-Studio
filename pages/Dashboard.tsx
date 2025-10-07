import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, getPromptsByProjectId } from '../data/store';
import { useAppContext } from '../hooks/useAppContext';
import { ArrowRight, Plus } from 'lucide-react';
import type { Project } from '../types';
import type { TranslationKey } from '../lib/i18n';
import AnalyticsDashboard from '../components/dashboard/AnalyticsDashboard';

// Helper function to format time with i18n support
const formatTimeAgo = (date: string, t: (key: TranslationKey, params?: { [key: string]: string | number }) => string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 5) return t('time_ago_now');

    const intervals: { [key: string]: number } = {
        'years': 31536000,
        'months': 2592000,
        'days': 86400,
        'hours': 3600,
        'minutes': 60
    };

    for (const key in intervals) {
        const interval = seconds / intervals[key];
        if (interval > 1) {
            return t(`time_ago_${key}` as TranslationKey, { count: Math.floor(interval) });
        }
    }

    return t('time_ago_seconds', { count: Math.floor(seconds) });
};


const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const navigate = useNavigate();
  const { t } = useAppContext(); // Use context directly in the component
  const promptCount = getPromptsByProjectId(project.id).length;

  return (
    <div 
      onClick={() => navigate(`/projects/${project.id}`)}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-transparent hover:border-primary-500 dark:border-gray-700"
    >
      <h3 className="text-lg font-bold text-primary-600 dark:text-primary-400">{project.name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 mb-4 h-10 overflow-hidden">{project.description}</p>
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-500">
        <span>{promptCount} {t(promptCount === 1 ? 'prompt_singular' : 'prompt_plural')}</span>
        <span>{formatTimeAgo(project.updatedAt, t)}</span>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { t } = useAppContext();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Sort by most recently updated
    const sortedProjects = getProjects().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    setProjects(sortedProjects);
  }, []);


  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('dashboard')}</h1>
        <button className="flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          <Plus className="h-5 w-5 mr-2" />
          {t('new_project')}
        </button>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('recent_projects')}</h2>
          <a href="#" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center">
            {t('view_all')} <ArrowRight className="h-4 w-4 ml-1" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 3).map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
      
      {/* Analytics Section */}
      <div className="mt-8">
        <AnalyticsDashboard />
      </div>

    </div>
  );
};

export default Dashboard;