import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClientDetails from './ClientDetails';

const ClientDetailsWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/clientes');
  };

  if (!id) {
    navigate('/clientes');
    return null;
  }

  return <ClientDetails clientId={id} onBack={handleBack} />;
};

export default ClientDetailsWrapper;