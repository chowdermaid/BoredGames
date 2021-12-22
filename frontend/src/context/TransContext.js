import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { getAllUserOrders, getUserOrder } from '../api/userApi';
import {
  addCouponApi,
  deleteCouponApi,
  getAllOrdersAdmin,
  getCouponsApi,
  getUserOrderAdmin,
  patchUserOrderAdmin,
} from '../api/adminProductApi';
import { useAuth } from './AuthContext';
import { useAlert } from './AlertContext';
import UserAllOrdersCard from '../cards/UserAllOrdersCard';
import UserOrderCard from '../cards/UserOrderCard';
import AdminAllOrdersCard from '../cards/AdminAllOrdersCard';
import CouponCard from '../cards/CouponCard';

const TransContext = React.createContext({});

export const TransProvider = ({ children }) => {
  const history = useHistory();
  const { token } = useAuth();
  const { handlePopupClick, setLoading, setLoading2 } = useAlert();
  // For view all orders
  const [orderItems, setOrderItems] = React.useState([]);
  const [adminItems, setAdminItems] = React.useState([]);
  const [sortStatusUser, setSortStatusUser] = React.useState('all');
  const [sortStatusAdmin, setSortStatusAdmin] = React.useState('all');
  // For single order page
  const [user, setUser] = React.useState('');
  const [date, setDate] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [city, setCity] = React.useState('');
  const [pnumber, setPnumber] = React.useState('');
  const [name, setName] = React.useState('');
  const [postcode, setPostcode] = React.useState('');
  const [shipping, setShipping] = React.useState('');
  const [state, setState] = React.useState('');
  const [creditCard, setCreditCard] = React.useState('');
  const [cost, setCost] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [orderProducts, setOrderProducts] = React.useState([]);
  const [adminOrderProducts, setAdminOrderProducts] = React.useState([]);
  const [adminStatus, setAdminStatus] = React.useState('');
  // For admin coupons
  const [code, setCode] = React.useState('');
  const [voucher, setVoucher] = React.useState('');
  const [coupons, setCoupons] = React.useState([]);

  /**
   * Gets all user orders
   */
  const getAllOrders = async () => {
    try {
      const data = await getAllUserOrders({ token: token });
      if (data) {
        setOrderItems(data);
        setLoading(false);
      }
    } catch (error) {
      handlePopupClick(error.message.toString(), 'error', 'top', 'center');
    }
  };

  /**
   * Gets specific user order
   */
  const getOrderDetails = async (order_number) => {
    try {
      const data = await getUserOrder({
        token: token,
        order_number: order_number,
      });
      setUser(data.user);
      setDate(data.date_purchased);
      setAddress(data.delivery.address);
      setCity(data.delivery.city);
      setPnumber(data.delivery.contact_number);
      setName(data.delivery.name);
      setPostcode(data.delivery.post_code);
      setShipping(data.delivery.shipping_method);
      setState(data.delivery.state);
      setCreditCard(data.payment.number);
      setCost(data.discount_cost.toFixed(2));
      setStatus(data.status);
      setOrderProducts(data.products);
      setLoading(false);
    } catch (error) {
      handlePopupClick(error.message.toString(), 'error', 'top', 'center');
    }
  };

  /**
   * Gets every user's orders
   */
  const getAllAdminOrders = async () => {
    try {
      const data = await getAllOrdersAdmin();
      if (data) {
        setAdminItems(data);
        setLoading(false);
      }
    } catch (error) {
      handlePopupClick(error.message.toString(), 'error', 'top', 'center');
    }
  };

  /**
   * Get specific user order
   */
  const getOrderDetailsAdmin = async (order_number) => {
    try {
      const data = await getUserOrderAdmin({ order_number: order_number });
      if (data) {
        setUser(data.user);
        setDate(data.date_purchased);
        setAddress(data.delivery.address);
        setCity(data.delivery.city);
        setPnumber(data.delivery.contact_number);
        setName(data.delivery.name);
        setPostcode(data.delivery.post_code);
        setShipping(data.delivery.shipping_method);
        setState(data.delivery.state);
        setCreditCard(data.payment.number);
        setCost(data.discount_cost.toFixed(2));
        setStatus(data.status);
        setAdminOrderProducts(data.products);
        setLoading(false);
      }
    } catch (error) {
      handlePopupClick(error.message.toString(), 'error', 'top', 'center');
    }
  };

  /**
   * Gets all coupons
   */
  const getAllCoupons = async () => {
    try {
      const data = await getCouponsApi({});
      if (data) {
        setCoupons(data);
        setLoading(false);
      }
    } catch (error) {
      handlePopupClick(error.message.toString(), 'error', 'top', 'center');
    }
  };

  /**
   * Adds a coupon
   */
  const addCoupon = async () => {
    setLoading2(true);
    try {
      const data = await addCouponApi({ code, voucher });
      if (data) {
        handlePopupClick('Added coupon!', 'success', 'top', 'center');
        await getAllCoupons();
        setLoading2(false);
      }
    } catch (error) {
      handlePopupClick(error.message.toString(), 'error', 'top', 'center');
      setLoading2(false);
    }
  };

  /**
   * Deletes a coupon
   */
  const deleteCoupon = async (code) => {
    try {
      const data = await deleteCouponApi({ code });
      if (data) {
        handlePopupClick('Deleted coupon!', 'success', 'top', 'center');
        await getAllCoupons();
      }
    } catch (error) {
      handlePopupClick(error.message.toString(), 'error', 'top', 'center');
    }
  };

  /**
   * Function for admin to update status of order
   */
  const editShippingStatusAdmin = async (order_number) => {
    try {
      const data = await patchUserOrderAdmin({
        order_number: order_number,
        status: adminStatus,
      });
      if (data) {
        setStatus(adminStatus);
        handlePopupClick(
          'Successfully updated order status!',
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
   * Function for admin to search specific order and navgiate to page
   */
  const navToOrderAdmin = async (order_number) => {
    try {
      const data = await getUserOrderAdmin({ order_number: order_number });
      if (data) {
        history.push(`/adminportal/${order_number}`);
      }
    } catch (error) {
      handlePopupClick(error.message.toString(), 'error', 'top', 'center');
    }
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

  /**
   * Displays user orders list
   */
  /*eslint-disable*/
  const displayUserOrders = orderItems.map((data) => {
    if (sortStatusUser === 'all') {
      return (
        <UserAllOrdersCard
          order_number={data.order_number}
          date_purchased={data.date_purchased}
          cost={data.discount_cost}
          status={data.status}
          view_order={() => getOrderDetails(data.order_number)}
          key={data.order_number}
        />
      );
    } else if (data.status === sortStatusUser) {
      return (
        <UserAllOrdersCard
          order_number={data.order_number}
          date_purchased={data.date_purchased}
          cost={data.discount_cost}
          status={data.status}
          view_order={() => getOrderDetails(data.order_number)}
          key={data.order_number}
        />
      );
    }
  });

  /**
   * Displays products in user order
   */
  const displayOrderProducts = orderProducts.map((data) => (
    <UserOrderCard
      imgurl={data.image_url}
      name={data.name}
      quantity={data.quantity_in_cart}
      price={data.price_au}
      discount={discountedPrice(data.discount, data.price_au)}
      hasDiscount={hasDiscountPrice(data.discount)}
      key={data.handle}
    />
  ));

  /**
   * Displays orders from all users
   */
  /*eslint-disable*/
  const displayAdminOrders = adminItems.map((data) => {
    if (sortStatusAdmin === 'all') {
      return (
        <AdminAllOrdersCard
          order_number={data.order_number}
          user={data.user}
          date_purchased={data.date_purchased}
          cost={data.discount_cost}
          status={data.status}
          key={data.order_number}
        />
      );
    } else if (data.status === sortStatusAdmin) {
      return (
        <AdminAllOrdersCard
          order_number={data.order_number}
          user={data.user}
          date_purchased={data.date_purchased}
          cost={data.discount_cost}
          status={data.status}
          key={data.order_number}
        />
      );
    }
  });

  /**
   * Displays products in user order (admin)
   */
  const displayAdminOrderProducts = adminOrderProducts.map((data) => (
    <UserOrderCard
      imgurl={data.image_url}
      name={data.name}
      quantity={data.quantity_in_cart}
      price={data.price_au}
      discount={discountedPrice(data.discount, data.price_au)}
      hasDiscount={hasDiscountPrice(data.discount)}
      key={data.handle}
    />
  ));

  /**
   * Displays coupons in admin control panel
   */
  const displayCoupons = coupons.map((data) => (
    <CouponCard
      code={data.code}
      voucher={data.voucher_text}
      deleteCoupon={() => deleteCoupon(data.code)}
      key={data.code}
    />
  ));

  return (
    <TransContext.Provider
      value={{
        getAllOrders,
        getAllAdminOrders,
        getOrderDetails,
        getOrderDetailsAdmin,
        displayUserOrders,
        displayAdminOrders,
        displayOrderProducts,
        displayAdminOrderProducts,
        editShippingStatusAdmin,
        user,
        date,
        address,
        city,
        pnumber,
        name,
        postcode,
        shipping,
        state,
        creditCard,
        cost,
        status,
        adminStatus,
        setAdminStatus,
        navToOrderAdmin,
        displayCoupons,
        getAllCoupons,
        setCode,
        setVoucher,
        addCoupon,
        setSortStatusAdmin,
        setSortStatusUser,
      }}
    >
      {children}
    </TransContext.Provider>
  );
};

export const useTrans = () => useContext(TransContext);
