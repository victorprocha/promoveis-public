import React from 'react';

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-gray-600 mt-2">Esta funcionalidade será implementada em breve.</p>
    </div>
  );
};

export default PlaceholderPage;