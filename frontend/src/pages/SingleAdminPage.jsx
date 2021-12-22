import React from 'react';
import {
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from '@material-ui/core';
import { useParams } from 'react-router';
import { useTrans } from '../context/TransContext';
import '../components/assets/scss/AdminPortalPage.scss';
import { useAlert } from '../context/AlertContext';

const SingleAdminPage = () => {
  const {
    displayAdminOrderProducts,
    getOrderDetailsAdmin,
    setAdminStatus,
    editShippingStatusAdmin,
    user,
    date,
    address,
    city,
    pnumber,
    name,
    postcode,
    shipping,
    state,
    creditCard,
    cost,
    status,
  } = useTrans();
  const { order_number } = useParams();
  const { loading, DisplayLoadingScreen, setLoading } = useAlert();
  const [alignment, setAlignment] = React.useState('');

  const handleChange = (e, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editShippingStatusAdmin(order_number);
  };

  React.useEffect(() => {
    /*eslint-disable*/
    setLoading(true);
    getOrderDetailsAdmin(order_number);
  }, []);

  return (
    <div className="singleAdminContainer">
      <Typography
        variant="h5"
        style={{
          display: 'flex',
          fontWeight: 'bold',
          alignSelf: 'center',
          margin: '1rem',
        }}
      >
        Order Number: {order_number}
      </Typography>
      <Typography
        style={{
          display: 'flex',
          alignSelf: 'center',
          margin: '1rem',
        }}
      >
        Shipping status: <b>{status}</b>
      </Typography>

      <form className="adminOrderContainer" onSubmit={handleSubmit}>
        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleChange}
        >
          <ToggleButton
            className="pendingButton"
            sx={{
              backgroundColor: '#485B73',
              color: 'white',
              '&:hover': {
                backgroundColor: '#6792c7',
              },
            }}
            thumbswitchedstyle={{ backgroundColor: 'grey' }}
            labelstyle={{ color: 'white' }}
            value="pending"
            onClick={() => {
              setAdminStatus('pending');
            }}
          >
            Pending
          </ToggleButton>
          <ToggleButton
            sx={{
              backgroundColor: '#485B73',
              color: 'white',
              '&:hover': {
                backgroundColor: '#6792c7',
              },
            }}
            value="shipped"
            onClick={() => {
              setAdminStatus('shipped');
            }}
          >
            Shipped
          </ToggleButton>
          <ToggleButton
            sx={{
              backgroundColor: '#485B73',
              color: 'white',
              '&:hover': {
                backgroundColor: '#6792c7',
              },
            }}
            value="delivered"
            onClick={() => {
              setAdminStatus('delivered');
            }}
          >
            Delivered
          </ToggleButton>
          <ToggleButton
            sx={{
              backgroundColor: '#485B73',
              color: 'white',
              '&:hover': {
                backgroundColor: '#6792c7',
              },
            }}
            value="delayed"
            onClick={() => {
              setAdminStatus('delayed');
            }}
          >
            Delayed
          </ToggleButton>
        </ToggleButtonGroup>
        <Button
          type="submit"
          variant="contained"
          style={{
            marginLeft: '10px',
            borderRadius: '30px',
            padding: '11px 20px',
            backgroundColor: 'rgb(76, 180, 164)',
            '&:hover': {
              backgroundColor: '#49db60',
            },
          }}
        >
          Confirm
        </Button>
      </form>
      <div
        style={{
          margin: '0.5rem 0rem',
        }}
      >
        <Typography style={{ fontWeight: 'bold' }}>Ordered on: </Typography>
        <Typography>{date} </Typography>
      </div>
      <div
        style={{
          margin: '0.5rem 0rem',
        }}
      >
        <Typography style={{ fontWeight: 'bold' }}>
          Customer Details:
        </Typography>
        <Typography>{user}</Typography>
        <Typography>{name}</Typography>
        <Typography>{pnumber}</Typography>
        <Typography>
          Card ending in XXXX-XXXX-XXXX-{creditCard.substr(-4)}
        </Typography>
      </div>
      <div
        style={{
          margin: '0.5rem 0rem',
        }}
      >
        <Typography style={{ fontWeight: 'bold' }}>
          Shipping Address:{' '}
        </Typography>
        <Typography>
          {address}, {city} {state} {postcode}
        </Typography>
      </div>
      <Typography style={{ fontWeight: 'bold' }}>Items:</Typography>
      <div className="orderProductsContainer">
        {' '}
        {loading ? (
          <DisplayLoadingScreen />
        ) : (
          <>{displayAdminOrderProducts}</>
        )}{' '}
      </div>
      <Typography
        className="orderProductsContainer"
        style={{ fontWeight: 'bold' }}
      >
        Shipping: {shipping}
      </Typography>
      <Typography
        className="orderProductsContainer"
        style={{ fontWeight: 'bold' }}
      >
        Total cost: ${cost}
      </Typography>
    </div>
  );
};

export default SingleAdminPage;
