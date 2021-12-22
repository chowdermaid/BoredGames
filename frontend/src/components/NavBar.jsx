import React from 'react';
import { Nav, NavLink, Bars, NavMenu, NavBarImage } from './NavBarElements';
import { useHistory } from 'react-router-dom';
import logo from './assets/img/boredgameslogo.png';
import shoppingicon from './assets/img/shopping-cart.svg';
import './assets/scss/NavBar.scss';
import { useAuth } from '../context/AuthContext';
import { useUser, useAdmin } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import { useAlert } from '../context/AlertContext';
import { useQuiz } from '../context/QuizContext';
import { logoutApi } from '../api/accountApi';
import { Menu, Button, Typography, IconButton } from '@mui/material';

const Navbar = () => {
  const history = useHistory();
  const { token, setToken } = useAuth();
  const { user, setUser, quizComplete } = useUser();
  const { displayCartPopupProducts, sum, getCartData, resetCartState } =
    useCart();
  const { admin, setAdmin } = useAdmin();
  const { handlePopupClick, loading2, DisplayLoadingScreen } = useAlert();
  const { handleOpen } = useQuiz();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  /**
   * Logs the user out
   */
  const logout = async (e) => {
    e.preventDefault();
    try {
      const data = await logoutApi({ token });
      if (data) {
        setToken(null);
        setUser(null);
        setAdmin(false);
        history.push('/');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('admin');
        sessionStorage.removeItem('quiz');
        resetCartState();
        handlePopupClick('Logged out successfully', 'success', 'top', 'center');
      }
    } catch (error) {
      handlePopupClick('Could not log out', 'error', 'top', 'center');
    }
  };

  /**
   * For cart popup
   */
  const handleClick = async (e) => {
    setAnchorEl(e.currentTarget);
    await getCartData();
  };

  const handleClose = async () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Nav>
        <Bars />
        <NavMenu>
          <NavLink to="/">
            <NavBarImage>
              <img src={logo} alt="logo" style={{ objectfit: 'contain' }} />
            </NavBarImage>
          </NavLink>
        </NavMenu>
        <NavMenu>
          {token ? (
            <Button
              style={{
                backgroundColor: '#9DDFD5',
                fontWeight: 'bold',
                visibility: quizComplete === 'false' ? 'visible' : 'hidden',
              }}
              variant="contained"
              onClick={() => handleOpen()}
            >
              Complete a short quiz!
            </Button>
          ) : (
            <div></div>
          )}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/sale">Sale</NavLink>
          {token ? (
            <NavLink to="/mycollection">My Collection</NavLink>
          ) : (
            <div />
          )}
          {admin === 'true' ? (
            <NavLink to="/adminportal">Admin Portal</NavLink>
          ) : (
            <div></div>
          )}
          {!token ? (
            <div style={{ display: 'flex' }}>
              <NavLink to="/register">Register</NavLink>
              <NavLink to="/login">Login</NavLink>
            </div>
          ) : (
            <div style={{ display: 'flex' }}>
              <NavLink to="/myaccount">My Account</NavLink>
              <NavLink to="/home" style={{ color: 'red' }}>
                <div onClick={logout}>Log Out</div>
              </NavLink>
            </div>
          )}
          <IconButton
            onClick={(e) => handleClick(e)}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <img className="icon" src={shoppingicon} alt="cart icon" />
          </IconButton>
          <Menu
            sx={{
              maxWidth: '100%',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            {token ? (
              <div
                className="cartMenu"
                style={{ padding: '1rem 0rem 1rem 1rem' }}
              >
                {loading2 ? (
                  <>
                    <DisplayLoadingScreen />
                    <Typography id="cartPopupTotalCost" fontWeight="bold">
                      Loading your cart (✿◠‿◠)
                    </Typography>
                  </>
                ) : (
                  <>
                    {' '}
                    {displayCartPopupProducts}
                    <Typography
                      id="cartPopupTotalCost"
                      fontWeight="bold"
                      textAlign="center"
                    >
                      Total Cost: ${sum.toFixed(2)}
                    </Typography>
                  </>
                )}

                <NavLink
                  to="/cart"
                  id="PopupButtonCart"
                  style={{ marginTop: '1rem' }}
                >
                  Go to Cart
                </NavLink>
              </div>
            ) : (
              <div>Please log in to see your cart</div>
            )}
          </Menu>
          {!token ? (
            <Typography mt={0.5} ml={2}>
              Not logged in
            </Typography>
          ) : (
            <Typography mt={0.5} ml={2}>
              Hello, {user}!
            </Typography>
          )}
        </NavMenu>
      </Nav>
    </>
  );
};

export default Navbar;
