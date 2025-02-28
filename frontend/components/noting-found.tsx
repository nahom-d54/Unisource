import React from 'react';
import { FaRegFrown } from 'react-icons/fa';

const NothingFound: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <FaRegFrown className="text-6xl mx-auto" />
                <h1 className="text-2xl font-bold mt-4">Nothing Found</h1>
                <p className="text-gray-600 mt-2">Sorry, we couldn't find what you were looking for.</p>
            </div>
        </div>
    );
};

export default NothingFound;
