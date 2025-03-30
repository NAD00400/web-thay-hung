import React from 'react';

const FooterComponent: React.FC = () => {
    return (
        <footer className="bg-neutral-20000 text-neutral-900 py-6 text-center h-24">
          <p>&copy; {new Date().getFullYear()} My Website. All Rights Reserved.</p>
        </footer>
    );
};



export default FooterComponent;