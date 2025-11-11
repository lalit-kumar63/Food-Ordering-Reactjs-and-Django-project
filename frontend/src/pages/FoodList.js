import React, {useState, useEffect} from 'react'
import PublicLayout from '../components/PublicLayout'
import '../styles/home.css';
import { Link } from 'react-router-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const FoodList = () => {

  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [search, setSearch] = useState('');
 
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200);

  const [currentPage, setCurrentPage] = useState(1);
  const foodsPerPage = 9;


  useEffect(()=>{
              
    fetch(`http://127.0.0.1:8000/api/foods/`)
    .then(res=>res.json())
    .then(data=> {
        setFoods(data)
        setFilteredFoods(data)
    })
    fetch(`http://127.0.0.1:8000/api/list-categories/`)
    .then(res=>res.json())
    .then(data=> {
        setCategories(data)
        
    })
              
  },[]);

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters(search, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    applyFilters(search, category);
  };

  const applyFilters = (searchTerm, category) => {
    let result = foods;
    if (searchTerm) {
      result = result.filter(food =>
        food.item_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (category && category !== 'All') {
      result = result.filter(food => food.category_name === category);
    }
    
    result = result.filter(food =>
      food.item_price >= minPrice && food.item_price <= maxPrice
    );
    
    setFilteredFoods(result);
    setCurrentPage(1);
  }

  //Pagination logic
  const indexOfLastFood = currentPage * foodsPerPage;
  const indexOfFirstFood = indexOfLastFood - foodsPerPage;
  const currentFoods = filteredFoods.slice(indexOfFirstFood, indexOfLastFood);
  const totalPages = Math.ceil(filteredFoods.length / foodsPerPage);

  // const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <PublicLayout>
      <div className="container py-5">
        <h2 className='text-center mb-4'>Find Your Delicious Food Here...</h2>
        
        <div className="row mb-4">
          <div className="col-md-8">
            <form onSubmit={handleSearch}>
              
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for food..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn btn-primary" type="submit">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </form>
          </div>
          <div className="col-md-4">
            <select className='form-select' value={selectedCategory} onChange={handleCategoryChange}>
                <option value="All">All Categories</option>
                {categories.map((category)=>(
                    <option key={category.id} value={category.category_name}>{category.category_name}</option>
                ))}
            </select>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-12">
            <label className='form-label fw-bold my-2'>
              Filter by Price: ₹{minPrice} - ₹{maxPrice}
            </label>
            <Slider
              range
              min={0}
              max={1000}
              defaultValue={[minPrice, maxPrice]}
              onChange={(value) => {
                setMinPrice(value[0]);
                setMaxPrice(value[1]);
                // applyFilters(search, selectedCategory);
              }}
              onAfterChange={() => applyFilters(search, selectedCategory)}
            />
          </div>            
        </div>

        <div className='row mt-4'>
          {currentFoods.length===0 ? (
              <p className='text-center'>
                  No foods found
              </p>
          ) : (
              currentFoods.map((food, index)=>(
                  <div key={food.id} className='col-md-4 mb-4'>
                      <div className="card hovereffect">
                          <img src={`http://127.0.0.1:8000${food.image}`} alt='Food item'  className='card-img-top' style={{height:'180px'}}/>
                          <div className='card-body'>
                              <h5 className='card-title'>
                                  <Link to={`/food/${food.id}`}>{food.item_name}</Link>
                              </h5>
                              <p className='card-text text-muted'>{food.item_description?.slice(0,40)}... </p>
                              <div className='d-flex justify-content-between align-items-center'>
                                  <span className='fw-bold'>₹ {food.item_price}</span>
                                  
                                  {food.is_available ? (
                                      <Link to={`/food/${food.id}`} className='btn btn-outline-primary btn-sm'>
                                          <i className='fas fa-shopping-basket me-1'></i>Order now
                                      </Link>
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
                  </div>
              ))
              
          )}
            
        </div>

        {totalPages > 1 && (
          <nav className='mt-4 d-flex justify-content-center'>
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                <button className='page-link' onClick={()=>paginate(1)}>First</button>
              </li>
              <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                <button className='page-link' onClick={()=>paginate(currentPage-1)}>Prev</button>
              </li>
              <li className='page-item disabled'>
                <button className='page-link'>Page {currentPage} of {totalPages} </button>
              </li>
              <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
                <button className='page-link' onClick={()=>paginate(currentPage+1)} > Next</button>
              </li>
              <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
                <button className='page-link' onClick={()=>paginate(totalPages)}>Last</button>
              </li>
              

            </ul>
          </nav>
        )}

      </div>

      
    </PublicLayout>
  )
}

export default FoodList