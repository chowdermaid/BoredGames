import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import '../components/assets/scss/SingleOrderPage.scss';

const UserOrderCard = ({
  imgurl,
  name,
  quantity,
  price,
  discount,
  hasDiscount,
}) => {
  return (
    <Grid container className="orderProductCard" width="80%" margin="auto">
      <Grid item xs={4}>
        <Grid container>
        <img src={imgurl} id="orderProductImg" alt="orderProductImage" />
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <Typography>{name}</Typography>
      </Grid>
      <Grid item xs={1}>
        <Typography style={{ fontWeight: 'bold' }}>x{quantity}</Typography>
      </Grid>
      <Grid item xs={2}>
        {hasDiscount ? (
          <div>
            <Typography
              style={{ textDecoration: 'line-through' }}
              fontWeight="bold"
            >
              ${price}
            </Typography>
            <Typography
              style={{
                color: '#4bbba9',
              }}
              fontWeight="bold"
            >
              Now ${discount.toFixed(2)}!
            </Typography>
          </div>
        ) : (
          <Typography fontWeight="bold">${price}</Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default UserOrderCard;
