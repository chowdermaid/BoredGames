import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import { getProductApi, editProductApi } from '../api/adminProductApi';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useParams, useHistory } from 'react-router-dom';
import { useAlert } from '../context/AlertContext';
import styled from 'styled-components';

export const ImageContainer = styled.div`
  height: 20rem;
  display: flex;
  justify-content: center;
`;

const EditProductPage = () => {
  const { id } = useParams();
  const { handlePopupClick } = useAlert();
  const [productInfo, setProductInfo] = useState([]);
  const [quantity, setQuantity] = React.useState('');
  const [discount, setDiscount] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [description_preview, setdescriptionPreview] = React.useState('');
  const history = useHistory();

  useEffect(() => {
    /*eslint-disable*/
    async function loadProduct() {
      try {
        const response = await getProductApi({ id: id });
        setProductInfo(response);
      } catch (error) {
        handlePopupClick(error.message.toString(), 'error', 'top', 'center');
      }
    }
    loadProduct();
  }, []);

  const productForm = async (e) => {
    e.preventDefault();
    try {
      const data = await editProductApi({
        quantity,
        discount,
        price,
        description,
        description_preview,
        id,
      });
      if (data) {
        handlePopupClick(
          'Product updated successfully!',
          'success',
          'top',
          'center',
        );
        history.push(`/shop/${id}`);
      }
    } catch (error) {
      handlePopupClick(error.message.toString(), 'error', 'top', 'center');
    }
  };

  const Results = () => (
    <Card sx={{ width: 500 }}>
      <h2>Product Name: {productInfo.name}</h2>
      <ImageContainer>
        <img src={productInfo.image_url} alt="EditProduct"></img>
      </ImageContainer>
    </Card>
  );

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'Column',
        justifyContent: 'flexStart',
        alignContent: 'flexStart',
        maxWidth: '60%',
        marginTop: '4rem',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <Grid container direction="row" spacing={2}>
        <Grid item xs={12} sm={12} display="flex" justifyContent="space-evenly">
          <Typography sx={{ fontWeight: 'bold' }} variant="h3">
            Edit A Product
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
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
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid
            container
            xs={12}
            sm={12}
            display="flex"
            justifyContent="space-evenly"
            alignItems="space-around"
          >
            <form onSubmit={productForm} id="formregister">
              <Grid item xs={12} sm={12} p={3}>
                <Typography sx={{ fontWeight: 'bold' }} variant="h6">
                  Current Stock : {productInfo.quantity}
                </Typography>
                <TextField
                  id="edit-product-quantity"
                  label="New Quantity of stock"
                  variant="outlined"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} p={3}>
                <Typography sx={{ fontWeight: 'bold' }} variant="h6">
                  Discount Applied : {productInfo.discount}%
                </Typography>
                <TextField
                  id="edit-product-discount"
                  label="New Discount %"
                  variant="outlined"
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} p={3}>
                <Typography sx={{ fontWeight: 'bold' }} variant="h6">
                  Current price : ${productInfo.price_au}
                </Typography>
                <TextField
                  id="edit-product-price"
                  label="New Price of Product"
                  variant="outlined"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} p={1}>
                <TextField
                  id="description_preview"
                  value={description_preview}
                  multiline
                  type="text"
                  style={{ width: 400 }}
                  rows={10}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="Product Description Preview"
                  variant="outlined"
                  onChange={(e) => setdescriptionPreview(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} p={1}>
                <TextField
                  id="description"
                  value={description}
                  multiline
                  type="text"
                  rows={10}
                  label="Product Description"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: 400 }}
                />
              </Grid>
              <Grid item xs={12} sm={12} p={1}>
                <Button type="submit" variant="outlined" color="success">
                  Save Changes
                </Button>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Grid>
    </section>
  );
};

export default EditProductPage;
