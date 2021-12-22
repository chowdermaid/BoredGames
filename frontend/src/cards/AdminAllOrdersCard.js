import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button, Typography } from '@material-ui/core';
import '../components/assets/scss/AdminPortalPage.scss';

const AdminAllOrdersCard = ({
  order_number,
  user,
  date_purchased,
  cost,
  status,
}) => {
  return (
    <div className="AdminOrderCard">
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={2}>
          <Typography>{order_number}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography>{user}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>{date_purchased.substr(0, 10)}</Typography>
        </Grid>
        <Grid item xs={1} display="flex" justifyContent="flex-end">
          <Typography>${cost.toFixed(2)}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>{status}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Link to={`/adminportal/${order_number}`}>
            <Button
              sx={{
                margin: '1px',
                borderRadius: '10px',
                backgroundColor: 'rgb(76, 180, 164)',
                '&:hover': {
                  backgroundColor: 'rgb(49, 120, 109)',
                },
              }}
              variant="contained"
            >
              View Order
            </Button>
          </Link>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminAllOrdersCard;
