import React from 'react';
import { Button, TextField, Typography } from '@material-ui/core';
import { useTrans } from '../context/TransContext';
import { useAlert } from '../context/AlertContext';

const AdminCouponMenu = () => {
  const { displayCoupons, getAllCoupons, setVoucher, setCode, addCoupon } =
    useTrans();
  const {
    loading,
    DisplayLoadingScreen,
    setLoading,
    DisplayLoadingScreen2,
    loading2,
  } = useAlert();

  React.useEffect(() => {
    /*eslint-disable*/
    setLoading(true);
    getAllCoupons();
  }, []);

  return (
    <div className="adminCouponMenu">
      <h1>Coupon Management</h1>
      <div style={{ padding: '1rem' }} className="AddCouponField">
        <TextField
          size="small"
          style={{ width: '10rem' }}
          label="Code"
          sx={{
            margin: '0 0.5rem',
          }}
          onChange={(e) => setCode(e.target.value)}
        />
        <TextField
          size="small"
          style={{ width: '5rem' }}
          label="Value"
          type="tel"
          sx={{
            margin: '0 0.5rem',
          }}
          onChange={(e) => setVoucher(e.target.value)}
        />
        {loading2 ? (
          <div style={{ position: 'absolute', right: '750px', top: '230px' }}>
            <DisplayLoadingScreen2 />
          </div>
        ) : (
          <Button
            size="small"
            style={{ height: '2.5rem', width: '7rem' }}
            variant="contained"
            sx={{
              margin: '0 0.5rem',
              backgroundColor: '#485B73',
              '&:hover': {
                backgroundColor: '#6792c7',
              },
            }}
            onClick={() => addCoupon()}
          >
            Add Coupon
          </Button>
        )}
      </div>
      <Typography fontWeight="bold">All Active Coupons</Typography>
      {loading ? <DisplayLoadingScreen /> : <>{displayCoupons}</>}
    </div>
  );
};

export default AdminCouponMenu;
