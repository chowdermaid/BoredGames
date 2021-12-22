import React from 'react';
import { Grid, Typography, TextField, Button } from '@material-ui/core';
import { useTrans } from '../context/TransContext';
import { useAlert } from '../context/AlertContext';
import '../components/assets/scss/SingleOrderPage.scss';

const AdminViewOrders = () => {
  const {
    getAllAdminOrders,
    displayAdminOrders,
    navToOrderAdmin,
    setSortStatusAdmin,
  } = useTrans();
  const [adminPortalSearch, setAdminPortalSearch] = React.useState('');
  const { loading, DisplayLoadingScreen, setLoading } = useAlert();

  React.useEffect(() => {
    /* eslint-disable */
    setLoading(true);
    getAllAdminOrders();
  }, []);

  return (
    <div className="adminViewOrders">
      <h1>All Store Transactions</h1>
      <div style={{ display: 'flex', alignItems: 'center', padding: '1rem' }}>
        <Typography>Search specific order: &nbsp;</Typography>
        <TextField
          size="small"
          label="Order Number"
          type="text"
          value={adminPortalSearch}
          sx={{ marginRight: 2 }}
          onChange={(e) => setAdminPortalSearch(e.target.value)}
        />
        <Button
          variant="contained"
          style={{
            padding: '7px',
            backgroundColor: '#485B73',
            '&:hover': {
              backgroundColor: '#6792c7',
            },
          }}
          onClick={() => navToOrderAdmin(adminPortalSearch)}
        >
          Go
        </Button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Typography>View by</Typography>
        &nbsp;&nbsp;
        <Button
          variant="contained"
          sx={{
            marginRight: 1,
            backgroundColor: '#485B73',
            '&:hover': {
              backgroundColor: '#6792c7',
            },
          }}
          onClick={() => setSortStatusAdmin('all')}
        >
          All
        </Button>
        <Button
          variant="contained"
          sx={{
            marginRight: 1,
            backgroundColor: '#485B73',
            '&:hover': {
              backgroundColor: '#6792c7',
            },
          }}
          onClick={() => setSortStatusAdmin('pending')}
        >
          Pending
        </Button>
        <Button
          variant="contained"
          sx={{
            marginRight: 1,
            backgroundColor: '#485B73',
            '&:hover': {
              backgroundColor: '#6792c7',
            },
          }}
          onClick={() => setSortStatusAdmin('delayed')}
        >
          Delayed
        </Button>
        <Button
          variant="contained"
          sx={{
            marginRight: 1,
            backgroundColor: '#485B73',
            '&:hover': {
              backgroundColor: '#6792c7',
            },
          }}
          onClick={() => setSortStatusAdmin('shipped')}
        >
          Shipped
        </Button>
        <Button
          variant="contained"
          sx={{
            marginRight: 1,
            backgroundColor: '#485B73',
            '&:hover': {
              backgroundColor: '#6792c7',
            },
          }}
          onClick={() => setSortStatusAdmin('delivered')}
        >
          Delivered
        </Button>
      </div>
      <div className="AdminOrderCategory">
        <Grid container spacing={2} alignItems="center" textAlign="center">
          <Grid item xs={2} justifyContent="center">
            <Typography>Order Number</Typography>
          </Grid>
          <Grid item xs={3} justifyContent="center">
            <Typography>User</Typography>
          </Grid>
          <Grid item xs={2} justifyContent="center">
            <Typography>Date Ordered</Typography>
          </Grid>
          <Grid item xs={1} justifyContent="center">
            <Typography>Paid</Typography>
          </Grid>
          <Grid item xs={2} justifyContent="center">
            <Typography>Status</Typography>
          </Grid>
        </Grid>
      </div>
      {loading ? <DisplayLoadingScreen /> : <>{displayAdminOrders}</>}
    </div>
  );
};

export default AdminViewOrders;
