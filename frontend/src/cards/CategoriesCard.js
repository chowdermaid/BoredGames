import React from 'react';
import { Typography, FormControlLabel, Checkbox } from '@material-ui/core';
import { useShop } from '../context/ShopContext';

const CategoriesCard = ({ value }) => {
  const { categoriesChecked, handleCategoriesChange } = useShop();

  return (
    <FormControlLabel
      control={<Checkbox style={{ color: 'rgb(76, 180, 164)' }} />}
      label={<Typography fontSize="0.85rem">{value}</Typography>}
      value={value}
      checked={categoriesChecked(value)}
      onChange={(e) => handleCategoriesChange(e)}
    />
  );
};

export default CategoriesCard;
