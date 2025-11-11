import React, {useState, useEffect } from 'react'
import { FaCogs, FaHeart, FaHome, FaShoppingCart, FaSignInAlt, FaSignOutAlt, FaTruck, FaUser, FaUserCircle, FaUserPlus, FaUserShield, FaUtensils } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/layout.css';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const PublicLayout = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")

  const {cartCount, setCartCount} = useCart();
  const {wishlistCount, setWishlistCount} = useWishlist();

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId")
  const name = localStorage.getItem("userName")

  const fetchCartCount = async() =>{
    if(userId){
      try{
        const response = await fetch(`http://127.0.0.1:8000/api/cart/${userId}/`)
        const data = await  response.json();
        setCartCount(data.length)
      }
      catch(error){
        console.error("Error fetching cart count:", error);
      }
    }
  }
  const fetchWishlistCount = async() =>{
    if(userId){
      try{
        const response = await fetch(`http://127.0.0.1:8000/api/wishlist/${userId}/`)
        const data = await  response.json();
        setWishlistCount(data.length)
      }
      catch(error){
        console.error("Error fetching Wishlist Count:", error);
      }
    }
  }

  useEffect(()=>{
    if(userId){
      setIsLoggedIn(true);
      setUserName(name);
      fetchCartCount();
      fetchWishlistCount();
    }
  },[userId, name])
 
  const handleLogout =() =>{
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setCartCount(0);
    setWishlistCount(0);
    navigate('/login');

  }

  return (
    <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <Link className="navbar-brand fw-bold" to="/"><FaUtensils className='me-1' /> Food Ordering System</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item mx-1">
                  <Link className="nav-link" to="/"><FaHome className='me-1' /> Home</Link>
                </li>
                <li className="nav-item mx-1">
                  <Link className="nav-link" to="/food_menu"><FaUtensils className='me-1' /> Menu</Link>
                </li>
                <li className="nav-item mx-1">
                  <Link className="nav-link" to="/track"><FaTruck className='me-1' /> Track</Link>
                </li>
                {!isLoggedIn ? (
                  <>
                    <li className="nav-item mx-1">
                      <Link className="nav-link" to="/register"><FaUserPlus className='me-1' /> Register</Link>
                    </li>
                    <li className="nav-item mx-1">
                      <Link className="nav-link" to="/login"><FaSignInAlt className='me-1' /> Login</Link>
                    </li>
                    <li className="nav-item mx-1">
                      <Link className="nav-link" to="/admin-login"><FaUserShield className='me-1' /> Admin</Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item mx-1">
                      <Link className="nav-link" to="/my-orders"><FaUser className='me-1' /> My Orders</Link>
                    </li>
                    <li className="nav-item mx-1">
                      <Link className="nav-link" to="/cart"><FaShoppingCart className='me-1' /> 
                        Carts
                        {cartCount > 0 && (
                          <span className="badge bg-danger ms-1">{cartCount}</span>
                        )}
                      </Link>
                    </li>
                    <li className="nav-item mx-1">
                      <Link className="nav-link" to="/wishlist"><FaHeart className='me-1' /> 
                        Wishlist
                        {wishlistCount > 0 && (
                          <span className="badge bg-danger ms-1">{wishlistCount}</span>
                        )}
                      </Link>
                    </li>
                    <li className="nav-item dropdown">
                      <a className="nav-link dropdown-toggle text-capitalize" id="navbarDropdown" href="/" role="button" data-bs-toggle="dropdown">
                      <FaUserCircle className='me-1' /> {userName}
                      </a>
                      <ul className="dropdown-menu">
                        <li><Link className="dropdown-item" to="/profile"><FaUser className='me-1' /> Profile</Link></li>
                        <li><Link className="dropdown-item" to="/change-password"><FaCogs className='me-1' />Settings</Link></li>
                        <li><hr className="dropdown-divider"/></li>
                        <li><button className="dropdown-item" onClick={handleLogout}><FaSignOutAlt className='me-1' />Logout</button></li>
                      </ul>
                    </li>
                    
                    
                  </>
                )}

              </ul>
            </div>
          </div>
        </nav>


        <div>
            {children}
        </div>


        <footer className='text-center py-3 mt-5'>
          <div className="container">
            <p>&copy; 2025 Food Ordering System. All rights reserved</p>
          </div>
        </footer>
    </div>
  )
}

export default PublicLayout