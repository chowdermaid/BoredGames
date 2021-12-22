import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, IconButton, Typography } from '@material-ui/core';
import { editProductCartApi } from '../api/userApi';
import CloseIcon from '@mui/icons-material/Close';
import '../components/assets/scss/CartPage.scss';

const CartProductPopupCard = ({
  imgurl,
  id,
  name,
  quantity_in_cart,
  deleteFromCart,
  handle,
  token,
  price,
  discount,
  hasDiscount,
}) => {
  const [quantity, setQuantity] = React.useState('');

  /**
   * Decrement count
   */
  const decrement = async () => {
    setQuantity((prevCount) => prevCount - 1);
    await editProductCartApi({ quantity: quantity - 1, handle, token });
  };

  /**
   * Increment count
   */
  const increment = async () => {
    setQuantity((prevCount) => prevCount + 1);
    await editProductCartApi({ quantity: quantity + 1, handle, token });
  };

  /**
   * Load on visit
   */
  React.useEffect(() => {
    setQuantity(quantity_in_cart);
  }, [quantity_in_cart]);

  return (
    <div className="cartProductPopupCard">
      <Grid container spacing={2} alignItems="center" style={{ marginBottom: '1rem' }}>
        <Grid item xs={3} display="flex" flexDirection="row" justifyContent="flex-start">
          <IconButton sx={{ margin: 'auto 0px' }}><CloseIcon onClick={deleteFromCart} /></IconButton>
          <Link to={`/shop/${id}`}>
          <img src={imgurl} id="cartProductPopupImg" alt="cartProductImage" />
          </Link>
        </Grid>
        <Grid item xs={3}>
          <Typography sx={{marginLeft: 2}} id="cartProductPopupName">{name}</Typography>
        </Grid>
        <Grid item xs={2}>
        <div className="cartPopupQuantity">
          <IconButton sx={{ margin: 'auto 0px' }} onClick={() => decrement()}>-</IconButton>
          <p>{quantity}</p>
          <IconButton sx={{ margin: 'auto 0px' }} onClick={() => increment()}>+</IconButton>
        </div>
        </Grid>
        <Grid item xs={2} sx={{marginLeft: 2}}>
        {hasDiscount ? (
        <div style={{ display: 'flex', gap: '0.3rem' }}>
          <Typography
            style={{
              color: '#4bbba9',
            }}
            fontWeight="bold"
          >
            ${discount.toFixed(2)}*
          </Typography>
        </div>
      ) : (
        <Typography fontWeight="bold">${price}</Typography>
      )}
        </Grid>
      </Grid>

    </div>
  );
};

export default CartProductPopupCard;
