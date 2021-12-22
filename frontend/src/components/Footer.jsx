import React from 'react';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';
import { Grid } from '@material-ui/core';
import logoWhite from '../components/assets/img/logo-white.png';
import { NavLink as Link } from 'react-router-dom';

const ImageContainer = styled.img`
  margin: auto;
  width: 50%;
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const Background = styled.div`
  margin-top: 10rem;
  height: 20rem;
  background-color: #485b73;
  bottom: 0;
  left: 0;
`;

export const FooterLink = styled(Link)`
  color: #ffffff;
  justify-content: left;
  text-decoration: none;
  padding: 1rem 0rem;
  cursor: pointer;
  &.active {
    color: #9ddfd5;
  }
  &:hover {
    transition: all 0.3s ease-in-out;
    text-decoration: overline;
    color: #9ddfd5;
  }
`;

function Footer() {
  return (
    <FlexContainer>
      <Background>
        <Grid container direction="row" spacing={2} mt={5}>
          <Grid item xs={12} sm={3} display="flex" justifyContent="center">
            <ImageContainer src={logoWhite} alt="logo" />
          </Grid>
          <Grid
            item
            xs={12}
            sm={2}
            display="flex"
            justifyContent="flex-start"
            flexDirection="column"
          >
            <Typography
              sx={{ fontWeight: 'bold', color: '#9DDFD5' }}
              variant="h4"
            >
              Shop
            </Typography>
            <Typography sx={{ color: '#FFFFFF' }} variant="p" mt={2}>
              <FooterLink to="/shop">Shop All</FooterLink>
            </Typography>
            <Typography sx={{ color: '#FFFFFF' }} variant="p" mt={2}>
              <FooterLink to="/cart">Go Cart</FooterLink>
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={2}
            display="flex"
            justifyContent="flex-start"
            flexDirection="column"
          >
            <Typography
              sx={{ fontWeight: 'bold', color: '#9DDFD5' }}
              variant="h4"
            >
              Support
            </Typography>
            <Typography sx={{ color: '#FFFFFF' }} variant="p" mt={2}>
              <FooterLink to="/faq">FAQs</FooterLink>
            </Typography>
            <Typography
              sx={{ fontWeight: 'bold', color: '#FFFFFF' }}
              variant="p"
              mt={2}
            >
              Delivery & Returns
            </Typography>
            <Typography sx={{ color: '#FFFFFF' }} variant="p">
              $10 - Express Shipping
            </Typography>
            <Typography sx={{ color: '#FFFFFF' }} variant="p">
              FREE - Default Shipping
            </Typography>
            <Typography sx={{ color: '#FFFFFF' }} variant="p" mt={2}>
              Created by group - notliketheothergroups
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={2}
            display="flex"
            justifyContent="flex-start"
            flexDirection="column"
          >
            <Typography
              sx={{ fontWeight: 'bold', color: '#9DDFD5' }}
              variant="h4"
            >
              Contact Us
            </Typography>
            <Typography sx={{ color: '#FFFFFF' }} variant="p" mt={2}>
              Email us at help@boredgames.com
            </Typography>
            <Typography sx={{ color: '#FFFFFF' }} variant="p" mt={2}>
              COMP3900 Capstone Project
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={2}
            display="flex"
            justifyContent="flex-start"
            flexDirection="column"
          >
            <Typography
              sx={{ fontWeight: 'bold', color: '#9DDFD5' }}
              variant="h4"
            >
              Test Accounts
            </Typography>
            <Typography sx={{ color: '#FFFFFF' }} variant="p" mt={2}>
              Admin: hello123@gmail.com Password: 1234567
            </Typography>
            <Typography sx={{ color: '#FFFFFF' }} variant="p" mt={2}>
              User: hello1234@gmail.com Password: 1234567
            </Typography>
          </Grid>
        </Grid>
      </Background>
    </FlexContainer>
  );
}

export default Footer;
