import React, {useState, useEffect} from 'react'
import PublicLayout from '../components/PublicLayout'

import { useParams, useNavigate } from 'react-router-dom';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FoodDetail = () => {
    const userId = localStorage.getItem('userId');
    const [food, setFood] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    

    useEffect(()=>{
                
    fetch(`http://127.0.0.1:8000/api/foods/${id}/`)
    .then(res=>res.json())
    .then(data=> {
        setFood(data)
    })
                
    },[]);


    const handleAddToCart = async() => {
        // if(!userId){
        //     navigate('/login')
        // }
        if (!userId) {
            toast.error('Login Required First.');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
            return;
        }
        try{

            const response = await fetch('http://127.0.0.1:8000/api/cart/add/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({
                    userId:userId, 
                    foodId:food.id
                }),
            });
            
            const result = await response.json();
    
            if (response.status === 200) {
                toast.success(result.message ||'Item added to cart Successfully.');
                setTimeout(()=>{
                    navigate('/cart')
                },2000)
            } 

            else {
                toast.error(result.message || 'Something went wrong.');
            }
        }
        catch(error){
            console.error(error)
            toast.error("Error connection to server");
        }
    }

    if(!food) return <div>Loading...</div>

  return (
    <PublicLayout>
        <ToastContainer position='top-right' autoClose={2000}/>
        <div className='container py-5'>
            <div className="row">
                <div className="col-md-5 text-center">
                    <Zoom>
                        <img src={`http://127.0.0.1:8000${food.image}`} alt='Food item' style={{width:'100%',maxHeight:'300px'}}/>
                    </Zoom>
                </div>
                <div className="col-md-7">
                    <h2>{food.item_name}</h2>
                    <p className='text-muted'>{food.item_description}</p>
                    <p><strong>Category: </strong> {food.category_name}</p>
                    <h4>₹ {food.item_price}</h4>
                    <p className="mt-3">Shipping: <strong>Free</strong></p>
                    {food.is_available ? (
                        <button className='btn btn-warning btn-lg mt-3 px-4' onClick={handleAddToCart}>
                            <i className='fas fa-cart-plus me-1'></i>Add to Cart
                        </button>
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
    </PublicLayout>
  )
}

export default FoodDetail