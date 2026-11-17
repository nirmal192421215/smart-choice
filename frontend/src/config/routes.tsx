import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Shop from '../pages/Shop';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import OrderSuccess from '../pages/OrderSuccess';
import Orders from '../pages/Orders';
import Account from '../pages/Account';
import Login from '../pages/Login';
import Register from '../pages/Register';
import HowItWorks from '../pages/HowItWorks';
import About from '../pages/About';
import Contact from '../pages/Contact';
import FAQ from '../pages/FAQ';
import Returns from '../pages/Returns';
import Privacy from '../pages/Privacy';
import Terms from '../pages/Terms';
import Admin from '../pages/Admin';
import AdminLogin from '../pages/AdminLogin';
import AdminGuard from '../components/admin/AdminGuard';
import NotFound from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'shop',
        element: <Shop />,
      },
      {
        path: 'product/:slug',
        element: <ProductDetail />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'checkout',
        element: <Checkout />,
      },
      {
        path: 'order-success/:orderId',
        element: <OrderSuccess />,
      },
      {
        path: 'orders',
        element: <Orders />,
      },
      {
        path: 'account',
        element: <Account />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'how-it-works',
        element: <HowItWorks />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'faq',
        element: <FAQ />,
      },
      {
        path: 'returns',
        element: <Returns />,
      },
      {
        path: 'privacy',
        element: <Privacy />,
      },
      {
        path: 'privacy-policy',
        element: <Privacy />,
      },
      {
        path: 'terms',
        element: <Terms />,
      },
      {
        path: 'terms-conditions',
        element: <Terms />,
      },
      {
        path: 'shipping-policy',
        element: <Returns />,
      },
      {
        path: 'admin/login',
        element: <AdminLogin />,
      },
      {
        path: 'admin',
        element: (
          <AdminGuard>
            <Admin />
          </AdminGuard>
        ),
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default router;