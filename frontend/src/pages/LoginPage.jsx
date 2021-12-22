import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Button, Grid, TextField } from '@material-ui/core';
import { detailsApi, loginApi } from '../api/accountApi';
import { useAuth } from '../context/AuthContext';
import { useUser, useAdmin } from '../context/UserContext';
import { useAlert } from '../context/AlertContext';
import './LoginPage.css';
import { StyledLink } from '../components/NavBarElements';
import { useQuiz } from '../context/QuizContext';

/**
 * Authenticates a user given a username and password.
 */
const LoginPage = () => {
  const history = useHistory();
  const { setToken } = useAuth();
  const { setUser, setQuizComplete, setUserEmail } = useUser();
  const { setAdmin } = useAdmin();
  const { refreshQuiz } = useQuiz();
  const { handlePopupClick, loading, DisplayLoadingScreen, setLoading } =
    useAlert();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  /**
   * Submits login data collected from form.
   * @param {func} e
   */
  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginApi({ email, password });
      if (data) {
        const adminData = await detailsApi({ token: data });
        setToken(data);
        setUser(adminData.username);
        setUserEmail(adminData.email);
        setAdmin(adminData.is_admin.toString());
        sessionStorage.setItem('token', data);
        sessionStorage.setItem('user', adminData.username);
        sessionStorage.setItem('admin', adminData.is_admin);
        sessionStorage.setItem('email', adminData.email);

        if (adminData.quiz !== undefined) {
          if (Object.keys(adminData.quiz).length === 5) {
            setQuizComplete('true');
            sessionStorage.setItem('quiz', 'true');
          } else {
            setQuizComplete('false');
            sessionStorage.setItem('quiz', 'false');
          }
        } else {
          setQuizComplete('false');
          sessionStorage.setItem('quiz', 'false');
        }

        refreshQuiz();

        handlePopupClick(
          'Welcome back, ' + adminData.username,
          'success',
          'top',
          'center',
        );
        history.push('/');
      }
      setLoading(false);
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
      <form onSubmit={submitForm} id="formlogin">
        <h1>Login Page</h1>
        {loading ? (
          <DisplayLoadingScreen />
        ) : (
          <>
            <TextField
              sx={{
                width: 400,
                marginTop: '2rem',
              }}
              id="loginEmail"
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
              id="loginPassword"
              type="password"
              value={password}
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Grid
              container
              direction="row"
              display="flex"
              justifyContent="Center"
            >
              <Button
                variant="outlined"
                sx={{
                  width: 250,
                  marginTop: '2rem',
                  marginRight: '1rem',
                  borderRadius: '20px',
                }}
              >
                <Link to="/forgotpassword">I forgot my password</Link>
              </Button>
              <Button
                variant="contained"
                type="submit"
                value="Login"
                id="loginSubmit"
                sx={{
                  width: 100,
                  marginTop: '2rem',
                  borderRadius: '20px',
                }}
              >
                <b>Login</b>
              </Button>
            </Grid>
          </>
        )}
      </form>
    </section>
  );
};

export default LoginPage;
