
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
    const { t } = useAppContext();
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-9xl font-extrabold text-primary-600">404</h1>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-4">{t('page_not_found')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Sorry, we couldn’t find the page you’re looking for.</p>
            <Link to="/dashboard" className="mt-8 inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                <Home className="h-5 w-5 mr-2" />
                {t('go_home')}
            </Link>
        </div>
    );
};

export default NotFound;
