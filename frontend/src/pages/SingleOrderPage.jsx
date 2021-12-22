import React from 'react';
import { Typography } from '@material-ui/core';
import { useParams } from 'react-router';
import { useTrans } from '../context/TransContext';
import '../components/assets/scss/SingleOrderPage.scss';
import { useAlert } from '../context/AlertContext';

const SingleOrderPage = () => {
  const {
    displayOrderProducts,
    getOrderDetails,
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

  React.useEffect(() => {
    /*eslint-disable*/
    setLoading(true);
    getOrderDetails(order_number);
  }, []);

  return (
    <div>
      <div className="singleOrderContainer">
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
          <Typography>{name}</Typography>
          <Typography>{pnumber}</Typography>
          <Typography>
            Card ending in XXXX-XXXX-XXXX-{creditCard.substr(-4)}
          </Typography>
        </div>
        <div
          style={{
            margin: '1rem 0rem',
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
            <>{displayOrderProducts}</>
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
          variant="h6"
        >
          Total cost: ${cost}
        </Typography>
      </div>
    </div>
  );
};

export default SingleOrderPage;
