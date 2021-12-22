import React from 'react';
import {
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
} from '@material-ui/core';
import '../components/assets/scss/ShopPage.scss';
import ShopMenu from '../components/ShopMenu';
import { useShop } from '../context/ShopContext';
import ReactPaginate from 'react-paginate';
import { useAlert } from '../context/AlertContext';

const ShopPage = () => {
  const {
    handleSortMenu,
    sortName,
    displayShopProducts,
    pageCount,
    changePage,
    getShopData,
    pageNumber,
    displayUserSelectedTags,
    usedFilters,
    removeAllUserSelectedTags,
    getShopMenuData,
  } = useShop();

  const { loading, DisplayLoadingScreen, setLoading } = useAlert();

  React.useEffect(() => {
    /*eslint-disable*/
    setLoading(true);
    getShopData();
    getShopMenuData();
  }, []);

  /**
   * Dropdown for sort
   */
  const sortMenu = () => {
    return (
      <div className="sortMenu">
        <FormControl id="sortForm">
          <InputLabel id="sortLabel"> {sortName} </InputLabel>
          <Select>
            <MenuItem onClick={() => handleSortMenu('Rank')}>Rank</MenuItem>{' '}
            <MenuItem onClick={() => handleSortMenu('AZ')}>Name: A-Z</MenuItem>{' '}
            |<MenuItem onClick={() => handleSortMenu('ZA')}>Name: Z-A</MenuItem>{' '}
            |
            <MenuItem onClick={() => handleSortMenu('PriceUp')}>
              Price: Lowest-Highest
            </MenuItem>{' '}
            |
            <MenuItem onClick={() => handleSortMenu('PriceDown')}>
              Price: Highest-Lowest
            </MenuItem>
          </Select>
        </FormControl>
      </div>
    );
  };

  return (
    <div className="shopPage">
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <ShopMenu />
        </Grid>
        <Grid item xs={9}>
          <div className="flex-container">
            <h1 style={{ minWidth: '15%' }}>Shop All</h1>
            <div className="filteredTags">
              {displayUserSelectedTags}
              {!usedFilters === undefined || usedFilters.length > 0 ? (
                <Button
                  sx={{
                    fontSize: '0.6rem',
                    fontWeight: 'bold',
                    borderRadius: '1rem',
                    margin: '3px',
                  }}
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={() => removeAllUserSelectedTags()}
                >
                  Remove all tags
                </Button>
              ) : (
                <div></div>
              )}{' '}
            </div>
            {sortMenu()}
          </div>
          <div>
            {loading ? (
              <div style={{ marginRight: '120px' }}>
                {' '}
                {<DisplayLoadingScreen />}{' '}
              </div>
            ) : (
              <div className="catalog">{displayShopProducts}</div>
            )}

            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              pageCount={pageCount}
              onPageChange={changePage}
              containerClassName={'paginationBttns'}
              previousLinkClassName={'previousBttn'}
              nextLinkClassName={'nextBttn'}
              disabledClassName={'paginationDisabled'}
              activeClassName={'paginationActive'}
              forcePage={pageNumber}
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default ShopPage;
