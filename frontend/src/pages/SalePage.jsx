import React from 'react';
import { useShop } from '../context/ShopContext';
import { Grid } from '@material-ui/core';
import { useAlert } from '../context/AlertContext';

const SalePage = () => {
  const { displaySaleShopProducts, getSaleShopData } = useShop();
  const { loading, DisplayLoadingScreen, setLoading } = useAlert();

  React.useEffect(() => {
    /*eslint-disable*/
    setLoading(true);
    getSaleShopData();
  }, []);

  return (
    <div>
      <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
        <Grid item xs={11}>
          <div className="flex-container">
            <h1 style={{ minWidth: '15%' }}>On Sale</h1>
            <div className="filteredTags"></div>
          </div>
          {loading ? (
            <div>
              {' '}
              <DisplayLoadingScreen />{' '}
            </div>
          ) : (
            <div className="catalog">{displaySaleShopProducts}</div>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default SalePage;
