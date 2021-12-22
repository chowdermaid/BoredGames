import React from 'react';
import { useCart } from '../context/CartContext';
import {
  Button,
  TextField,
  Typography,
  RadioGroup,
  FormControl,
  Radio,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import { useAlert } from '../context/AlertContext';
import { useUser } from '../context/UserContext';

const CartCheckout = () => {
  const {
    displayCheckoutProducts,
    shippingFee,
    setShippingFee,
    sum,
    setSum,
    checked,
    name,
    email,
    phone,
    address,
    city,
    state,
    postcode,
    coupon,
    setCoupon,
    cardNumber,
    setMethod,
    formFilled,
    applyCoupon,
    confirmTransaction,
    discountString,
    handleAddToCollectionBox,
    friendName,
    getCartData,
  } = useCart();
  const { loading, loading2, DisplayLoadingScreen, setLoading, setLoading2 } =
    useAlert();
  const { userEmail } = useUser();

  const handleShipping = (shippingMethod) => {
    if (shippingMethod === 'Free') {
      setSum(sum - 10);
      setShippingFee(false);
    } else {
      setSum(sum + 10);
      setShippingFee(true);
    }
    setMethod(shippingMethod);
  };

  React.useEffect(() => {
    /* eslint-disable */
    setLoading(false);
    setLoading2(true);
    getCartData();
  }, []);

  if (formFilled) {
    return (
      <div className="checkoutContainer">
        <div className="checkoutDisplay">
          <h4>Your items</h4>
          <div className="checkoutProducts">
            {loading2 ? (
              <DisplayLoadingScreen />
            ) : (
              <> {displayCheckoutProducts}</>
            )}
          </div>
          <Typography>Shipping Fee: {!shippingFee ? 'Free' : '$10'}</Typography>
          <Typography>{discountString}</Typography>
          <Typography fontWeight="bold">
            Total cost: ${sum.toFixed(2)}
          </Typography>
        </div>
        <div className="checkoutPay">
          <h4>Shipping details</h4>
          {checked ? (
            <>
              <Typography>{friendName}</Typography>
              <Typography>{email}</Typography>
            </>
          ) : (
            <>
              <Typography>{name}</Typography>
              <Typography>{userEmail}</Typography>
            </>
          )}
          <Typography>{phone}</Typography>
          <Typography>
            {address}, {city}, {state} {postcode}
          </Typography>
          <h4>Payment details</h4>
          <Typography>
            Card ending in XXXX-XXXX-XXXX-{cardNumber.substr(-4)}
          </Typography>

          <h4>Have a coupon?</h4>
          <TextField
            sx={{
              margin: '1rem 0rem',
            }}
            id="couponField"
            type="text"
            value={coupon}
            label="Coupon Code"
            onChange={(e) => setCoupon(e.target.value)}
          />
          <Button
            sx={{ margin: '1rem auto', width: '200px', borderRadius: '20px' }}
            onClick={() => applyCoupon()}
            variant="outlined"
          >
            Apply Coupon
          </Button>
          <FormControl>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Add to my collection"
              onChange={(e) => {
                handleAddToCollectionBox(e);
              }}
            />
          </FormControl>
          <h4>Shipping Method</h4>
          <FormControl>
            <RadioGroup defaultValue="Free">
              <FormControlLabel
                value="Free"
                control={<Radio />}
                label="Free: 7-14 working days"
                onChange={(e) => {
                  handleShipping(e.target.value);
                }}
              />
              <FormControlLabel
                value="NotFree"
                control={<Radio />}
                label="Express: 3 working days (Extra fees apply)"
                onChange={(e) => {
                  handleShipping(e.target.value);
                }}
              />
            </RadioGroup>
          </FormControl>
          {loading ? (
            <DisplayLoadingScreen />
          ) : (
            <>
              {' '}
              <Button
                sx={{
                  width: '200px',
                  margin: '1rem auto',
                  borderRadius: '25px',
                }}
                onClick={() => confirmTransaction()}
                variant="outlined"
                color="error"
              >
                Confirm & Pay
              </Button>{' '}
            </>
          )}
        </div>
      </div>
    );
  } else {
    return <div>Please complete your form first!</div>;
  }
};

export default CartCheckout;
