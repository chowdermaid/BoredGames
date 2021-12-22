import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { useAuth } from '../context/AuthContext';
import '../components/assets/scss/ShopPage.scss';

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

const ShopProductCard = ({
  imgurl,
  name,
  price,
  id,
  instock,
  addToCollection,
  discount,
  hasDiscount,
}) => {
  const { token } = useAuth();
  return (
    <div id="shopProductCard">
      <Card
        id={id}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: 200,
          height: 335,
        }}
      >
        {token ? (
          <IconButton
            onClick={addToCollection}
            id="collectionButton"
            color="success"
            component="span"
            style={{ zIndex: 100 }}
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

        <StyledLink to={`/shop/${id}`}>
          {instock ? (
            <CardMedia
              component="img"
              width="200"
              height="200"
              objectfit="cover"
              image={imgurl}
            />
          ) : (
            <CardMedia
              component="img"
              width="200"
              height="200"
              objectfit="cover"
              className="soldout"
              image={imgurl}
            />
          )}
        </StyledLink>
        <CardContent>
          {instock ? (
            <Typography
              sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}
            >
              <ShoppingCartIcon /> {instock}
            </Typography>
          ) : (
            <Typography
              sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}
            >
              <RemoveShoppingCartIcon /> Sold Out
            </Typography>
          )}
          <Typography style={{ margin: '0.1rem' }}>{name}</Typography>
          {hasDiscount ? (
            <>
              <Typography
                style={{
                  textDecoration: 'line-through',
                }}
                fontWeight="bold"
              >
                ${price}
              </Typography>
              <Typography
                fontWeight="bold"
                style={{
                  color: '#4bbba9',
                }}
              >
                Now ${discount.toFixed(2)}!
              </Typography>
            </>
          ) : (
            <Typography fontWeight="bold">${price}</Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShopProductCard;
