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
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);
    const [editId, setEditId] = useState(null);

    const navigate = useNavigate();

    

    useEffect(()=>{
                
        fetch(`http://127.0.0.1:8000/api/foods/${id}/`)
        .then(res=>res.json())
        .then(data=> {
            setFood(data)
        })

        fetch(`http://127.0.0.1:8000/api/reviews/${id}/`)
        .then(res=>res.json())
        .then(data=> {
            setReviews(data)
        })
                
    },[id]);


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

    const handleReviwSubmit = async() => {
        // if(!userId){
        //     navigate('/login')
        // }
        if (!userId) {
            toast.warning('Please login first to submit review.');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
            return;
        }

        if(rating<1 || rating > 5){
            toast.error('Please select a rating from 1 to 5')
            return;
        }

        const payload = {
            user_id: userId,
            food_id: id,
            rating,
            comment
        };

        const url = editId ? `http://127.0.0.1:8000/api/review_edit/${editId}/` : `http://127.0.0.1:8000/api/reviews/add/${id}/`;
        const method = editId ? 'PUT' : 'POST';
        try{

            const response = await fetch(url, {
                method,
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify(payload),
            });
            
    
            if (response.ok) {
                toast.success(editId? 'review Updated Successfully' : 'review Submited Successfully' );
                setComment('');
                setRating(0);
                setEditId(null);
                const updatedReviews = await fetch(`http://127.0.0.1:8000/api/reviews/${id}/`).then(res =>res.json());
                setReviews(updatedReviews)
            } 

            else {
                toast.error('Something went wrong.');
            }
        }
        catch(error){
            console.error(error)
            toast.error("Error connection to server");
        }
    }

    const fetchReviews = async() =>{
        const res = await fetch(`http://127.0.0.1:8000/api/reviews/${id}/`)
        const data = await res.json();
        setReviews(data);
    };

    const handleDeleteReview = async(id) =>{
        const confirmDelete = window.confirm('Are you sure to delete?');
        if(!confirmDelete) return;

        const res = await fetch(`http://127.0.0.1:8000/api/review_edit/${id}/`,{
            method: 'DELETE',
        });

        if(res.ok){
            toast.success('Review Deleted Successfully!')
            fetchReviews();
        }
        else{
            toast.error('Failed to delete review.')
        }
    };

    const renderStarts = (count, clickable=false) =>{
        const stars = [];
        for (let i=1; i<=5; i++){
            stars.push(
                <i
                    key={i}
                    className={`fa-star ${i<=(hoveredRating || count) ? 'fas text-warning' : 'far text-secondary' }`}
                    style={{cursor:clickable ? 'pointer' : 'default', fontSize: '20px', marginRight:'4px'}}
                    onClick={clickable ? ()=> setRating(i) : undefined}
                    onMouseEnter={clickable ? ()=> setHoveredRating(i) : undefined}
                    onMouseLeave={clickable ? ()=> setHoveredRating(0) : undefined}
                >
                </i>
            )
        }
        return stars;
    }

    const handleEditReview = (rev) => {
        setRating(rev.rating);
        setComment(rev.comment);
        setEditId(rev.id);
    }

    if(!food) return <div className='text-center mt-5'>Loading...</div>

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
                <div className="col-md-7 text-primary">
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

            <hr/>
            <div className="mt-5">
                <h4>Customer Reviews</h4>
                {reviews.length === 0 ? (
                    <p className='text-muted fst-italic'>No reviews yet. Be the first to share your thoughts!</p>
                ) : (
                    reviews.map((rev, index)=>(
                        <div key={rev.id} className='border-bottom mb-3 pb-2'>

                            <div className='d-flex justify-content-between'>
                                <div>
                                    <strong>{rev.user_name} </strong> <span className='ms-2'>{renderStarts(rev.rating)} </span>
                                </div>
                                
                                {(rev.user_id === Number(userId)) && (
                                    <div className='text-end'>
                                        <i className='fas fa-edit text-primary me-2'
                                            style={{cursor: 'pointer', fontSize: '14px'}}
                                            title='Edit Review'
                                            onClick={()=>handleEditReview(rev)}
                                        ></i>
                                        <i className='fas fa-trash-alt text-danger me-2'
                                            style={{cursor: 'pointer', fontSize: '14px'}}
                                            title='Delete Review'
                                            onClick={()=>handleDeleteReview(rev.id)}
                                        ></i>
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className='mb-1'>{rev.comment} </p>
                                <p className='text-muted'>{new Date(rev.created_at).toLocaleDateString()} </p>
                            </div>

                        </div>
                    ))
                )}
            </div>
            <div className="mt-5 text-primary">
                <h5>
                    <i className='fas fa-pen me-1'></i> Write a Review
                </h5>
                <div className="mb-3">
                    <label className='form-label'>Your Rating</label>
                    <div>{renderStarts(rating,true ) } </div>
                </div>
                <div className='mb-3'>
                    <textarea className='form-control' 
                        placeholder='Write your review...'
                        rows={3}
                        value={comment}
                        onChange={(e)=>setComment(e.target.value)}
                    />

                </div>
                <button type='submit' className='btn btn-success'
                    onClick={handleReviwSubmit}
                >
                    <i className='fas fa-paper-plane'></i>Submit Review
                </button>
            </div>
        </div>
    </PublicLayout>
  )
}

export default FoodDetail