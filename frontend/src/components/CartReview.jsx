import React from 'react';
import { useCart } from '../context/CartContext';
import { Button, Typography } from '@material-ui/core';
import { useAlert } from '../context/AlertContext';

const CartReview = () => {
  const { displayCartProducts, sum, setView, formStyle, getCartData } =
    useCart();
  const { loading2, DisplayLoadingScreen, setLoading2 } = useAlert();

  const handleClick = () => {
    setView('details');
    formStyle();
  };

  React.useEffect(() => {
    /* eslint-disable */
    setLoading2(true);
    getCartData();
  }, []);

  return (
    <div className="cartContainer">
      {loading2 ? <DisplayLoadingScreen /> : <>{displayCartProducts} </>}

      <p
        style={{
          textAlign: 'right',
        }}
      >
        __________________________________________________________________________________________________________________________
      </p>
      <h2
        style={{
          textAlign: 'right',
        }}
      >
        <Typography fontWeight="bold">Total cost: ${sum.toFixed(2)}</Typography>
      </h2>
      <Button
        onClick={() => {
          handleClick();
        }}
        variant="outlined"
      >
        Proceed to Enter Details
      </Button>
    </div>
  );
};

export default CartReview;
