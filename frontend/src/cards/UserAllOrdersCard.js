import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button, Typography } from '@material-ui/core';
import '../components/assets/scss/MyAccountPage.scss';

const UserAllOrdersCard = ({
  order_number,
  date_purchased,
  cost,
  status,
  view_order,
}) => {
  return (
    <div className="UserOrderCard">
      <Grid container spacing={5} alignItems="center">
        <Grid item xs={3} display="flex" justifyContent="flex-end">
          <Typography>{order_number}</Typography>
        </Grid>
        <Grid item xs={3} display="flex" justifyContent="center">
          <Typography>{date_purchased.substr(0, 10)}</Typography>
        </Grid>
        <Grid item xs={1} display="flex" justifyContent="flex-end">
          <Typography>${cost.toFixed(2)}</Typography>
        </Grid>
        <Grid item xs={2} display="flex" justifyContent="center">
          <Typography>{status}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Link to={`/myaccount/${order_number}`}>
            <Button
              onClick={view_order}
              variant="contained"
              sx={{
                borderRadius: '10px',
                backgroundColor: 'rgb(76, 180, 164)',
                '&:hover': {
                  backgroundColor: 'rgb(49, 120, 109)',
                },
              }}
            >
              View Order
            </Button>
          </Link>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserAllOrdersCard;
