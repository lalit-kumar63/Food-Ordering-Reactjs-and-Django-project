import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import {  useNavigate } from 'react-router-dom'

import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../styles/AdminDashboard.css'
import SalesBarChart from '../components/SalesBarChart';
import TopProducts from '../components/TopProducts';
import WeeklySalesChart from '../components/WeeklySalesChart';
import WeeklyUserChart from '../components/WeeklyUserChart';


const AdminDashboard = () => {

  const navigate = useNavigate();
  const adminUser = localStorage.getItem("adminUser");

  const [metrics, setMetrics] = useState({
    total_orders: 0,
    new_orders: 0,
    confirmed_orders: 0,
    food_preparing: 0,
    food_pickup: 0,
    food_delivered: 0,
    cancelled_orders: 0,
    total_users: 0,
    total_categories: 0,
    today_sales: 0,
    week_sales: 0,
    month_sales: 0,
    year_sales: 0,
    total_reviews: 0,
    total_wishlists: 0,
    total_foods: 0,
    
  });


  const cardData = [
    {
      title: 'Total Orders',
      key: 'total_orders',
      color: 'primary',
      icon: 'fas fa-shopping-cart',
    },
    {
      title: 'New Orders',
      key: 'new_orders',
      color: 'success',
      icon: 'fas fa-cart-plus',
    },
    {
      title: 'Confirmed Orders',
      key: 'confirmed_orders',
      color: 'warning',
      icon: 'fas fa-check-circle',
    },
    {
      title: 'Food Preparing',
      key: 'food_preparing',
      color: 'danger',
      icon: 'fas fa-utensils',
    },
    {
      title: 'Food Pickup',
      key: 'food_pickup',
      color: 'secondary',
      icon: 'fas fa-truck',
    },
    {
      title: 'Food Delivered',
      key: 'food_delivered',
      color: 'dark',
      icon: 'fas fa-box-open',
    },
    {
      title: 'Cancelled Orders',
      key: 'cancelled_orders',
      color: 'warning',
      icon: 'fas fa-times-circle',
    },
    {
      title: 'Total Users',
      key: 'total_users',
      color: 'info',
      icon: 'fas fa-users',
    },
    {
      title: 'Today\'s Sales',
      key: 'today_sales',
      color: 'dark',
      icon: 'fas fa-dollar-sign',
    },
    {
      title: 'This Week\'s Sales',
      key: 'week_sales',
      color: 'danger',
      icon: 'fas fa-chart-line',
    },
    {
      title: 'This Month\'s Sales',
      key: 'month_sales',
      color: 'primary',
      icon: 'fas fa-calendar-alt',  
    },
    {
      title: 'This Yearl\'s Sales',
      key: 'year_sales',
      color: 'success',
      icon: 'fas fa-calendar',
    },
    {
      title: 'Total Categories',
      key: 'total_categories',
      color: 'secondary',
      icon: 'fas fa-list',
    },
    {
      title: 'Total Wishlists',
      key: 'total_wishlists',
      color: 'info',
      icon: 'fas fa-heart',
    },
    {
      title: 'Total Reviews',
      key: 'total_reviews',
      color: 'warning',
      icon: 'fas fa-star',
    },
    {
      title: 'Total Foods',
      key: 'total_foods',
      color: 'dark',
      icon: 'fas fa-hamburger',
    },
    
    
  ]
    

  useEffect(()=>{
    if (!adminUser) {
        navigate("/admin-login");
        return;
      }
    fetch('http://127.0.0.1:8000/api/dashboard_metrics/')
      .then(res=>res.json())
      .then(data=> {
          
          setMetrics(data)
      })
  },[]);

  return (
    
      <AdminLayout>
        <div className='row g-3'>
          <h2 className='text-center text-primary'>Admin Dashboard</h2>
          {cardData.map((item,i)=>(
            <div className="col-md-3" key={i}>
              <div className={`card card-hover text-white bg-${item.color}`}>
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title">{item.title}</h5>
                    <h2>{(item.title.includes('Sales')) ? `₹${metrics[item.key]}` : metrics[item.key]}</h2>
                  </div>
                  <i className={`${item.icon} fa-2x`}></i>
                </div>
              </div>
            </div>

          ))}
          
        </div>

        <div className="row mt-4">
          <div className="col-md-6">
            <SalesBarChart />
          </div>
          <div className="col-md-6">
            <TopProducts />
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-6">
            <WeeklySalesChart />
          </div>
          <div className="col-md-6">
            <WeeklyUserChart />
          </div>
        </div>

      </AdminLayout>
        
      
  )
}

export default AdminDashboard