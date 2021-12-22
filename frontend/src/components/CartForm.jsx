import React from 'react';
import { useCart } from '../context/CartContext';
import {
  Grid,
  Button,
  FormControl,
  FormControlLabel,
  Checkbox,
  TextField,
  Typography,
} from '@material-ui/core';

const CartForm = () => {
  const {
    checked,
    setChecked,
    email,
    setEmail,
    name,
    setName,
    address,
    setAddress,
    postcode,
    setPostcode,
    city,
    setCity,
    state,
    setState,
    phone,
    setPhone,
    cardName,
    setCardName,
    cardNumber,
    setCardNumber,
    cardExpiry,
    setCardExpiry,
    cardCvc,
    setCardCvc,
    setFormFilled,
    setView,
    checkoutStyle,
    message,
    setMessage,
    friendName,
    setFriendName,
  } = useCart();
  const formRef = React.useRef();
  return (
    <div className="customerDetailsDiv">
      <form id="formCart" autoComplete="off" ref={formRef}>
        <div className="customerShipping">
          <FormControlLabel
            label={<b>Is this a gift?</b>}
            labelPlacement="start"
            control={
              <Checkbox
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
            }
          />
          {checked ? (
            <>
              <FormControl>
                <TextField
                  sx={{
                    width: 400,
                    marginLeft: '1rem',
                  }}
                  id="detailsEmail"
                  type="text"
                  value={email}
                  required
                  label="Your friend's email"
                  onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                  sx={{
                    width: 400,
                    margin: '1rem',
                  }}
                  id="giftMessage"
                  type="text"
                  value={message}
                  label="Your Message"
                  multiline
                  rows={3}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </FormControl>
            </>
          ) : (
            <> </>
          )}
          <Typography fontWeight="bold" style={{ marginBottom: '1rem' }}>
            {' '}
            Shipping Details{' '}
          </Typography>
          <Grid container>
            {checked ? (
              <TextField
                sx={{ marginBottom: '1rem' }}
                id="detailsName"
                type="text"
                value={friendName}
                required
                label="Your friend's name"
                onChange={(e) => setFriendName(e.target.value)}
              />
            ) : (
              <TextField
                sx={{ marginBottom: '1rem' }}
                id="detailsName"
                type="text"
                value={name}
                required
                label="Name"
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <TextField
              sx={{
                width: 400,
                marginLeft: '1rem',
              }}
              id="detailsPhone"
              type="text"
              value={phone}
              required
              label="Contact Number"
              onChange={(e) => setPhone(e.target.value)}
            />
          </Grid>
          <Grid>
            <TextField
              sx={{
                width: 500,
                marginRight: '1rem',
              }}
              id="detailsAddress"
              type="text"
              value={address}
              required
              label="Address"
              onChange={(e) => setAddress(e.target.value)}
            />
            <TextField
              sx={{
                width: 120,
                marginBottom: '1rem',
              }}
              id="detailsPostcode"
              type="text"
              value={postcode}
              required
              label="Postcode"
              onChange={(e) => setPostcode(e.target.value)}
            />
          </Grid>
          <Grid>
            <TextField
              sx={{
                width: 320,
              }}
              id="detailsCity"
              type="text"
              value={city}
              required
              label="City"
              onChange={(e) => setCity(e.target.value)}
            />
            <TextField
              sx={{
                width: 300,
                marginLeft: '1rem',
              }}
              id="detailsState"
              type="text"
              value={state}
              required
              label="State"
              onChange={(e) => setState(e.target.value)}
            />
          </Grid>
        </div>
        <div className="customerCard">
          <Typography fontWeight="bold"> Credit Card Details </Typography>
          <TextField
            sx={{
              marginTop: '1rem',
              width: '440px',
            }}
            id="detailsCCName"
            type="text"
            value={cardName}
            required
            label="Name on Card"
            onChange={(e) => setCardName(e.target.value)}
          />
          <TextField
            sx={{
              width: 440,
              marginTop: '1rem',
            }}
            id="detailsCCNumber"
            type="text"
            value={cardNumber}
            required
            label="Card Number (16-digit)"
            inputProps={{
              pattern:
                '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]',
            }}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <Grid container>
            <TextField
              sx={{
                width: 220,
                marginTop: '1rem',
              }}
              id="detailsCCExpiry"
              type="text"
              value={cardExpiry}
              required
              label="Card Expiry Date (MM/YYYY)"
              inputProps={{ pattern: '(0[1-9]|10|11|12)/20[0-9]{2}$' }}
              onChange={(e) => setCardExpiry(e.target.value)}
            />
            <TextField
              sx={{
                width: 205,
                marginTop: '1rem',
                marginLeft: '1rem',
              }}
              id="detailsCCCvc"
              type="text"
              value={cardCvc}
              required
              label="CVC Number (3-digit)"
              inputProps={{ pattern: '[0-9][0-9][0-9]' }}
              onChange={(e) => setCardCvc(e.target.value)}
            />
          </Grid>
        </div>
      </form>
      <Button
        onClick={() => {
          if (formRef.current.reportValidity()) {
            setFormFilled(true);
            setView('confirm');
            checkoutStyle();
          }
        }}
        type="submit"
        variant="outlined"
      >
        Submit
      </Button>
    </div>
  );
};

export default CartForm;
