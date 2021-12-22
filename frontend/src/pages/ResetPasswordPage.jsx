import React from 'react';
import { Button, TextField } from '@material-ui/core';
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUser, useAdmin } from '../context/UserContext';
import { detailsApi, resetPasswordApi } from '../api/accountApi';
import './LoginPage.css';

const ResetPasswordPage = () => {
  const history = useHistory();
  const { setToken } = useAuth();
  const { setUser } = useUser();
  const { setAdmin } = useAdmin();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm_password, setConfirm_password] = React.useState('');

  /**
   * Submits data collected from form.
   * @param {func} e
   */
  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const data = await resetPasswordApi({
        email,
        password,
        confirm_password,
      });
      if (data) {
        const adminData = await detailsApi({ token: data });
        setToken(data);
        setUser(adminData.username);
        setAdmin(adminData.is_admin);
        history.push('/');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <form onSubmit={submitForm} id="formlogin">
      <Button id="loginSubmit">
        <Link to="/login">Back</Link>
      </Button>
      <TextField
        id="loginEmailRP"
        type="text"
        value={email}
        label="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        id="registerPasswordRP"
        type="password"
        value={password}
        label="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        id="registerCpasswordRP"
        type="password"
        value={confirm_password}
        label="Confirm Password"
        onChange={(e) => setConfirm_password(e.target.value)}
      />
      <Button type="submit" id="loginSubmit">
        Reset Password
      </Button>
    </form>
  );
};

export default ResetPasswordPage;
