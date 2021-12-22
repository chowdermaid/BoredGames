import React from 'react';
import { getOOSApi } from '../api/analyticsApi';
import { useAlert } from '../context/AlertContext';
import { Grid } from '@material-ui/core';
import OOSProductCard from '../cards/OOSProductCard';

const AdminOutOfStock = () => {
  const [OOSItems, setOOSItems] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const { loading, DisplayLoadingScreen, setLoading, handlePopupClick } =
    useAlert();

  const getOOSData = async () => {
    try {
      const data = await getOOSApi({});
      setMessage(data.message);
      setOOSItems(data.products);
      setLoading(false);
    } catch (error) {
      handlePopupClick(error.message.toString(), 'error', 'top', 'center');
      setLoading(false);
    }
  };

  /**
   * Displays discounted price
   */
  const discountedPrice = (discount, price) => {
    var value = 0;
    value = price * (1 - discount);
    return value;
  };

  const hasDiscount = (discount) => {
    if (discount > 0) {
      return true;
    }
    return false;
  };

  const displayOOSProducts = OOSItems.map((data) => (
    <OOSProductCard
      imgurl={data.image_url}
      name={data.name}
      price={data.price_au}
      id={data.id}
      discount={discountedPrice(data.discount, data.price_au)}
      hasDiscount={hasDiscount(data.discount)}
      key={data.handle}
    />
  ));

  React.useEffect(() => {
    /* eslint-disable */
    setLoading(true);
    getOOSData();
  }, []);

  return (
    <div>
      <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
        <Grid item xs={11}>
          <div
            className="flex-container"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <h1 style={{ minWidth: '15%' }}>Out of Stock Items</h1>
            <h3>{message}</h3>
          </div>
          {loading ? (
            <div>
              {' '}
              <DisplayLoadingScreen />{' '}
            </div>
          ) : (
            <div className="catalog">{displayOOSProducts}</div>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminOutOfStock;
