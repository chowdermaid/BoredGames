import React, { useContext, useState } from 'react';

const UserContext = React.createContext({});
const AdminContext = React.createContext({});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(sessionStorage.getItem('user'));
  const [userEmail, setUserEmail] = useState(sessionStorage.getItem('email'));
  const [quizComplete, setQuizComplete] = useState(
    sessionStorage.getItem('quiz'),
  );
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        quizComplete,
        setQuizComplete,
        userEmail,
        setUserEmail,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(sessionStorage.getItem('admin'));
  return (
    <AdminContext.Provider value={{ admin, setAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
export const useAdmin = () => useContext(AdminContext);
