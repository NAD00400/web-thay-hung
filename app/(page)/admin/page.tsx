import React from 'react';

const AdminPage: React.FC = () => {
    return (
        <div className="relative h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-900 to-blue-700 text-white overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
            <h1 className="text-4xl font-bold z-20 drop-shadow-lg">Welcome to the Admin Page</h1>
            <p className="text-lg mt-4 z-20 drop-shadow-md">This is the central hub for managing the application</p>
            <div className="absolute w-[200%] h-[200%] bg-radial-gradient from-white/10 to-transparent animate-spin-slow z-0"></div>
        </div>
    );
};

export default AdminPage;
