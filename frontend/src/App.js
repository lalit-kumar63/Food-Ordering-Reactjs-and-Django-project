import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from "./pages/Home";
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AddCategory from './pages/AddCategory';
import ManageCategory from './pages/ManageCategory';
import AddFood from './pages/AddFood';
import ManageFood from './pages/ManageFood';
import SearchPage from './pages/SearchPage';
import Register from './components/Register';
import Login from './components/Login';
import FoodDetail from './pages/FoodDetail';
import Cart from './pages/Cart';
import PaymentPage from './pages/PaymentPage';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import ProfilePage from './pages/ProfilePage';
import ChangePassword from './pages/ChangePassword';
import OrdersNotConfirm from './pages/OrdersNotConfirm';
import OrderConfirmed from './pages/OrderConfirmed';
import FoodDelivered from './pages/FoodDelivered';
import FoodbeingPrepared from './pages/FoodbeingPrepared';
import OrderCancelled from './pages/OrderCancelled';
import AllOrders from './pages/AllOrders';
import FoodPickup from './pages/FoodPickup';
import OrderReport from './pages/OrderReport';
import ViewFoodOrder from './pages/ViewFoodOrder';
import SearchOrder from './pages/SearchOrder';
import EditCategory from './pages/EditCategory';
import EditFoodItem from './pages/EditFoodItem';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/admin-login" element={<AdminLogin/>} />
        <Route path="/admin-dashboard" element={<AdminDashboard/>} />
        <Route path="/add-category" element={<AddCategory/>} />
        <Route path="/manage-category" element={<ManageCategory/>} />
        <Route path="/add-food" element={<AddFood/>} />
        <Route path="/manage-food" element={<ManageFood/>} />
        <Route path="/order-not-confirm" element={<OrdersNotConfirm/>} />
        <Route path="/order-confirm" element={<OrderConfirmed/>} />
        <Route path="/order-being-prepared" element={<FoodbeingPrepared/>} />
        <Route path="/order-pickedup" element={<FoodPickup/>} />
        <Route path="/order-delivered" element={<FoodDelivered/>} />
        <Route path="/order-cancelled" element={<OrderCancelled/>} />
        <Route path="/all-orders" element={<AllOrders/>} />

        <Route path="/order-report" element={<OrderReport/>} />
        <Route path="/admin-view-order-detail/:orderNumber" element={<ViewFoodOrder/>} />
        <Route path="/search-order" element={<SearchOrder/>} />


        <Route path="/search" element={<SearchPage/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/food/:id" element={<FoodDetail/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/payment" element={<PaymentPage/>} />
        <Route path="/my-orders" element={<MyOrders/>} />
        <Route path="/order-details/:order_number" element={<OrderDetails/>} />
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="/change-password" element={<ChangePassword/>} />
        <Route path="/edit_category/:id" element={<EditCategory/>} />
        <Route path="/edit_food/:id" element={<EditFoodItem/>} />

        {/* <Route path="/add-food" element={<AddFood isEdit={false}/>} />
        <Route path="/edit_food/:id" element={<AddFood isEdit={true}/>} /> */}
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
