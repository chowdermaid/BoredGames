import React, { useContext } from 'react';
import { Snackbar, Alert } from '@material-ui/core';
import '../components/assets/scss/LoadingIcon.scss';

const AlertContext = React.createContext(undefined);

export const AlertProvider = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const [vertical, setVertical] = React.useState('top');
  const [horizontal, setHorizontal] = React.useState('center');
  const [severity, setSeverity] = React.useState();
  const [popupMsg, setPopupMsg] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [loading2, setLoading2] = React.useState(false);

  const handlePopupClick = (msg, severity, vertical, horizontal) => {
    setOpen(true);
    setPopupMsg(msg);
    setSeverity(severity);
    setVertical(vertical);
    setHorizontal(horizontal);
  };

  const handlePopupClose = () => {
    setOpen(false);
  };

  /*eslint-disable*/
  const DisplayPopup = () => (
    <Snackbar
      style={{ height: '11rem' }}
      anchorOrigin={{ vertical, horizontal }}
      autoHideDuration={3000}
      open={open}
      onClose={handlePopupClose}
      key={vertical + horizontal}
    >
      <Alert variant="filled" severity={severity} sx={{ width: '100%' }}>
        {popupMsg}
      </Alert>
    </Snackbar>
  );

  const DisplayLoadingScreen = () => (
    <div className="sk-cube-grid">
      <div className="sk-cube sk-cube1"></div>
      <div className="sk-cube sk-cube2"></div>
      <div className="sk-cube sk-cube3"></div>
      <div className="sk-cube sk-cube4"></div>
      <div className="sk-cube sk-cube5"></div>
      <div className="sk-cube sk-cube6"></div>
      <div className="sk-cube sk-cube7"></div>
      <div className="sk-cube sk-cube8"></div>
      <div className="sk-cube sk-cube9"></div>
    </div>
  );

  const DisplayLoadingScreen2 = () => (
    <div className="sk-cube-grid">
      <div className="sk-cube sk-cube1"></div>
      <div className="sk-cube sk-cube2"></div>
      <div className="sk-cube sk-cube3"></div>
      <div className="sk-cube sk-cube4"></div>
      <div className="sk-cube sk-cube5"></div>
      <div className="sk-cube sk-cube6"></div>
      <div className="sk-cube sk-cube7"></div>
      <div className="sk-cube sk-cube8"></div>
      <div className="sk-cube sk-cube9"></div>
    </div>
  );

  return (
    <AlertContext.Provider
      value={{
        DisplayPopup,
        handlePopupClick,
        handlePopupClose,
        vertical,
        horizontal,
        open,
        setHorizontal,
        setVertical,
        setPopupMsg,
        setSeverity,
        setOpen,
        DisplayLoadingScreen,
        loading,
        setLoading,
        DisplayLoadingScreen2,
        loading2,
        setLoading2,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
