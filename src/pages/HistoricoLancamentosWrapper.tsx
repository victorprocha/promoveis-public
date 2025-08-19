import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HistoricoLancamentos from './HistoricoLancamentos';

const HistoricoLancamentosWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/estoque');
  };

  if (!id) {
    navigate('/estoque');
    return null;
  }

  return <HistoricoLancamentos onBack={handleBack} />;
};

export default HistoricoLancamentosWrapper;