import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { useUser, useAdmin } from '../context/UserContext';
import { detailsApi, registerApi } from '../api/accountApi';
import './RegisterPage.css';
import { StyledLink } from '../components/NavBarElements';
import { useQuiz } from '../context/QuizContext';

/**
 * Registers an account given username, password and name.
 */
const RegisterPage = () => {
  const history = useHistory();
  const { setToken } = useAuth();
  const { setUser, setQuizComplete, setUserEmail } = useUser();
  const { setAdmin } = useAdmin();
  const { handleOpen, refreshQuiz } = useQuiz();
  const { handlePopupClick, loading, DisplayLoadingScreen, setLoading } =
    useAlert();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm_password, setConfirm_password] = React.useState('');
  const [username, setUsername] = React.useState('');

  /**
   * Submits data collected from form.
   * @param {func} e
   */
  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await registerApi({
        username,
        email,
        password,
        confirm_password,
      });
      if (data) {
        const adminData = await detailsApi({ token: data });
        setToken(data);
        setUser(adminData.username);
        setUserEmail(adminData.email);
        setAdmin(adminData.is_admin.toString());
        setQuizComplete('false');
        sessionStorage.setItem('token', data);
        sessionStorage.setItem('admin', adminData.is_admin);
        sessionStorage.setItem('user', adminData.username);
        sessionStorage.setItem('email', adminData.email);
        sessionStorage.setItem('quiz', 'false');
        handlePopupClick(
          'Welcome Abored, ' + adminData.username + '!',
          'success',
          'top',
          'center',
        );
        history.push('/');
        refreshQuiz();
        handleOpen();
        setLoading(false);
      }
    } catch (error) {
      handlePopupClick(error.message.toString(), 'error', 'top', 'center');
      setLoading(false);
    }
  };

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'Column',
        justifyContent: 'flexStart',
        alignContent: 'flexStart',
        maxWidth: '60%',
        marginTop: '4rem',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <StyledLink to="/">Go Back</StyledLink>
      <form onSubmit={submitForm} id="formregister">
        <h1>Register</h1>
        {loading ? (
          <DisplayLoadingScreen />
        ) : (
          <>
            {' '}
            <TextField
              sx={{
                width: 400,
                marginTop: '2rem',
              }}
              id="registerName"
              type="text"
              value={username}
              label="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              sx={{
                width: 400,
                marginTop: '2rem',
              }}
              id="registerEmail"
              type="text"
              value={email}
              label="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              sx={{
                width: 400,
                marginTop: '2rem',
              }}
              id="registerPassword"
              type="password"
              value={password}
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              sx={{
                width: 400,
                marginTop: '2rem',
              }}
              id="registerCpassword"
              type="password"
              value={confirm_password}
              label="Confirm Password"
              onChange={(e) => setConfirm_password(e.target.value)}
            />
            <Button
              variant="contained"
              type="submit"
              value="Register"
              sx={{
                width: 200,
                marginTop: '2rem',
                borderRadius: '20px',
              }}
            >
              <b>Register</b>
            </Button>{' '}
          </>
        )}
      </form>
    </section>
  );
};

export default RegisterPage;
