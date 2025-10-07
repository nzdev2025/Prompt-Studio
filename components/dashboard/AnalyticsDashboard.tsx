import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../../hooks/useAppContext';
import { getPrompts, getProjects, getTemplates } from '../../data/store';
import type { TranslationKey } from '../../lib/i18n';

const AnalyticsDashboard: React.FC = () => {
  const { t } = useAppContext();

  const prompts = useMemo(() => getPrompts(), []);
  const projects = useMemo(() => getProjects(), []);
  const templates = useMemo(() => getTemplates(), []);

  // Process data for Prompt Activity Chart
  const activityData = useMemo(() => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - i);
      return d;
    }).reverse();

    const dayLabels: { [key: number]: TranslationKey } = { 0: 'day_sun', 1: 'day_mon', 2: 'day_tue', 3: 'day_wed', 4: 'day_thu', 5: 'day_fri', 6: 'day_sat' };

    return last7Days.map(day => {
      const dayStart = new Date(day.setHours(0, 0, 0, 0));
      const dayEnd = new Date(day.setHours(23, 59, 59, 999));

      const count = prompts.filter(p => {
        const updatedAt = new Date(p.updatedAt);
        return updatedAt >= dayStart && updatedAt <= dayEnd;
      }).length;

      return {
        name: t(dayLabels[dayStart.getDay()]),
        prompts: count,
      };
    });
  }, [prompts, t]);

  const statCards = [
    { title: t('total_projects'), value: projects.length },
    { title: t('total_prompts'), value: prompts.length },
    { title: t('total_templates'), value: templates.length },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Stat Cards */}
      {statCards.map((card, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{card.title}</h3>
          <p className="text-3xl font-bold mt-1">{card.value}</p>
        </div>
      ))}

      {/* Activity Chart */}
      <div className="md:col-span-2 lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">{t('prompt_activity_7_days')}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.3)" />
            <XAxis dataKey="name" tick={{ fill: 'currentColor' }} />
            <YAxis tick={{ fill: 'currentColor' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderColor: 'rgba(156, 163, 175, 0.5)',
                color: '#ffffff',
              }}
            />
            <Legend />
            <Bar dataKey="prompts" name={t('prompts_axis_label')} fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;