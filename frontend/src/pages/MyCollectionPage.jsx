import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { getCollectionApi, deleteProductCollectionApi } from '../api/userApi';
import '../components/assets/scss/MyCollectionPage.scss';
import MyCollectionProductCard from '../cards/MyCollectionProductCard';

const MyCollectionPage = () => {
  const { token } = useAuth();
  const { handlePopupClick, loading, DisplayLoadingScreen, setLoading } =
    useAlert();
  const [card, setCard] = React.useState([]);

  /**
   * Gets all products in users collection
   */
  const getData = async () => {
    if (token) {
      const data = await getCollectionApi({ token: token });
      setCard(data);
      setLoading(false);
    }
  };

  /**
   * Delete selected product in user collection
   */
  const deleteProduct = async (handle) => {
    try {
      await deleteProductCollectionApi({ handle, token });
      handlePopupClick(
        'Deleted product from collection',
        'success',
        'top',
        'center',
      );
    } catch (error) {
      handlePopupClick(error.message.toString(), 'error', 'top', 'center');
    }
    await getData();
  };

  /**
   * Displays all products in users collection
   */
  const collectionItems = card.map((data) => (
    <MyCollectionProductCard
      imgurl={data.image_url}
      id={data.id}
      name={data.name}
      deleteProduct={() => deleteProduct(data.handle)}
      key={data.handle}
    />
  ));

  React.useEffect(() => {
    setLoading(true);
    getData();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="collectionContainer">
      <h1>My Collection</h1>
      {loading ? (
        <div>
          <DisplayLoadingScreen />{' '}
        </div>
      ) : (
        <div className="collectionItems">{collectionItems}</div>
      )}
    </div>
  );
};

export default MyCollectionPage;
