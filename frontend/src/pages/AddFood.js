import React, { useState, useEffect, useRef } from 'react'
import AdminLayout from '../components/AdminLayout'
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddFood = () => {

    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        category :'',
        item_name : '',
        item_price : '',
        item_description : '',
        image : null,
        item_quantity : '',
        
    });

    const fileInputRef = useRef(null);


    useEffect(()=>{
        fetch('http://127.0.0.1:8000/api/list-categories/')
        .then(res=>res.json())
        .then(data=> {
            setCategories(data)
        })
    },[]);

    const handleChange=(e)=>{
        const {name, value} = e.target;

        setFormData((prev)=>({
            ...prev,
            [name]:value
        }));
    }


    const handleFileChange=(e)=>{
        
        setFormData((prev)=>({
            ...prev,
            image:e.target.files[0]
        }));
    }

    const handleSumbit = async(e) => {
        e.preventDefault();
        const data = new FormData();

        data.append("category", formData.category)
        data.append("item_name", formData.item_name)
        data.append("item_description", formData.item_description)
        data.append("item_quantity", formData.item_quantity)
        data.append("item_price", parseFloat(formData.item_price))
        data.append("image", formData.image)
        
        try{
            const response = await fetch('http://127.0.0.1:8000/api/add-food-item/', {
                method: 'POST',
                body: data,
            });
            
            const result = await response.json();
    
            if (response.status === 201) {
                toast.success(result.message);
                setFormData({
                    category :'',
                    item_name : '',
                    item_description : '',
                    item_price : '',
                    image : null,
                    item_quantity : '',
                });
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''; // clear file input
                }
    
            } 
            else {
                toast.error(result.message);
            }
        }
        catch(error){
            console.error(error)
            toast.error("Error connection to server");
        }
    }

  return (
    <AdminLayout>
        <ToastContainer position='top-right' autoClose={2000}/>
        <div className='row'>
            <div className='col-md-8'>
                <div className='p-4 shadow-sm rounded'>
                    <h4 className='mb-4'>
                        <i className='fas fa-plus-circle text-primary me-2'></i>Add Food Item
                    </h4>

                    <form onSubmit={handleSumbit} encType='multipart/form-data'>
                        <div className='mb-3'>
                            <label className='form-label'>Food Category</label>
                            <select name='category' type="text" className='form-select' value={formData.category} onChange={handleChange} required>
                                <option value="">Select Category</option>

                                {categories.map((cat,index)=>(
                                    <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                                ))}
                            </select>                           
                        </div>

                        <div className='mb-3'>
                            <label className='form-label'>Food Item Name</label>
                            <input name='item_name' type="text" className='form-control' value={formData.item_name} onChange={handleChange} placeholder='Enter food item name' required/>                           
                        </div>

                        <div className='mb-3'>
                            <label className='form-label'>Description</label>
                            <textarea name='item_description' className='form-control' value={formData.item_description} onChange={handleChange} placeholder='Enter description' required>
                                </textarea>                         
                        </div>

                        <div className='mb-3'>
                            <label className='form-label'>Quantity</label>
                            <input name='item_quantity' type="text" className='form-control' value={formData.item_quantity} onChange={handleChange} placeholder='e.g. 2 pcs / Large' required/>                           
                        </div>

                        <div className='mb-3'>
                            <label className='form-label'>Price(₹)</label>
                            <input name='item_price' type="number" step={.01} className='form-control' value={formData.item_price}  onChange={handleChange} placeholder='Enter price' required/>                           
                        </div>

                        <div className='mb-3'>
                            <label className='form-label'>Image</label>
                            <input name='image' ref={fileInputRef} type="file" accept='image/*' className='form-control'  onChange={handleFileChange} required/>                           
                        </div>
                        
                        <button type='submit' className='btn btn-primary  mt-2'>
                            <i className='fas fa-plus me-2'></i>Add Food Item
                        </button>
                    </form>
                </div>
            </div>
            <div className='col-md-4 d-flex justify-content-center align-items-center'>
                <i className='fas fa-pizza-slice' style={{fontSize:'180px', color:'#e5e5e5'}}></i>
            </div>
        </div>
    </AdminLayout>
  )
}

export default AddFood









// code for both add and edit api

// import React, { useState, useEffect, useRef } from 'react'
// import AdminLayout from '../components/AdminLayout'
// import {toast, ToastContainer} from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useNavigate, useParams } from "react-router-dom";

// const AddFood = ({isEdit}) => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [categories, setCategories] = useState([]);

//     useEffect(() => {
//         fetch(`http://127.0.0.1:8000/api/get-food-item/${id}/`)
//         .then(res => res.json())
//         .then(data => {
//             setFormData(data);
//         })
//         .catch((error) => {
//             console.error(error);
//             toast.error("Error fetching food data");
//         });
//     }, [id]);

//     const [formData, setFormData] = useState({
//         category :'',
//         item_name : '',
//         item_price : '',
//         item_description : '',
//         image : null,
//         item_quantity : '',
        
//     });

//     const fileInputRef = useRef(null);


//     useEffect(()=>{
//         fetch('http://127.0.0.1:8000/api/list-categories/')
//         .then(res=>res.json())
//         .then(data=> {
//             setCategories(data)
//         })
//     },[]);

//     const handleChange=(e)=>{
//         const {name, value} = e.target;

//         setFormData((prev)=>({
//             ...prev,
//             [name]:value
//         }));
//     }


//     const handleFileChange=(e)=>{
        
//         setFormData((prev)=>({
//             ...prev,
//             image:e.target.files[0]
//         }));
//     }

//     const handleSumbit = async(e) => {
//         e.preventDefault();
//         const data = new FormData();

//         data.append("category", formData.category)
//         data.append("item_name", formData.item_name)
//         data.append("item_description", formData.item_description)
//         data.append("item_quantity", formData.item_quantity)
//         data.append("item_price", parseFloat(formData.item_price))
//         data.append("image", formData.image)
        
//         try{
//             const api = !isEdit ? 'http://127.0.0.1:8000/api/add-food-item/' : `http://127.0.0.1:8000/api/edit-food-item/${id}/`
//             const response = await fetch(api, {
//                 method: 'POST',
//                 body: data,
//             });
            
//             const result = await response.json();
    
//             if (response.status === 201 || response.status === 200) {
//                 toast.success(result.message);
//                 // setFormData({
//                 //     category :'',
//                 //     item_name : '',
//                 //     item_description : '',
//                 //     item_price : '',
//                 //     image : null,
//                 //     item_quantity : '',
//                 // });
//                 // if (fileInputRef.current) {
//                 //     fileInputRef.current.value = ''; // clear file input
//                 // }
//                 navigate('/manage-food');
//             } 
//             else {
//                 toast.error(result.message);
//             }
//         }
//         catch(error){
//             console.error(error)
//             toast.error("Error connection to server");
//         }
//     }

//   return (
//     <AdminLayout>
//         <ToastContainer position='top-right' autoClose={2000}/>
//         <div className='row'>
//             <div className='col-md-8'>
//                 <div className='p-4 shadow-sm rounded'>
//                     <h4 className='mb-4'>
//                         <i className='fas fa-plus-circle text-primary me-2'></i>{!isEdit ? "Add Food Item": "Edit Food Item"}
//                     </h4>

//                     <form onSubmit={handleSumbit} encType='multipart/form-data'>
//                         <div className='mb-3'>
//                             <label className='form-label'>Food Category</label>
//                             <select name='category' type="text" className='form-select' value={formData.category} onChange={handleChange} required>
//                                 <option value="">Select Category</option>

//                                 {categories.map((cat,index)=>(
//                                     <option key={cat.id} value={cat.id}>{cat.category_name}</option>
//                                 ))}
//                             </select>                           
//                         </div>

//                         <div className='mb-3'>
//                             <label className='form-label'>Food Item Name</label>
//                             <input name='item_name' type="text" className='form-control' value={formData.item_name} onChange={handleChange} placeholder='Enter food item name' required/>                           
//                         </div>

//                         <div className='mb-3'>
//                             <label className='form-label'>Description</label>
//                             <textarea name='item_description' className='form-control' value={formData.item_description} onChange={handleChange} placeholder='Enter description' required>
//                                 </textarea>                         
//                         </div>

//                         <div className='mb-3'>
//                             <label className='form-label'>Quantity</label>
//                             <input name='item_quantity' type="text" className='form-control' value={formData.item_quantity} onChange={handleChange} placeholder='e.g. 2 pcs / Large' required/>                           
//                         </div>

//                         <div className='mb-3'>
//                             <label className='form-label'>Price(₹)</label>
//                             <input name='item_price' type="number" step={.01} className='form-control' value={formData.item_price}  onChange={handleChange} placeholder='Enter price' required/>                           
//                         </div>

//                         <div className='mb-3'>
//                             <label className='form-label'>Image</label>
//                             <input name='image' ref={fileInputRef} type="file" accept='/image*' className='form-control'  onChange={handleFileChange} required/>                           
//                         </div>
                        
//                         <button type='submit' className='btn btn-primary  mt-2'>
//                             <i className='fas fa-plus me-2'></i>{!isEdit ? "Add Food Item":"Save"}
//                         </button>
//                     </form>
//                 </div>
//             </div>
//             <div className='col-md-4 d-flex justify-content-center align-items-center'>
//                 <i className='fas fa-pizza-slice' style={{fontSize:'180px', color:'#e5e5e5'}}></i>
//             </div>
//         </div>
//     </AdminLayout>
//   )
// }

// export default AddFood