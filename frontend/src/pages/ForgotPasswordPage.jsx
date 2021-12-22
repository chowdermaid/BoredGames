import React from 'react';
import { Button, TextField } from '@material-ui/core';
import { forgotPasswordApi } from '../api/accountApi';
import { useAlert } from '../context/AlertContext';
import './LoginPage.css';
import { StyledLink } from '../components/NavBarElements';

const ForgotPasswordPage = () => {
  const { handlePopupClick } = useAlert();
  const [email, setEmail] = React.useState('');

  /**
   * Submits data collected from form.
   * @param {func} e
   */
  const submitForm = async (e) => {
    e.preventDefault();
    try {
      await forgotPasswordApi({
        email: email,
      });
      handlePopupClick(
        'An reset link was sent to your email',
        'success',
        'top',
        'center',
      );
    } catch (error) {
      handlePopupClick(error.message.toString(), 'error', 'top', 'center');
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
      <StyledLink to="/login">Go Back</StyledLink>
      <form onSubmit={submitForm} id="formlogin">
        <h1>Reset your password</h1>
        <TextField
          id="loginEmail"
          type="text"
          value={email}
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            width: 200,
            marginTop: '2rem',
            borderRadius: '20px',
          }}
        >
          Send Email
        </Button>
      </form>
    </section>
  );
};

export default ForgotPasswordPage;
