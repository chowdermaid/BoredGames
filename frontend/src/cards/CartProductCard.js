import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, IconButton, Typography } from '@material-ui/core';
import { editProductCartApi } from '../api/userApi';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import styled from 'styled-components';
import '../components/assets/scss/CartPage.scss';

const CartCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px 50px;
`;

const CartProductCard = ({
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
    <CartCard className="cartProductCard">
      <Grid container alignItems="center">
        <Grid item xs={3} display="flex" flexDirection="row" justifyContent="flex-end">
          <IconButton sx={{ margin: 'auto 0px' }} onClick={deleteFromCart}>
            <CloseIcon />
          </IconButton>
          <Link to={`/shop/${id}`}>
            <img src={imgurl} id="cartProductImg" alt="cartProductImage" />
          </Link>
        </Grid>
        <Grid item xs={3} display="flex">
          <h3 id="cartProductName">{name}</h3>
        </Grid>
        <Grid item xs={3} display="flex" justifyContent="center">
          <IconButton sx={{ margin: 'auto 0px' }} onClick={decrement}>
            <RemoveIcon />
          </IconButton>
          <h2>{quantity}</h2>
          <IconButton sx={{ margin: 'auto 0px' }} onClick={increment}>
            <AddIcon />
          </IconButton>
        </Grid>
        <Grid item xs={3} display="flex" justifyContent="center">
          {hasDiscount ? (
            <div>
              <Typography
                style={{ textDecoration: 'line-through' }}
                fontWeight="bold"
              >
                ${price}
              </Typography>
              <Typography
                variant="h5"
                style={{
                  color: '#4bbba9',
                }}
                fontWeight="bold"
              >
                ${discount.toFixed(2)}!
              </Typography>
            </div>
          ) : (
            <Typography variant="h5" fontWeight="bold">${price}</Typography>
          )}
        </Grid>
      </Grid>
    </CartCard>
  );
};

export default CartProductCard;
