import React, { useContext } from 'react';
import {
  curPopularApi,
  relatedProductsApi,
  recommendedForUserProductsApi,
} from '../api/recommenderApi';
import PopularProductsCard from '../cards/PopularProductsCard';
import RelatedProductsCard from '../cards/RelatedProductsCard';
import { useShop } from './ShopContext';
import { useAlert } from './AlertContext';
import { useAuth } from './AuthContext';

const RecoContext = React.createContext(undefined);

export const RecoProvider = ({ children }) => {
  const { addToCollection } = useShop();
  const { token } = useAuth();
  const [popularItems, setPopularItems] = React.useState([]);
  const [relatedItems, setRelatedItems] = React.useState([]);
  const [userItems, setUserItems] = React.useState([]);
  const { handlePopupClick, setLoading } = useAlert();

  const getPopularItemsData = async () => {
    try {
      const data = await curPopularApi({});
      if (data) {
        setPopularItems(data);
        setLoading(false);
      }
    } catch (error) {
      handlePopupClick(error.message.toString(), 'error', 'top', 'center');
    }
  };

  const getRelatedItemsData = async (handle) => {
    try {
      const data = await relatedProductsApi({ handle });
      if (data) {
        setRelatedItems(data);
        setLoading(false);
      }
    } catch (error) {
      handlePopupClick(error.message.toString(), 'error', 'top', 'center');
    }
  };

  const getUserRecommendedItemsData = async () => {
    if (token) {
      try {
        const data = await recommendedForUserProductsApi({ token: token });
        if (data) {
          setUserItems(data);
          setLoading(false);
        }
      } catch (error) {
        handlePopupClick(error.message.toString(), 'error', 'top', 'center');
      }
    }
  };

  const discountedPrice = (discount, price) => {
    var value = 0;
    value = price * (1 - discount);
    return value;
  };

  const hasDiscount = (discount) => {
    if (discount > 0) {
      return true;
    }
    return false;
  };

  const displayPopularProducts = popularItems.map((data) => (
    <PopularProductsCard
      imgurl={data.image_url}
      name={data.name}
      price={data.price_au}
      id={data.id}
      addToCollection={() => addToCollection(data.handle)}
      discount={discountedPrice(data.discount, data.price_au)}
      hasDiscount={hasDiscount(data.discount)}
      key={data.handle}
    />
  ));

  const displayUserProducts = userItems.map((data) => (
    <PopularProductsCard
      imgurl={data.image_url}
      name={data.name}
      price={data.price_au}
      id={data.id}
      addToCollection={() => addToCollection(data.handle)}
      discount={discountedPrice(data.discount, data.price_au)}
      hasDiscount={hasDiscount(data.discount)}
      key={data.handle}
    />
  ));

  const displayRelatedProducts = relatedItems.map((data) => (
    <RelatedProductsCard
      imgurl={data.image_url}
      name={data.name}
      price={data.price_au}
      id={data.id}
      addToCollection={() => addToCollection(data.handle)}
      discount={discountedPrice(data.discount, data.price_au)}
      hasDiscount={hasDiscount(data.discount)}
      key={data.handle}
    />
  ));

  return (
    <RecoContext.Provider
      value={{
        relatedItems,
        setRelatedItems,
        displayPopularProducts,
        getPopularItemsData,
        getRelatedItemsData,
        displayRelatedProducts,
        getUserRecommendedItemsData,
        displayUserProducts,
      }}
    >
      {children}
    </RecoContext.Provider>
  );
};

export const useReco = () => useContext(RecoContext);
