import React from 'react';
import { Button } from '@material-ui/core';
import { useShop } from '../context/ShopContext';
import CloseIcon from '@mui/icons-material/Close';

const FilteredTagsCard = ({ tag, type, value }) => {
  const {
    setSearch,
    setPriceSlider,
    setPlayerSlider,
    setYearSlider,
    setAgeSlider,
    setPlaytimeSlider,
    categories,
    setCategories,
    mechanics,
    setMechanics,
    setCurve,
    setDepth,
    usedFilters,
    setUsedFilters,
    categoriesChecked,
    mechanicsChecked,
  } = useShop();

  const removeTag = () => {
    if (type === 'search') {
      setSearch('');
      setUsedFilters(usedFilters.filter((a) => a.type !== 'search'));
    }
    if (type === 'price') {
      setPriceSlider([0, 70]);
      setUsedFilters(usedFilters.filter((a) => a.type !== 'price'));
    }
    if (type === 'year') {
      setYearSlider([1, 50]);
      setUsedFilters(usedFilters.filter((a) => a.type !== 'year'));
    }
    if (type === 'players') {
      setPlayerSlider([1, 20]);
      setUsedFilters(usedFilters.filter((a) => a.type !== 'players'));
    }
    if (type === 'age') {
      setAgeSlider(18);
      setUsedFilters(usedFilters.filter((a) => a.type !== 'age'));
    }
    if (type === 'playtime') {
      setPlaytimeSlider([0, 100]);
      setUsedFilters(usedFilters.filter((a) => a.type !== 'playtime'));
    }
    if (type === 'categories') {
      setCategories(categories.filter((a) => a !== value));
      setUsedFilters(usedFilters.filter((a) => a.value !== value));
      categoriesChecked(value);
    }
    if (type === 'mechanics') {
      setMechanics(mechanics.filter((a) => a !== value));
      setUsedFilters(usedFilters.filter((a) => a.value !== value));
      mechanicsChecked(value);
    }
    if (type === 'curve') {
      setCurve([1, 5]);
      setUsedFilters(usedFilters.filter((a) => a.type !== 'curve'));
    }
    if (type === 'depth') {
      setDepth([1, 5]);
      setUsedFilters(usedFilters.filter((a) => a.type !== 'depth'));
    }
  };

  return (
    <div className="FilteredTagsCard">
      <Button
        sx={{
          fontSize: '0.6rem',
          fontWeight: 'bold',
          borderRadius: '1rem',
          margin: '3px',
        }}
        size="small"
        variant="outlined"
        onClick={() => removeTag()}
      >
        <CloseIcon color="error" onClick={() => removeTag()} fontSize="1" />
        {tag}
      </Button>
    </div>
  );
};

export default FilteredTagsCard;
