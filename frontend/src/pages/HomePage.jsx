import React from 'react';
import banner from '../components/assets/img/homepage_banner.svg';
import gift from '../components/assets/img/gift.png';
import styled from 'styled-components';
import { useReco } from '../context/RecoContext';
import Carousel from 'react-elastic-carousel';
import '../components/assets/scss/HomePage.scss';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useAlert } from '../context/AlertContext';

export const Banner = styled.div`
  width: 100%;
  background-color: '#9DDFD5';
`;

const homeStyling = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flexStart',
  alignItems: 'Center',
};

const contentStyling = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'Center',
  alignItems: 'Center',
};

const imgStyling = {
  width: '100%',
};

const Container = styled.div`
  width: 100%;
  margin: 4rem 0rem 2rem;
  text-align: center;
`;

const HomePage = () => {
  const {
    displayPopularProducts,
    getPopularItemsData,
    displayUserProducts,
    getUserRecommendedItemsData,
  } = useReco();

  const { loading, DisplayLoadingScreen, setLoading } = useAlert();

  const { token } = useAuth();

  React.useEffect(() => {
    /*eslint-disable*/
    setLoading(true);
    getPopularItemsData();
    getUserRecommendedItemsData();
  }, []);

  return (
    <div style={homeStyling}>
      <Banner>
        <Link to="/shop">
          <img style={imgStyling} src={banner} alt="homebanner" />
        </Link>
      </Banner>
      <Container>
        <h1>Most Popular Bored Games</h1>
        {loading ? (
          <div>
            <DisplayLoadingScreen />
          </div>
        ) : (
          <Carousel
            style={{ width: '50%', padding: '1rem', margin: '0 auto' }}
            itemsToShow={5}
            pagination={false}
            enableAutoPlay={true}
            autoPlaySpeed={3000}
          >
            {displayPopularProducts}
          </Carousel>
        )}
      </Container>
      {token ? (
        <Container>
          <h1>Games Recommended for You</h1>
          {loading ? (
            <div>
              <DisplayLoadingScreen />
            </div>
          ) : (
            <Carousel
              style={{ color: 'blue' }}
              style={{ width: '50%', padding: '1rem', margin: '0 auto' }}
              itemsToShow={5}
              pagination={false}
              enableAutoPlay={true}
              autoPlaySpeed={3000}
            >
              {displayUserProducts}
            </Carousel>
          )}
        </Container>
      ) : (
        <div></div>
      )}

      <Container>
        <h1>Introducing Bored Gifts!</h1>
        <div style={contentStyling}>
          <h3>
            We've got gifting delivery!
            <br />
            Just provide us with the address, <br />
            mark as a gift and we'll do the rest :)
          </h3>
          <img src={gift} alt="Gift" />
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
