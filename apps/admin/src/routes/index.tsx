import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import ManageQuizzes from '../pages/ManageQuizzes';
import Analytics from '../pages/Analytics';
import App from '../App';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: 'manage-quizzes',
                element: <ManageQuizzes />,
            },
            {
                path: 'analytics',
                element: <Analytics />,
            },
        ],
    },
]);
