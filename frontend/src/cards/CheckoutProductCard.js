import React from 'react';
import { Typography } from '@material-ui/core';

const CheckoutProductCard = ({
  name,
  price,
  quantity,
  discount,
  hasDiscount,
}) => {
  return (
    <div className="CheckoutProductCard">
      <div
        id="shopProductName"
        style={{ display: 'flex', gap: '0.4rem', margin: '1rem' }}
      >
        <Typography>x{quantity}</Typography>
        <Typography>{name}</Typography>
        {hasDiscount ? (
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <Typography
              style={{ textDecoration: 'line-through' }}
              fontWeight="bold"
            >
              ${price}
            </Typography>
            <Typography fontWeight="bold">${discount.toFixed(2)}</Typography>
          </div>
        ) : (
          <Typography fontWeight="bold">${price}</Typography>
        )}
      </div>
    </div>
  );
};

export default CheckoutProductCard;
