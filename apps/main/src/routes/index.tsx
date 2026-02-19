import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import Quiz from '../pages/Quiz';
import Results from '../pages/Results';
import App from '../App';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'quiz/:id',
                element: <Quiz />,
            },
            {
                path: 'results',
                element: <Results />,
            },
        ],
    },
]);
