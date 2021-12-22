import React from 'react';
import { useAlert } from '../context/AlertContext';

const Popup = () => {
  const { DisplayPopup } = useAlert();

  return <DisplayPopup />;
};

export default Popup;
