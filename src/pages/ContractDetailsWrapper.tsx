import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContractDetails from './ContractDetails';

const ContractDetailsWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/contratos');
  };

  if (!id) {
    navigate('/contratos');
    return null;
  }

  return <ContractDetails contractId={id} onBack={handleBack} />;
};

export default ContractDetailsWrapper;