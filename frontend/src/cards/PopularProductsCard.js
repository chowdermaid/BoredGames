import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, IconButton } from '@material-ui/core';
import { useAuth } from '../context/AuthContext';
import FavoriteIcon from '@mui/icons-material/Favorite';

const PopularProductsCard = ({
  imgurl,
  name,
  price,
  id,
  addToCollection,
  discount,
  hasDiscount,
}) => {
  const { token } = useAuth();

  return (
    <div className="popularProductCard">
      {token ? (
        <IconButton
          onClick={addToCollection}
          id="collectionButton"
          color="success"
          component="span"
          sx={{
            color: 'rgb(76, 180, 164)',
            '&:hover': {
              color: 'rgb(49, 120, 109)',
            },
          }}
        >
          <FavoriteIcon />
        </IconButton>
      ) : (
        <div />
      )}
      <Link to={`/shop/${id}`}>
        <img src={imgurl} id="popularProductImg" alt="popularProduct" />
      </Link>
      <Typography>{name}</Typography>
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
    </div>
  );
};

export default PopularProductsCard;
