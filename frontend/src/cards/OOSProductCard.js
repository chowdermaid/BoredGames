import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import '../components/assets/scss/ShopPage.scss';

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

const OOSProductCard = ({ imgurl, name, price, id, discount, hasDiscount }) => {
  return (
    <div id="shopProductCard">
      <Card id={id} sx={{ width: 200, height: 335 }}>
        <StyledLink to={`/shop/${id}`}>
          <CardMedia
            component="img"
            width="200"
            height="200"
            objectfit="cover"
            image={imgurl}
            alt="OOSproduct"
          />
          <CardContent>
            {name}
            {hasDiscount ? (
              <div>
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
              </div>
            ) : (
              <Typography fontWeight="bold">${price}</Typography>
            )}
          </CardContent>
        </StyledLink>
      </Card>
    </div>
  );
};

export default OOSProductCard;
