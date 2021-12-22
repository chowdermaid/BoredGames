import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@material-ui/core';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledLink = styled(Link)`
  cursor: pointer;
  text-decoration: none;
  color: #000000;
`;

const MyCollectionProductCard = ({ imgurl, id, name, deleteProduct }) => {
  return (
    <Card className="productCard" sx={{ width: 200, height: 240 }}>
      <IconButton
        id="closebtn"
        sx={{ position: 'absolute' }}
        onClick={deleteProduct}
      >
        <CloseIcon />
      </IconButton>
      <StyledLink to={`/shop/${id}`}>
        <CardMedia
          id="productImg"
          alt="productImg"
          component="img"
          width="200"
          height="300"
          objectfit="contain"
          image={imgurl}
        />
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h5">{name}</Typography>
        </CardContent>
      </StyledLink>
    </Card>
  );
};

export default MyCollectionProductCard;
