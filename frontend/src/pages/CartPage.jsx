import React from 'react';
import { useCart } from '../context/CartContext';
import CartReview from '../components/CartReview';
import CartForm from '../components/CartForm';
import CartCheckout from '../components/CartCheckout';
import { Typography } from '@material-ui/core';
import '../components/assets/scss/CartPage.scss';
import {
  CartOutline,
  CardOutline,
  ReaderOutline,
  ArrowForwardOutline,
} from 'react-ionicons';

const CartPage = () => {
  const {
    getCartData,
    formColor,
    checkoutColor,
    view,
    setView,
    reviewStyle,
    formStyle,
    checkoutStyle,
  } = useCart();

  /**
   * Cart view
   */
  const cartView = (view) => {
    if (view === 'review') {
      return <CartReview />;
    } else if (view === 'details') {
      return <CartForm />;
    } else if (view === 'confirm') {
      return <CartCheckout />;
    }
  };

  React.useEffect(() => {
    /*eslint-disable*/
    getCartData();
  }, []);

  return (
    <div className="cartMainContainer">
      <h1>Cart</h1>
      <Typography sx={{ marginBottom: '10px' }}>
        Disclaimer: This is for demonstration purposes only, do not enter your
        real details.
      </Typography>
      <div className="cartNavigation">
        <div className="cartReview">
          <CartOutline
            color={'#00000'}
            height="4rem"
            width="4rem"
            onClick={() => {
              setView('review');
              reviewStyle();
            }}
          />
          <Typography color="#00000" fontWeight="bold">
            Review
          </Typography>
        </div>
        <ArrowForwardOutline
          id="arrowCart"
          color={formColor}
          height="4rem"
          width="10rem"
        />
        <div className="cartForm">
          <ReaderOutline
            color={formColor}
            height="4rem"
            width="4rem"
            onClick={() => {
              setView('details');
              formStyle();
            }}
          />
          <Typography color={formColor} fontWeight="bold">
            Your Details
          </Typography>
        </div>
        <ArrowForwardOutline
          id="arrowCart"
          color={checkoutColor}
          height="4rem"
          width="10rem"
        />
        <div className="cartCheckout">
          <CardOutline
            color={checkoutColor}
            height="4rem"
            width="4rem"
            onClick={() => {
              setView('confirm');
              checkoutStyle();
            }}
          />
          <Typography color={checkoutColor} fontWeight="bold">
            Checkout
          </Typography>
        </div>
      </div>
      <div>{cartView(view)}</div>
    </div>
  );
};

export default CartPage;
