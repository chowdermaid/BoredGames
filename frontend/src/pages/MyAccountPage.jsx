import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { useTrans } from '../context/TransContext';
import { useAlert } from '../context/AlertContext';

const MyAccountPage = () => {
  const { getAllOrders, displayUserOrders, setSortStatusUser } = useTrans();
  const { loading, DisplayLoadingScreen, setLoading } = useAlert();

  React.useEffect(() => {
    /*eslint-disable*/
    setLoading(true);
    getAllOrders();
  }, []);

  return (
    <div className="UserOrdersContainer">
      <Typography
        style={{
          fontWeight: 'bold',
          fontSize: '1.5rem',
          paddingBottom: '1rem',
        }}
      >
        My orders
      </Typography>
      <div className="UserSortOrdersMenu">
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
          onClick={() => setSortStatusUser('all')}
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
          onClick={() => setSortStatusUser('pending')}
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
          onClick={() => setSortStatusUser('delayed')}
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
          onClick={() => setSortStatusUser('shipped')}
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
          onClick={() => setSortStatusUser('delivered')}
        >
          Delivered
        </Button>
      </div>
      <div className="UserOrderCategory">
        <Grid container spacing={5} alignItems="center">
          <Grid item xs={3} display="flex" justifyContent="flex-end">
            <Typography>Order Number</Typography>
          </Grid>
          <Grid item xs={3} display="flex" justifyContent="center">
            <Typography>Date Ordered</Typography>
          </Grid>
          <Grid item xs={1} display="flex" justifyContent="flex-start">
            <Typography>Paid</Typography>
          </Grid>
          <Grid item xs={2} justifyContent="center">
            <Typography>Status</Typography>
          </Grid>
          <Grid item xs={3} justifyContent="center"></Grid>
        </Grid>
      </div>
      {loading ? <DisplayLoadingScreen /> : <> {displayUserOrders}</>}
    </div>
  );
};

export default MyAccountPage;
