import React, {useState} from 'react'

const CancelOrderModal = ({show, handleClose, orderNumber, paymentMode}) => {

    const [remark, setRemark] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleCancelOrder = async () => {
        // Implement cancel order logic here
        if(!remark.trim()){ 
            setError('Please provide a reason for cancellation.');
            return;
        }
        try{
            const response = await fetch(`http://127.0.0.1:8000/api/cancel_order/${orderNumber}/`,{
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({remark: remark}), 
            })
    
            const data = await response.json();
            if(response.ok){
                let message = data.message || 'Order cancelled successfully.';
                if(paymentMode === 'online'){
                    message += '\n Since you paid online, Refund will be processed to your account within 5-7 business days.';
                }
                setMessage(message);
                setRemark('');
                setError('');
            }
            else{
                setError(data.message || 'Failed to cancel order. Please try again.');
            }
        }
        catch(error){
            setError('Error connecting to server.');
            return;
        }
    }   

  return (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabindex="-1">
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Cancel Order #{orderNumber}</h5>
                <button type="button" className="btn-close" onClick={handleClose} ></button>
            </div>
            <div className="modal-body">
                {message ? (
                    <div className="alert alert-success">
                        {message}
                    </div>
                ):(
                    <>
                     <label className='form-label'>Reason for cancellation</label>
                     <textarea 
                        className='form-control mb-2' 
                        rows='4' 
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        placeholder='Enter your reason here...'
                     >

                     </textarea>
                        {error && <div className='text-danger mb-2'>{error}</div>}
                     
                    </>
                )}
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClickCapture={handleClose}>Close</button>
                <button type="button" onClick={handleCancelOrder} className="btn btn-danger">Cancel Order</button>
            </div>
            </div>
        </div>
    </div>
  )
}

export default CancelOrderModal