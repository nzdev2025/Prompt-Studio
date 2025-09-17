import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProject, getPromptsByProjectId } from '../data/store';
import type { Project, Prompt } from '../types';
import { useAppContext } from '../hooks/useAppContext';
import { FileText, ArrowLeft, Plus } from 'lucide-react';

const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 5) return "just now";
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useAppContext();
  const [project, setProject] = useState<Project | undefined>();
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    if (id) {
        const foundProject = getProject(id);
        if (foundProject) {
        setProject(foundProject);
        const projectPrompts = getPromptsByProjectId(id);
        setPrompts(projectPrompts);
        } else {
        navigate('/404');
        }
    }
  }, [id, navigate]);

  if (!project) {
    return <div>Loading...</div>; // Or a proper not found page
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/dashboard')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">{project.description}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('prompts')} ({prompts.length})</h2>
          <button className="flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            <Plus className="h-5 w-5 mr-2" />
            New Prompt
            </button>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {prompts.map(prompt => (
            <Link to={`/prompts/${prompt.id}`} key={prompt.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-4 text-primary-500" />
                <div>
                  <p className="font-semibold">{prompt.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">v{prompt.version}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{t('last_edited')}: {timeAgo(prompt.updatedAt)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
