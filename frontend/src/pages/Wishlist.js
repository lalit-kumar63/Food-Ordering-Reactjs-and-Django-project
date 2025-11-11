import React, {useState, useEffect} from 'react'
import PublicLayout from '../components/PublicLayout'
import '../styles/home.css';
import { Link, useNavigate } from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useWishlist } from '../context/WishlistContext';

const Wishlist = () => {

    
    const [wishlist, setWishlist] = useState([]);
    const {wishlistCount, setWishlistCount} = useWishlist();

    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();
    useEffect(() => {
        fetchWishlist();
      }, [userId]);
    
    const fetchWishlist = async() =>{
        if(userId){
            const response = await fetch(`http://127.0.0.1:8000/api/wishlist/${userId}/`)
            const data = await  response.json();
            setWishlist(data);  
        }
    }

    const removeWishlist = async(food_id) => {
       
        try{
          const response = await fetch(`http://127.0.0.1:8000/api/wishlist/remove/`,{
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify({user_id: userId, food_id: food_id}),
          })
    
          if(response.ok){
            
            const updateWishlistCount = await fetch(`http://127.0.0.1:8000/api/wishlist/${userId}/`)
            const wishlistData = await  updateWishlistCount.json();
            setWishlistCount(wishlistData.length)
            fetchWishlist();
            
            toast.success('Removed from wishlist Successfully.');
          }
          else{
            toast.error('Failed to remove from wishlist.');
          }
        }
        catch(error){
          console.error(error);
          toast.error('Error connecting to server.');
          return;
        }
         
      }

  return (
    <PublicLayout>
        <ToastContainer position='top-right' autoClose={2000}/>
        <div className='container my-5'>
        <h2 className='mb-4 text-primary'>My Wishlist</h2>
        
        <div className='row mt-4'>
            {wishlist.length === 0 ? (
                <p className='text-center'>Your wishlist is empty.</p>
                ) : (
                    wishlist.map((item, index)=>(
                        <div key={index} className='col-md-4 mb-4'>
                            <div className="card hovereffect">
                                <div className='position-relative'>
                                <img src={`http://127.0.0.1:8000${item.image}`} alt='Food item'  className='card-img-top' style={{height:'180px'}}/>
                                <i
                                    className="fas fa-heart heart-anim position-absolute top-0 end-0 m-2 text-danger"
                                    style={{
                                    cursor: 'pointer',
                                    background: 'white',
                                    fontSize: '25px',
                                    padding: '4px',
                                    borderRadius: '50%',
                                    }}
                                    onClick={() => removeWishlist(item.food_id)}
                                ></i>
                                </div>
                                <div className='card-body'>
                                    <h5 className='card-title'>
                                        <Link to={`/food/${item.food_id}`}>{item.item_name}</Link>
                                    </h5>
                                    <p className='card-text text-muted'>{item.item_description?.slice(0,40)}... </p>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <span className='fw-bold'>₹ {item.item_price}</span>
                                        
                                        {item.is_available ? (
                                            <Link to={`/food/${item.food_id}`} className='btn btn-outline-primary btn-sm'>
                                                <i className='fas fa-shopping-basket me-1'></i>Order now
                                            </Link>
                                        ):(
                                            <div title='This food item is not available right now. Please try again latter.'>
                                                <button  className='btn btn-outline-secondary btn-sm'>
                                                    <i className='fas fa-times-circle me-1'></i>Currently Unavailable
                                                </button>
                                            </div>
                                        )}
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                    
                
                
            
        
        </div>
    </div>
    </PublicLayout>
  )
}

export default Wishlist