import React, { useState } from 'react'
import PublicLayout from './PublicLayout'
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
const Register = () => {

    const [formData, setFormData] = useState({
        firstname : '',
        lastname : '',
        mobilenumber : '',
        email : '',
        password : '',
        repeatpassword : '',
    })

    const handleChange=(e)=>{
        const {name, value} = e.target;

        setFormData((prev)=>({
            ...prev,
            [name]:value
        }));
    }

    const navigate = useNavigate();

    const handleSumbit = async(e) => {
        e.preventDefault();

        const {firstname, lastname, mobilenumber, email, password, repeatpassword} = formData
        if(password!==repeatpassword){
            toast.error('Password and Confirm Password do not match.');
            return;
        }
        try{

            const response = await fetch('http://127.0.0.1:8000/api/register/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({firstname, lastname, mobilenumber, email, password}),
            });
            
            const result = await response.json();
    
            if (response.status === 201) {
                toast.success(result.message ||'You have successfully registered.');
                setFormData({
                    firstname : '',
                    lastname : '',
                    mobilenumber : '',
                    email : '',
                    password : '',
                    repeatpassword : '',
                });
                setTimeout(()=>{
                    navigate('/login')
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

  return (
    <PublicLayout>
        <ToastContainer position='top-right' autoClose={2000}/>
        <div className='container py-5'>
            <div className="row shadow-lg rounded-4">
                <div className="col-md-6 p-4">
                    <h3 className='text-center text-primary mb-4'>
                        <i className='fa fa-user-plus me-2'></i>User Registeration
                    </h3>

                    <form onSubmit={handleSumbit}>
                        <div className="mb-3">
                            
                            <input name='firstname' type='text' value={formData.firstname} onChange={handleChange} className='form-control' placeholder='Enter your First Name' required/>
                        </div>
                        <div className="mb-3">
                            
                            <input name='lastname' type='text' value={formData.lastname} onChange={handleChange} className='form-control' placeholder='Enter your Last Name' />
                        </div>
                        <div className="mb-3">
                            
                            <input name='email' type='email' value={formData.email} onChange={handleChange} className='form-control' placeholder='Enter your Email' required/>
                        </div>
                        <div className="mb-3">
                            
                            <input name='mobilenumber' type='number' value={formData.mobilenumber} onChange={handleChange} className='form-control' placeholder='Enter your Mobile Number' required/>
                        </div>
                        <div className="mb-3">
                            
                            <input name='password' type='password' value={formData.password} onChange={handleChange} className='form-control' placeholder='Enter your Password' required/>
                        </div>
                        <div className="mb-3">
                            
                            <input name='repeatpassword' type='password' value={formData.repeatpassword} onChange={handleChange} className='form-control' placeholder='Repeat your Password' required/>
                        </div>

                        <button className='btn btn-primary w-100'>
                            <i className='fa fa-user-check me-2'></i>Submit
                        </button>
                    </form>
                    
                </div>
                <div className="col-md-6 d-flex align-items-center justify-content-center">
                    <div className='p-4 text-center'>
                        <img src="/images/registration.jpg" alt="registration" className='img-fluid' style={{maxHeight:'400px'}} />
                        <h5 className='mt-3 text-primary'>Registration is fast, secure and free.</h5>
                        <p className='text-muted small'>
                            Join our food family and enjoy  delicious food delivered to your door!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </PublicLayout>
  )
}

export default Register