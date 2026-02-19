import React from 'react';
import { useParams } from 'react-router-dom';

const Quiz: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">Quiz Session</h1>
            <p className="mt-4 text-gray-600">Currently taking quiz: {id}</p>
        </div>
    );
};

export default Quiz;
