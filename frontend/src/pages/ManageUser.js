import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { Link, useNavigate } from 'react-router-dom'
import { CSVLink } from 'react-csv'
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageUser = () => {

    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const navigate = useNavigate();
    const adminUser = localStorage.getItem("adminUser");

    useEffect(()=>{
        if (!adminUser) {
            navigate("/admin-login");
            return;
        }


        fetch('http://127.0.0.1:8000/api/users/')
        .then(res=>res.json())
        .then(data=> {
            setUsers(data)
            setAllUsers(data)
        })
    },[]);

    const handleSearch = (s)=>{
        const keyword = s.toLowerCase();
        if(!keyword){
            setUsers(allUsers);
        }
        else{
            const filtered = users.filter((u)=>
                u.first_name.toLowerCase().includes(keyword) ||
                u.last_name.toLowerCase().includes(keyword) ||
                u.email.toLowerCase().includes(keyword)
            );
            setUsers(filtered);
        }
    }
    const handleDelete = (id)=>{
        
        if(window.confirm("Are you sure you want to delete this User?")){
            
            fetch(`http://127.0.0.1:8000/api/delete_user/${id}/`,{
                method:'DELETE',
            })
            .then(res=>{
                if(res.status===200){
                    toast.success("User deleted successfully");
                    const updatedUsers = users.filter((user)=>user.id !== id);

                    setUsers(updatedUsers);
                }
            })
            .catch(error=>{
                console.error(error);
                toast.error("Error deleting User");
            });
        }
        
    }

  return (
    <AdminLayout>
        <ToastContainer position='top-right' autoClose={2000}/>
        <div>
            <h3 className='text-center text-primary mb-4'>
                <i className='fas fa-list-alt me-1'></i> 
                Manage Users
            </h3>

            <h5 className='text-end text-muted'>
                <i className='fas fa-database me-1'></i>Total Users
                <span className='ms-2 badge bg-success'>{users.length}</span>
            </h5>

            <div className='mb-3 d-flex justify-content-between'>
                <input type='text' className='form-control w-50' placeholder='Search by name or email...' onChange={(e)=>handleSearch(e.target.value)}></input>

                <CSVLink data={users} className='btn btn-success' filename={"users_list.csv"}>
                    <i className='fas fa-file-csv me-2'></i>Export to CSV
                </CSVLink>
            </div>

            <table className='table table-bordered table-hover table-striped'>
                <thead className='table-dark'>
                    <tr>
                        <th>S.No</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index)=>(
                    <tr key={user.id}>
                        <td>{index+1}</td>
                        <td>{user.first_name}</td>
                        <td>{user.last_name}</td>
                        <td>{user.mobile}</td>
                        <td>{user.email}</td>
                        <td>
                            <button onClick={()=>handleDelete(user.id)} className='btn btn-sm btn-danger'> 
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

export default ManageUser