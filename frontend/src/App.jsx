/* eslint-disable */
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider, AdminProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import { ShopProvider } from './context/ShopContext';
import { RecoProvider } from './context/RecoContext';
import { TransProvider } from './context/TransContext';
import { AlertProvider } from './context/AlertContext';
import { QuizProvider } from './context/QuizContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Popup from './components/Popup';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import MyCollectionPage from './pages/MyCollectionPage';
import SalePage from './pages/SalePage';
import CartPage from './pages/CartPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import EditProductPage from './pages/EditProductPage';
import AdminPortalPage from './pages/AdminPortalPage';
import SingleItemPage from './pages/SingleItemPage';
import MyAccountPage from './pages/MyAccountPage';
import SingleOrderPage from './pages/SingleOrderPage';
import SingleAdminPage from './pages/SingleAdminPage';
import Image from './components/Image';
import SignupQuiz from './components/SignupQuiz';
import FAQ from './pages/FAQ';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <AlertProvider>
            <QuizProvider>
              <AdminProvider>
                <ShopProvider>
                  <RecoProvider>
                    <TransProvider>
                      <CartProvider>
                        <NavBar />
                        <SignupQuiz />
                        <Popup />
                        <Switch>
                          <Route path="/" exact component={HomePage} />
                          <Route
                            path="/shop/:id"
                            component={SingleItemPage}
                            handler={Image}
                          />
                          <Route path="/shop" component={ShopPage} />
                          <Route
                            path="/mycollection"
                            component={MyCollectionPage}
                          />
                          <Route path="/sale" component={SalePage} />
                          <Route
                            path="/adminportal/:order_number"
                            component={SingleAdminPage}
                          />
                          <Route
                            path="/adminportal"
                            component={AdminPortalPage}
                          />
                          <Route path="/cart" component={CartPage} />
                          <Route path="/register" component={RegisterPage} />
                          <Route path="/login" component={LoginPage} />
                          <Route
                            path="/forgotpassword"
                            component={ForgotPasswordPage}
                          />
                          <Route
                            path="/resetpassword"
                            component={ResetPasswordPage}
                          />
                          <Route
                            path="/editproduct/:id"
                            component={EditProductPage}
                            handler={Image}
                          />
                          <Route
                            path="/myaccount/:order_number"
                            component={SingleOrderPage}
                          />
                          <Route path="/myaccount" component={MyAccountPage} />
                          <Route path="/faq" component={FAQ} />
                        </Switch>
                        <Footer />
                      </CartProvider>
                    </TransProvider>
                  </RecoProvider>
                </ShopProvider>
              </AdminProvider>
            </QuizProvider>
          </AlertProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}
