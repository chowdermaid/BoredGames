import React, { useContext } from 'react';
import {
  getCartApi,
  deleteProductCartApi,
  confirmTransactionApi,
  cartApplyCouponApi,
} from '../api/userApi';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { useAlert } from './AlertContext';
import CartProductCard from '../cards/CartProductCard';
import CheckoutProductCard from '../cards/CheckoutProductCard';
import CartProductPopupCard from '../cards/CartProductPopupCard';
import { useHistory } from 'react-router-dom';

const CartContext = React.createContext({});

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const { getShopData } = useShop();
  const { handlePopupClick, setLoading, setLoading2 } = useAlert();
  const history = useHistory();
  const [view, setView] = React.useState('review');
  const [cartItems, setCartItems] = React.useState([]);
  const [sum, setSum] = React.useState(0);
  const [quantity, setQuantity] = React.useState('');
  // Customer details page
  const [checked, setChecked] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [postcode, setPostcode] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [cardName, setCardName] = React.useState('');
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardExpiry, setCardExpiry] = React.useState('');
  const [cardCvc, setCardCvc] = React.useState('');
  const [friendName, setFriendName] = React.useState('');
  // Customer checkout page
  const [formFilled, setFormFilled] = React.useState(false);
  const [coupon, setCoupon] = React.useState('');
  const [method, setMethod] = React.useState('Free');
  const [shippingFee, setShippingFee] = React.useState(false);
  const [afterDiscount, setAfterDiscount] = React.useState(0);
  const [hasDiscount, setHasDiscount] = React.useState(false);
  const [discountString, setDiscountString] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [addToCol, setAddToCol] = React.useState('True');
  // Styling
  const [formColor, setFormColor] = React.useState('#DFDFDF');
  const [checkoutColor, setCheckoutColor] = React.useState('#DFDFDF');

  /**
   * Get cart data
   */
  const getCartData = async () => {
    if (token) {
      setLoading2(true);
      try {
        const data = await getCartApi({ token });
        if (data) {
          setCartItems(data.products);
          setSum(Number(data.total_cost.toFixed(2)));
          setAfterDiscount(Number(data.discount_cost));
          if (hasDiscount) {
            setSum(afterDiscount);
          }
          setLoading2(false);
        }
      } catch (error) {
        handlePopupClick(error.message.toString(), 'error', 'top', 'center');
      }
    }
  };

  /**
   * delete item from cart
   */
  const deleteFromCart = async (handle) => {
    try {
      const data = await deleteProductCartApi({ handle, token });
      if (data) {
        await getCartData();
        handlePopupClick(
          'Successfully removed from cart',
          'success',
          'top',
          'center',
        );
      }
    } catch (error) {
      handlePopupClick(error.message.toString(), 'error', 'top', 'center');
    }
  };

  /**
   * Apply coupon
   */
  const applyCoupon = async () => {
    try {
      const data = await cartApplyCouponApi({
        token: token,
        coupon_code: coupon,
      });
      if (data) {
        setHasDiscount(true);
        setDiscountString(data);
        const data2 = await getCartApi({ token });
        setSum(data2.discount_cost);
        handlePopupClick('Coupon applied!', 'success', 'top', 'center');
      }
    } catch (error) {
      handlePopupClick(error.message.toString(), 'error', 'top', 'center');
    }
  };

  /**
   * Perform transaction
   */
  const confirmTransaction = async () => {
    setLoading(true);
    try {
      const data = await confirmTransactionApi({
        token: token,
        card_name: cardName,
        card_number: cardNumber,
        card_expiry: cardExpiry,
        card_cvc: cardCvc,
        shipping_name: name,
        shipping_address: address,
        shipping_post_code: postcode,
        shipping_city: city,
        shipping_state: state,
        contact_number: phone,
        shipping_method: method,
        gifting: checked,
        gifting_email: email,
        gifting_name: friendName,
        gifting_message: message,
        add_to_collection: addToCol,
      });
      if (data) {
        handlePopupClick(
          'Your order has been placed!',
          'success',
          'top',
          'center',
        );
        setHasDiscount(false);
        setDiscountString('');
        setCoupon('');
        setSum(0);
        getShopData();
        setView('review');
        setLoading(false);
        history.push('/');
      }
    } catch (error) {
      handlePopupClick(error.message.toString(), 'error', 'top', 'center');
    }
  };

  /**
   * Handle add to collection checkbox
   */
  const handleAddToCollectionBox = (e) => {
    const checked = e.target.checked;
    if (checked) {
      setAddToCol('True');
    } else {
      setAddToCol('False');
    }
  };

  /**
   * reset cart state
   */
  const resetCartState = () => {
    setChecked(false);
    setEmail('');
    setName('');
    setAddress('');
    setPostcode('');
    setCity('');
    setState('');
    setPhone('');
    setCardName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvc('');
    setFormFilled(false);
    setCoupon('');
    setMethod('Free');
    setAfterDiscount(0);
    setShippingFee(false);
    setHasDiscount(false);
    setMessage('');
    setAddToCol('True');
    setView('review');
  };

  /**
   * displays discounted price
   */
  const discountedPrice = (discount, price) => {
    var value = 0;
    value = price * (1 - discount);
    return value;
  };

  const hasDiscountPrice = (discount) => {
    if (discount > 0) {
      return true;
    }
    return false;
  };

  // CARDS
  /**
   * Cart review display every card
   */
  const displayCartProducts = cartItems.map((data) => (
    <CartProductCard
      imgurl={data.image_url}
      id={data.id}
      name={data.name}
      quantity_in_cart={data.quantity_in_cart}
      deleteFromCart={() => deleteFromCart(data.handle)}
      handle={data.handle}
      token={token}
      price={data.price_au}
      discount={discountedPrice(data.discount, data.price_au)}
      hasDiscount={hasDiscountPrice(data.discount)}
      key={data.handle}
    />
  ));

  /**
   * Checkout display every card
   */
  const displayCheckoutProducts = cartItems.map((data) => (
    <CheckoutProductCard
      quantity={data.quantity_in_cart}
      name={data.name}
      price={data.price_au}
      discount={discountedPrice(data.discount, data.price_au)}
      hasDiscount={hasDiscountPrice(data.discount)}
      key={data.handle}
    />
  ));

  /**
   * Popup display every card
   */
  const displayCartPopupProducts = cartItems.map((data) => (
    <CartProductPopupCard
      imgurl={data.image_url}
      id={data.id}
      name={data.name}
      quantity_in_cart={data.quantity_in_cart}
      deleteFromCart={() => deleteFromCart(data.handle)}
      handle={data.handle}
      token={token}
      price={data.price_au}
      discount={discountedPrice(data.discount, data.price_au)}
      hasDiscount={hasDiscountPrice(data.discount)}
      key={data.handle}
    />
  ));

  /**
   * Cart page styling
   */
  const reviewStyle = () => {
    setFormColor('#DFDFDF');
    setCheckoutColor('#DFDFDF');
  };
  const formStyle = () => {
    setFormColor('#00000');
    setCheckoutColor('#DFDFDF');
  };
  const checkoutStyle = () => {
    setFormColor('#00000');
    setCheckoutColor('#00000');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        sum,
        setSum,
        deleteFromCart,
        quantity,
        setQuantity,
        getCartData,
        displayCartProducts,
        displayCheckoutProducts,
        displayCartPopupProducts,
        checked,
        setChecked,
        email,
        setEmail,
        name,
        setName,
        address,
        setAddress,
        postcode,
        setPostcode,
        city,
        setCity,
        state,
        setState,
        phone,
        setPhone,
        cardName,
        setCardName,
        cardNumber,
        setCardNumber,
        cardExpiry,
        setCardExpiry,
        cardCvc,
        setCardCvc,
        formFilled,
        setFormFilled,
        coupon,
        setCoupon,
        method,
        setMethod,
        shippingFee,
        setShippingFee,
        message,
        setMessage,
        formColor,
        setFormColor,
        checkoutColor,
        setCheckoutColor,
        confirmTransaction,
        applyCoupon,
        addToCol,
        setAddToCol,
        view,
        setView,
        reviewStyle,
        formStyle,
        checkoutStyle,
        afterDiscount,
        setAfterDiscount,
        hasDiscount,
        setHasDiscount,
        discountString,
        setDiscountString,
        handleAddToCollectionBox,
        resetCartState,
        setFriendName,
        friendName,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
