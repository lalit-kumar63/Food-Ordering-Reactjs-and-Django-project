import React, {useState, useEffect} from 'react'
import PublicLayout from '../components/PublicLayout'
import '../styles/track.css';
import { useParams } from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const TrackOrder = () => {

    const [orderNumber, setOrderNumber] = useState('');
    const [trackingData, setTrackingData] = useState([]);
    const { order_number } = useParams();
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (order_number) {
            setOrderNumber(order_number);
            handleTrack(order_number);
        }
    }, [order_number]);

    const handleTrack = async (order_num) => {
        if(!userId){
              toast.info('Please login first to track your Order.');
              return;
            }
        try{
            const response = await fetch(`http://127.0.0.1:8000/api/track_order/${order_num}/`)
            
    
            if(response.ok){
                const data = await response.json();
                setTrackingData(data);
            }
            else{
            toast.error('Order not found. Please check your order number.');
            }
        }
        catch(error){
            toast.error('Error connecting to server.');
            return;
        }
    }

    const getBadge = (status) => {
        switch(status.toLowerCase()){
            case 'order confirmed': return 'bg-info';
            case 'food being prepared': return 'bg-warning';
            case 'food pickup': return 'bg-primary';
            case 'food delivered': return 'bg-success';
            case 'order cancelled': return 'bg-danger';
            default: return 'bg-dark';       
        }
    }
   

  return (
    <PublicLayout>
        <ToastContainer position='top-center' autoClose={2000}/>
        <div className='container mt-4'>
            <h3 className='text-primary mb-4'><i className='fas fa-map-marker-alt'></i>Track Your Order</h3>
            <div className="input-group mb-3 shadow-sm">
                <span className='input-group-text'>
                    <i className='fas fa-receipt text-muted'></i>
                </span>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Enter your order number" 
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                />
                <button className='btn btn-primary' onClick={() => handleTrack(orderNumber)}>
                    <i className='fas fa-truck me-1'></i> Track
                </button>
            </div>
            {trackingData.length > 0 && (
                <div className='card p-4 border-0 rounded shadow-sm'>
                    <h5 className='mb-4 text-primary'>
                       <i className='fas fa-stream me-1'></i>Order Status Timeline
                    </h5>
                    <div className='d-flex justify-content-between align-items-center mb-5 px-2 position-relative'>
                        <div className="timeline-line"></div>
                        {trackingData.map((entry, index) => (
                            <div key={index} className='text-center flex-fill timeline-step'>
                                <div className={`icon text-white ${getBadge(entry.status)} mx-auto mb-2`} >
                                    <i className='fas fa-check'></i>
                                </div>
                                <small className='d-block fw-bold'>{entry.status}</small>
                                <small className='texted-muted'>{new Date(entry.status_date).toLocaleDateString()}</small>
                            </div>
                        ))}
                    </div>

                    <h6 className='mb-2'>Detailed History</h6>
                    <ul className='list-group'>
                        {trackingData.map((entry, index) => (
                            <li key={index} className='list-group-item d-flex justify-content-between align-items-center'>
                                <div>
                                    <span className={`badge ${getBadge(entry.status)} me-2`}>{entry.status}</span>
                                    <span>{entry.remarks}</span>
                                </div>
                                <small className='text-muted'>{new Date(entry.status_date).toLocaleDateString()}</small>
                                {entry.order_cancelled_by_user && (
                                    <span className={`badge ${getBadge(entry.status)} ms-2`}>Cancelled by User</span>
                                )}
                            </li>
                        ))}

                    </ul>
                    
                </div>
            )} 
             
        </div>
    </PublicLayout>
  )
}

export default TrackOrder