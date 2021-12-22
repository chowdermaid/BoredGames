import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import CloseIcon from '@mui/icons-material/Close';

const CouponCard = ({ code, voucher, deleteCoupon }) => {
  return (
    <div>
    <Grid className="CouponCard" container direction="row" spacing={2} width="40%" margin="auto">
        <Grid item xs={4} sm={4} display="flex" justifyContent="center">
          <CloseIcon style={{ color: 'red' }} onClick={deleteCoupon} />
        </Grid>
        <Grid item xs={4} sm={4} display="flex" justifyContent="center">
          <Typography>{code}</Typography>
        </Grid>
        <Grid item xs={4} sm={4} display="flex" justifyContent="center">
          <Typography>{voucher} off</Typography>
        </Grid>
    </Grid>
      
    </div>
  );
};

export default CouponCard;
