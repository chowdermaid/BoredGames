import React from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import { searchProductApi, addProductApi } from '../api/adminProductApi';
import { Item } from '../components/Image';
import { useAlert } from '../context/AlertContext';
import { useHistory } from 'react-router-dom';

const AdminAddProduct = () => {
  const { handlePopupClick } = useAlert();

  const [productName, setProductName] = React.useState('');
  const [productInfo, setProductInfo] = React.useState([]);

  const [quantity, setQuantity] = React.useState('');
  const [discount, setDiscount] = React.useState('');
  const [price, setPrice] = React.useState('');
  const history = useHistory();

  /**
   * Searches product
   */
  const searchProduct = async (e) => {
    e.preventDefault();
    try {
      const data = await searchProductApi({ name: productName });
      if (data) {
        setProductInfo(data);
        handlePopupClick('Product found!', 'success', 'top', 'center');
      }
    } catch (error) {
      handlePopupClick(error.message.toString(), 'error', 'top', 'center');
    }
  };

  /**
   * Add product
   */
  const productForm = async (e) => {
    e.preventDefault();
    try {
      const data = await addProductApi({
        quantity,
        discount,
        price,
      });
      if (data) {
        handlePopupClick(
          'Added product successfully!',
          'success',
          'top',
          'center',
        );
        history.push(`/shop/${data.id}`);
      }
    } catch (error) {
      handlePopupClick(error.message.toString(), 'error', 'top', 'center');
    }
  };

  const Results = () => (
    <div>
      <p>Product Name: {productInfo.name}</p>
      <Item style={{ height: '300px' }}>
        <img
          src={productInfo.thumb_url}
          alt="AddedProduct"
          style={{
            objectfit: 'contain',
            maxWidth: '400px',
            maxHeight: '400px',
          }}
        ></img>
      </Item>
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'Column',
        justifyContent: 'flexStart',
        alignItems: 'Center',
        margin: 'auto',
      }}
    >
      <h1>Add A Product</h1>
      <Grid container direction="row" spacing={2}>
        <Grid item xs={12} sm={4}></Grid>
        <Grid item xs={12} sm={4}>
          <Grid
            item
            xs={12}
            sm={12}
            display="flex"
            justifyContent="space-evenly"
            alignItems="space-around"
          >
            <TextField
              id="product-name"
              value={productName}
              label="Name of the product"
              variant="outlined"
              onChange={(e) => setProductName(e.target.value)}
            />
            <Button
              sx={{
                backgroundColor: 'rgb(76, 180, 164)',
                '&:hover': {
                  backgroundColor: 'rgb(49, 120, 109)',
                },
              }}
              variant="contained"
              onClick={searchProduct}
            >
              Search
            </Button>
          </Grid>
          <Grid item display="flex" justifyContent="center" alignItems="center">
            <h2>Product Found</h2>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {productInfo ? <Results /> : ''}
          </Grid>
          <Grid
            container
            display="flex"
            justifyContent="space-evenly"
            alignItems="space-around"
          >
            <form onSubmit={productForm} id="formregister">
              <Grid item xs={12} sm={12} p={1}>
                <TextField
                  id="product-quantity"
                  label="Quantity of stock"
                  variant="outlined"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} p={1}>
                <TextField
                  id="product-discount"
                  label="Discount %"
                  variant="outlined"
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </Grid>
              {productInfo ? (
                <p>Current price : ${productInfo.price_au}</p>
              ) : (
                ''
              )}
              <Grid item xs={12} sm={12} p={1}>
                <TextField
                  id="product-price"
                  label="Price of Product"
                  variant="outlined"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} p={1}>
                <Button
                  sx={{
                    width: 150,
                    borderRadius: '20px',
                    backgroundColor: '#485B73',
                    '&:hover': {
                      backgroundColor: '#6792c7',
                    },
                  }}
                  type="submit"
                  variant="contained"
                  color="success"
                >
                  Submit
                </Button>
              </Grid>
            </form>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={4}></Grid>
      </Grid>
    </div>
  );
};

export default AdminAddProduct;
