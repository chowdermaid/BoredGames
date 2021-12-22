import React from 'react';
import AdminAddProduct from '../components/AdminAddProduct';
import AdminViewOrders from '../components/AdminViewOrders';
import AdminCouponMenu from '../components/AdminCouponMenu';
import AdminAnalytics from '../components/AdminAnalytics';
import AdminOutOfStock from '../components/AdminOutOfStock';
import { Button } from '@material-ui/core';
import '../components/assets/scss/AdminPortalPage.scss';

const AdminPortalPage = () => {
  const [view, setView] = React.useState('analytics');

  const adminView = (view) => {
    if (view === 'analytics') {
      return <AdminAnalytics />;
    } else if (view === 'addProduct') {
      return <AdminAddProduct />;
    } else if (view === 'outOfStock') {
      return <AdminOutOfStock />;
    } else if (view === 'userOrders') {
      return <AdminViewOrders />;
    } else if (view === 'couponMenu') {
      return <AdminCouponMenu />;
    }
  };

  return (
    <div>
      <div className="adminPortalView">
        <Button
          sx={{
            width: 200,
            margin: '1rem',
            borderRadius: '20px',
            backgroundColor: 'rgb(76, 180, 164)',
            '&:hover': {
              backgroundColor: 'rgb(49, 120, 109)',
            },
          }}
          variant="contained"
          onClick={() => setView('analytics')}
        >
          {view === 'analytics' ? <b>Analytics</b> : <>Analytics</>}
        </Button>
        <Button
          sx={{
            width: 200,
            margin: '1rem',
            borderRadius: '20px',
            backgroundColor: 'rgb(76, 180, 164)',
            '&:hover': {
              backgroundColor: 'rgb(49, 120, 109)',
            },
          }}
          variant="contained"
          onClick={() => setView('addProduct')}
        >
          {view === 'addProduct' ? <b>Add Product</b> : <>Add Product</>}
        </Button>
        <Button
          sx={{
            width: 200,
            margin: '1rem',
            borderRadius: '20px',
            backgroundColor: 'rgb(76, 180, 164)',
            '&:hover': {
              backgroundColor: 'rgb(49, 120, 109)',
            },
          }}
          variant="contained"
          onClick={() => setView('outOfStock')}
        >
          {view === 'outOfStock' ? <b>Out of Stock</b> : <>Out of Stock</>}
        </Button>
        <Button
          sx={{
            width: 200,
            margin: '1rem',
            borderRadius: '20px',
            backgroundColor: 'rgb(76, 180, 164)',
            '&:hover': {
              backgroundColor: 'rgb(49, 120, 109)',
            },
          }}
          variant="contained"
          onClick={() => setView('userOrders')}
        >
          {view === 'userOrders' ? <b>View Orders</b> : <>View Orders</>}
        </Button>
        <Button
          sx={{
            width: 200,
            margin: '1rem',
            borderRadius: '20px',
            backgroundColor: 'rgb(76, 180, 164)',
            '&:hover': {
              backgroundColor: 'rgb(49, 120, 109)',
            },
          }}
          variant="contained"
          onClick={() => setView('couponMenu')}
        >
          {view === 'couponMenu' ? <b>Coupon Menu</b> : <>Coupon Menu</>}
        </Button>
      </div>
      <div>{adminView(view)}</div>
    </div>
  );
};

export default AdminPortalPage;
