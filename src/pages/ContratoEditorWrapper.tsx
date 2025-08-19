import React from 'react';
import { useNavigate } from 'react-router-dom';
import ContratoEditor from './ContratoEditor';

const ContratoEditorWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/configuracoes');
  };

  return <ContratoEditor onBack={handleBack} />;
};

export default ContratoEditorWrapper;