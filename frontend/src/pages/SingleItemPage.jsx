import React, { Component } from 'react';
import { getProductApi, deleteProductApi } from '../api/adminProductApi';
import { relatedProductsApi } from '../api/recommenderApi';
import { addProductCartApi } from '../api/userApi';
import { Grid, TextField, Button } from '@material-ui/core';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import { useReco } from '../context/RecoContext';
import { useAlert } from '../context/AlertContext';
import { Link } from 'react-router-dom';
import { StyledLink } from '../components/NavBarElements';
import '../components/assets/scss/ShopPage.scss';

export const Image = styled.div`
  width: 100%;
`;

const NoStyledLink = styled(Link)`
  text-decoration: none;
`;

function wrapper(Component) {
  return function WrappedComponent(props) {
    const { token } = useAuth();
    const { admin } = useAdmin();
    const { setView, setFormColor } = useCart();
    const { displayRelatedProducts, setRelatedItems } = useReco();
    const { handlePopupClick, loading, DisplayLoadingScreen, setLoading } =
      useAlert();
    return (
      <Component
        {...props}
        token={token}
        admin={admin}
        setView={setView}
        setFormColor={setFormColor}
        displayRelatedProducts={displayRelatedProducts}
        setRelatedItems={setRelatedItems}
        handlePopupClick={handlePopupClick}
        loading={loading}
        DisplayLoadingScreen={DisplayLoadingScreen}
        setLoading={setLoading}
      />
    );
  };
}

class SingleItemPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params,
      boardgame: [],
      name: '',
      handle: '',
      description: '',
      discount: '',
      images: [],
      min_age: '',
      min_players: '',
      min_playtime: '',
      max_players: '',
      max_playtime: '',
      price_text: '',
      price_au: '',
      quantity: '',
      year_published: '',
      average_user_rating: '',
      userQuantity: '',
      show: false,
    };
  }

  async componentDidMount() {
    const data = await getProductApi(this.props.match.params);

    this.setState({
      boardgame: data,
      id: data.id,
      name: data.name,
      handle: data.handle,
      description: data.description,
      discount: data.discount,
      images: data.images,
      min_age: data.min_age,
      min_players: data.min_players,
      min_playtime: data.min_playtime,
      max_players: data.max_players,
      max_playtime: data.max_playtime,
      price_text: data.price_text,
      price_au: data.price_au,
      quantity: data.quantity,
      year_published: data.year_published,
      average_user_rating: data.average_user_rating.toFixed(1),
    });

    const setRelatedItems = this.props.setRelatedItems;
    const setLoading = this.props.setLoading;
    const data2 = await relatedProductsApi({ handle: data.handle });
    setRelatedItems(data2);
    setLoading(false);
  }

  handleQuantityChange = (e) => {
    this.setState({
      userQuantity: e.target.value,
    });
  };

  render() {
    const token = this.props.token;
    const isAdmin = this.props.admin;
    const setView = this.props.setView;
    const setFormColor = this.props.setFormColor;
    const displayRelatedProducts = this.props.displayRelatedProducts;
    const handlePopupClick = this.props.handlePopupClick;
    const loading = this.props.loading;
    const DisplayLoadingScreen = this.props.DisplayLoadingScreen;

    const addToCart = async () => {
      try {
        const data = await addProductCartApi({
          quantity: userQuantity,
          handle: handle,
          token: token,
        });
        if (data) {
          handlePopupClick('Added to cart!', 'success', 'top', 'center');
        }
      } catch (error) {
        handlePopupClick(error.message.toString(), 'error', 'top', 'center');
      }
    };

    const DeleteBoardGame = async () => {
      try {
        const data = await deleteProductApi({
          id: this.props.match.params.id,
        });
        if (data) {
          handlePopupClick('Product Deleted!', 'success', 'top', 'center');
          this.props.history.push('/shop');
        }
      } catch (error) {
        handlePopupClick(error.message.toString(), 'error', 'top', 'center');
      }
    };

    const BuyGame = async () => {
      try {
        const data = await addProductCartApi({
          quantity: userQuantity,
          handle: handle,
          token: token,
        });
        if (data) {
          setView('details');
          setFormColor('#00000');
          this.props.history.push('/cart');
          handlePopupClick('Going to Checkout!', 'success', 'top', 'center');
        }
      } catch (error) {
        handlePopupClick(error.message.toString(), 'error', 'top', 'center');
      }
    };

    const {
      name,
      handle,
      description,
      discount,
      images,
      min_age,
      min_players,
      min_playtime,
      max_players,
      max_playtime,
      price_text,
      price_au,
      quantity,
      year_published,
      average_user_rating,
      userQuantity,
    } = this.state;

    let discounted_price = 0;
    if (discount > 0) {
      discounted_price = price_au * (1 - discount);
    }
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
        <StyledLink to="/shop">Go Back</StyledLink>
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ maxWidth: 500 }}>
              <CardMedia
                component="img"
                height="500"
                objectfit="contain"
                image={images.large}
                alt="board game image"
              />
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontWeight: 'bold' }} variant="h3">
              {name}
            </Typography>
            Year Published: {year_published}
            <br />
            <br />
            <Typography sx={{ fontWeight: 'bold' }} variant="li">
              Suitable for {min_players}-{max_players} players
              <br />
              Friendly for ages {min_age}+<br />
              Expected game time {min_playtime}-{max_playtime} mins
              <br />
              Rated {average_user_rating} out of 5
            </Typography>
            <h3>Items Remaining: {quantity}</h3>
            {discount > 0 && (
              <div>
                <h3 style={{ textDecoration: 'line-through' }}>{price_text}</h3>
                <h2
                  style={{
                    color: '#4bbba9',
                  }}
                >
                  Now ${discounted_price.toFixed(2)}!
                </h2>
              </div>
            )}
            {discount === 0 && <h2>{price_text}</h2>}
            <Grid container direction="row" spacing={2}>
              <Grid item xs={4} sm={4}>
                Quantity:
                <TextField
                  type="number"
                  size="small"
                  value={this.state.userQuantity}
                  onChange={this.handleQuantityChange}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                />
              </Grid>
              <Grid item xs={4} sm={12}></Grid>
              <Grid item xs={6} sm={6}>
                <Button
                  sx={{
                    backgroundColor: '#728FB5',
                    '&:hover': {
                      backgroundColor: '#485B73',
                    },
                  }}
                  variant="contained"
                  className="form-input"
                  fullWidth
                  size="medium"
                  onClick={addToCart}
                >
                  Add to Cart
                </Button>
              </Grid>
              <Grid item xs={6} sm={6}>
                <Button
                  sx={{
                    backgroundColor: '#63bdbd',
                    '&:hover': {
                      backgroundColor: '#70a0a0',
                    },
                  }}
                  variant="contained"
                  color="secondary"
                  fullWidth
                  className="form-input"
                  size="medium"
                  onClick={() => BuyGame()}
                >
                  Buy Now
                </Button>
              </Grid>
              <Grid item xs={6} sm={6}>
                <Button
                  sx={{
                    visibility: isAdmin === 'true' ? 'visible' : 'hidden',
                    backgroundColor: '#ee2b2b',
                    '&:hover': {
                      backgroundColor: '#9e0303',
                    },
                  }}
                  variant="contained"
                  fullWidth
                  className="form-input"
                  size="medium"
                  onClick={DeleteBoardGame}
                >
                  Delete
                </Button>
              </Grid>
              <Grid item xs={6} sm={6}>
                <NoStyledLink to={`/editproduct/${this.props.match.params.id}`}>
                  <Button
                    sx={{
                      visibility: isAdmin === 'true' ? 'visible' : 'hidden',
                      backgroundColor: '#6792c7',
                      '&:hover': {
                        backgroundColor: '#485B73',
                      },
                    }}
                    variant="contained"
                    fullWidth
                    className="form-input"
                    size="medium"
                  >
                    Edit
                  </Button>
                </NoStyledLink>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <h3>Description</h3>
        <div dangerouslySetInnerHTML={{ __html: description }}></div>
        <h2>Related Products You May Like</h2>
        {loading ? (
          <DisplayLoadingScreen />
        ) : (
          <>
            <div className="relatedProducts">{displayRelatedProducts}</div>{' '}
          </>
        )}
      </section>
    );
  }
}

export default wrapper(SingleItemPage);
