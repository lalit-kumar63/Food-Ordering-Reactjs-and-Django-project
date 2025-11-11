import React, {useState, useEffect} from 'react'
import PublicLayout from '../components/PublicLayout'
import '../styles/home.css';
import { Link, useNavigate } from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useWishlist } from '../context/WishlistContext';

const Home = () => {

  const [foods, setFoods] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const {wishlistCount, setWishlistCount} = useWishlist();

  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(()=>{
             
    fetch(`http://127.0.0.1:8000/api/random_food/`)
    .then(res=>res.json())
    .then(data=> {
        setFoods(data)
    })
              
  },[]);

  useEffect(()=>{
    if(userId){
      fetch(`http://127.0.0.1:8000/api/wishlist/${userId}/`)
      .then(res=>res.json())
      .then(data=> {
        const wishlistIds = data.map(item => item.food_id);
        setWishlist(wishlistIds);
      })
      
    }
              
  },[userId]);

  const toggleWishlist = async(food_id) => {
    if(!userId){
      toast.info('Please login to manage your wishlist.');
      return;
    }

    const isWishlisted = wishlist.includes(food_id);

    const endpoint = isWishlisted ? 'remove' : 'add';

    try{
      const response = await fetch(`http://127.0.0.1:8000/api/wishlist/${endpoint}/`,{
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify({user_id: userId, food_id: food_id}),
      })

      if(response.ok){
        setWishlist(prev=>isWishlisted ? prev.filter(id=>id!==food_id) : [...prev, food_id]);
        const updateWishlistCount = await fetch(`http://127.0.0.1:8000/api/wishlist/${userId}/`)
        const wishlistData = await  updateWishlistCount.json();
        setWishlistCount(wishlistData.length)
        
        toast.success(isWishlisted ? 'Removed from wishlist Successfully.' : 'Added to wishlist Successfully.');
      }
      else{
        const result = await response.json();
        toast.error(result.message ||'Something went wrong.');
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
      <section className='hero py-5 text-center' style={{backgroundImage:"url('/images/pasta-chicken.jpg') "}}>
        <div style={{backgroundColor:"rgba(0,0,0,0.5)", padding:"40px 20px", borderRadius:"10px"}}>
          <h1 className='display-4'>Quick & Hot food, Delivered to You</h1>
          <p className='lead'>Craving something tasty? Let's get it to your door!</p>

          <form method='GET' action="/search" className='d-flex mt-3' style={{maxWidth:'600px', margin:'0 auto'}}>
            <input type='text' name='q' placeholder='I would like to eat...' className='form-control' style={{borderTopRightRadius:0, borderBottomRightRadius:0}} />

            <button className='btn btn-warning px-4' style={{borderTopLeftRadius:0, borderBottomLeftRadius:0}}>Search</button>
          </form>
        </div>
      </section>

      <section className='py-5'>
        <div className="container">
          <h2 className='text-center mb-4'>Most Loved Dishes This Month
            <span className='badge bg-danger ms-2'>Top Picks</span>
          </h2>

          <div className='row mt-4'>
              {foods.length===0 ? (
                  <p className='text-center'>
                      No foods found
                  </p>
              ) : (
                  foods.map((food, index)=>(
                      <div key={food.id} className='col-md-4 mb-4'>
                          <div className="card hovereffect">
                              <div className='position-relative'>
                                <img src={`http://127.0.0.1:8000${food.image}`} alt='Food item'  className='card-img-top' style={{height:'180px'}}/>
                                <i
                                  className={`${wishlist.includes(food.id) ? "fas" : "far"} fa-heart heart-anim position-absolute top-0 end-0 m-2 text-danger`}
                                  style={{
                                    cursor: 'pointer',
                                    background: 'white',
                                    fontSize: '25px',
                                    padding: '4px',
                                    borderRadius: '50%',
                                  }}
                                  onClick={() => toggleWishlist(food.id)}
                                ></i>
                              </div>
                              <div className='card-body'>
                                  <h5 className='card-title'>
                                      <Link to={`/food/${food.id}`}>{food.item_name}</Link>
                                  </h5>
                                  <p className='card-text text-muted'>{food.item_description?.slice(0,40)}... </p>
                                  <div className='d-flex justify-content-between align-items-center'>
                                      <span className='fw-bold'>₹ {food.item_price}</span>
                                      
                                      {food.is_available ? (
                                          <Link to={`/food/${food.id}`} className='btn btn-outline-primary btn-sm'>
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
      </section>

      <section className='py-5 bg-dark text-white'>
        <div className="container text-center">
            <h2>Ordering in 3 Simple Steps</h2>
            <div className="row mt-4">
                <div className="col-md-4"> 
                  <h4>1. Pick a dish you love</h4>
                  <p>Explore hundreds of mouth-watering options and choose what you crave!</p>
                </div>
                <div className="col-md-4"> 
                  <h4>2. Share your location</h4>
                  <p>Tell us where you are, and we'll handle the rest.</p>
                </div>
                <div className="col-md-4"> 
                  <h4>3. Enjoy doorstep delivery</h4>
                  <p>Relex while your meal arrives fast and fresh - pay when it's delivered!</p>
                </div>
            </div>
            <p>Pay easily with Cash on Delivery - hassle-free!</p>
        </div>
      </section>
      <section className='py-5 bg-warning text-center text-dark'>
              <h4>Ready to Satisfy Your Hunger?</h4>
              <Link to="/food_menu" className='btn btn-dark btn-lg'>
              Browse Full Menu
              </Link>
      </section>
    </PublicLayout>
  )
}

export default Home