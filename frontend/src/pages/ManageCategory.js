import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { Link, useNavigate } from 'react-router-dom'
import { CSVLink } from 'react-csv'
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageCategory = () => {

    const [categories, setCategories] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const navigate = useNavigate();
    const adminUser = localStorage.getItem("adminUser");

    useEffect(()=>{
        if (!adminUser) {
            navigate("/admin-login");
            return;
        }

        fetch('http://127.0.0.1:8000/api/list-categories/')
        .then(res=>res.json())
        .then(data=> {
            setCategories(data)
            setAllCategories(data)
        })
    },[]);

    const handleSearch = (s)=>{
        const keyword = s.toLowerCase();
        if(!keyword){
            setCategories(allCategories);
        }
        else{
            const filtered = allCategories.filter((c)=>c.category_name.toLowerCase().includes(keyword))
            setCategories(filtered);
        }
    }
    const handleDelete = (id)=>{
        
        if(window.confirm("Are you sure you want to delete this category?")){
            
            fetch(`http://127.0.0.1:8000/api/category-edit-delete/${id}/`,{
                method:'DELETE',
            })
            .then(res=>{
                if(res.status===200){
                    toast.success("Category deleted successfully");
                    const updatedCategories = categories.filter((c)=>c.id !== id);

                    setCategories(updatedCategories);
                }
            })
            .catch(error=>{
                console.error(error);
                toast.error("Error deleting category");
            });
        }
        
    }

  return (
    <AdminLayout>
        <ToastContainer position='top-right' autoClose={2000}/>
        <div>
            <h3 className='text-center text-primary mb-4'>
                <i className='fas fa-list-alt me-1'></i> 
                Manage Food Category
            </h3>

            <h5 className='text-end text-muted'>
                <i className='fas fa-database me-1'></i>Total Categories
                <span className='ms-2 badge bg-success'>{categories.length}</span>
            </h5>

            <div className='mb-3 d-flex justify-content-between'>
                <input type='text' className='form-control w-50' placeholder='Search by category name...' onChange={(e)=>handleSearch(e.target.value)}></input>

                <CSVLink data={categories} className='btn btn-success' filename={"category_list"}>
                    <i className='fas fa-file-csv me-2'></i>Export to CSV
                </CSVLink>
            </div>

            <table className='table table-bordered table-hover table-striped'>
                <thead className='table-dark'>
                    <tr>
                        <th>S.No</th>
                        <th>Category Name</th>
                        <th>Creation Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((cat, index)=>(
                    <tr key={cat.id}>
                        <td>{index+1}</td>
                        <td>{cat.category_name}</td>
                        <td>{new Date(cat.creation_date).toLocaleString()}</td>
                        <td>
                            <Link to={`/edit_category/${cat.id}`} className='btn btn-sm btn-primary me-2'> 
                                <i className='fas fa-edit me-1 '></i>Edit
                            </Link>
                            <button onClick={()=>handleDelete(cat.id)} className='btn btn-sm btn-danger'> 
                                <i className='fas fa-trash-alt me-1'></i>Delete
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

export default ManageCategory