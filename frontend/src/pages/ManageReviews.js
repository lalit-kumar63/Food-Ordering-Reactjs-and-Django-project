import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useNavigate } from 'react-router-dom'
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageReviews = () => {
    const [reviews, setReviews] = useState([]);
    const adminUser = localStorage.getItem('adminUser');

    const navigate = useNavigate();

    useEffect(()=>{
        if (!adminUser){
            navigate('/admin-login')
            return;
        }

        fetch('http://127.0.0.1:8000/api/all_reviews/')
        .then(res=>res.json())
        .then(data=> {
            setReviews(data)
        })
    },[]);

    const handleDelete = (id)=>{
            
        if(window.confirm("Are you sure you want to delete this review?")){
            
            fetch(`http://127.0.0.1:8000/api/delete_review/${id}/`,{
                method:'DELETE',
            })
            .then(res=>{
                if(res.status===200){
                    toast.success("Review deleted successfully");
                    const updatedReviews = reviews.filter((r)=>r.id !== id);

                    setReviews(updatedReviews);
                }
            })
            .catch(error=>{
                console.error(error);
                toast.error("Error deleting review");
            });
        }
            
    }
  return (
    <AdminLayout>
        <ToastContainer position='top-right' autoClose={2000}/>
        <div>
            <h3 className='text-center text-primary mb-4'>
                <i className='fas fa-star me-1'></i> 
                Manage Reviews
            </h3>

            <h5 className='text-end text-muted'>
                <i className='fas fa-database me-1'></i>Total Reviews
                <span className='ms-2 badge bg-success'>{reviews.length}</span>
            </h5>

            

            <table className='table table-bordered table-hover table-striped'>
                <thead className='table-dark'>
                    <tr>
                        <th>S.No</th>
                        <th>Food Item</th>
                        <th>User</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map((r, index)=>(
                    <tr key={r.id}>
                        <td>{index+1}</td>
                        <td>{r.food_name} </td>
                        <td>{r.user_name} </td>
                        <td>
                            {[...Array(5)].map((_,i)=>(
                                <i key={i} className={`text-warning fa-star ${i<r.rating ? "fas" : "far"}`}></i>
                            ))}
                        </td>
                
                        <td>{r.comment} </td>
                        <td>{new Date(r.created_at).toLocaleString()} </td>
                        <td>
                            <button onClick={()=>handleDelete(r.id)} className='btn btn-sm btn-danger me-2'> 
                                <i className='fas fa-trash-alt me-1 '></i>Delete
                            </button>
                            
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>

        </div>
    </AdminLayout>
  )
}

export default ManageReviews