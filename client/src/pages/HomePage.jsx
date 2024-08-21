import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import { toast } from "react-toastify";
import "../styles/Homepage.css"

const HomePage = () => {
  const navigate= useNavigate()
  const [cart, setCart] = useCart()
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked]= useState([])
  const [radio, setRadio]= useState([])
  const [total, setTotal]= useState(0)
  const [page, setPage]= useState(1)
  const [loading, setLoading]= useState(false)


  //get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotalCount();
  }, []);

  //Get Products
  const getAllProducts = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API}/api/v1/product/product-list/${page}`
      );

      setLoading(false)
      setProducts(data.products);

    } catch (err) {
      setLoading(false)
      console.log(err);
    }
  };
  
    //Get total Count
    const getTotalCount = async () => {
      try{
        const {data} = await axios.get(`${import.meta.env.VITE_REACT_APP_API}/api/v1/product/product-count`)
        setTotal(data?.total)
      }
      catch(err){
        console.log(err)
      }
    }

//Load More
    const loadMore= async ()=>{
      try{
        setLoading(true)
        const {data}= await axios.get(`${import.meta.env.VITE_REACT_APP_API}/api/v1/product/product-list/${page}`)
        setLoading(false)
        setProducts([...products, ...data?.products])
      }
      catch(err){
        console.log(err)
        setLoading(false)
      }
    }
useEffect (()=>{
  if(page===1) return 
  loadMore()

}, [page])

// Filter by Category
  const handleFilter= (value, id)=>{
    let all=[...checked]
    if(value){
      all.push(id)
    }
    else {
      all= all.filter((c)=> c!==id)
    }
    setChecked(all)
  }

  useEffect(() => {

    if(!checked.length || !radio.length) getAllProducts();
    //eslint-disable-next-line
  }, [checked.length,radio.length]);

  useEffect (()=>{
    if(checked.length || radio.length)filterProduct()
  }, [checked, radio]);
  //Get Filtered Products
  const filterProduct= async()=>{
    try{
      const {data}=await axios.post(`${import.meta.env.VITE_REACT_APP_API}/api/v1/product/product-filters`, {checked, radio})
      setProducts(data?.products)
    } catch(err){
      console.log(err)
    }
  }
  return (
    <Layout title={"All products- Best Offers"}>
      <div className="row m-3">
        <div className="col-md-3 filters">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)}>
                {c.name}
              </Checkbox>
            ))}
          </div>

          {/* Price Filter */}
          
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column" >
            <Radio.Group onChange={e=> setRadio(e.target.value)}>
              {Prices?.map(p=> (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column" >
            <button className="btn btn-danger" onClick={()=> window.location.reload()}>Reset Filters</button>
          </div>
        </div>
        <div className="col-md-9">
          <div className="text-center">
            <h1 className="text-center mt-2">All Products</h1>
            <div className="flex-wrap d-flex ">
              {products?.map((p) => (
                <div
                  className="card m-2"
                  key={p._id}
                >
                  <img
                    src={`${
                      import.meta.env.VITE_REACT_APP_API
                    }/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top card-img"
                    alt={p.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">{p.description.substring(0,30)}...</p>
                    <p className="card-title card-price">₹{p.price}</p>
                    <button 
                      className="btn btn-info ms-1" 
                      onClick= {()=>navigate(`/product/${p.slug}`)}>
                      More Details
                    </button>
                    <button className="btn btn-dark ms-1" 
                      onClick={
                        () => {
                            setCart([...cart, p]);
                            localStorage.setItem('cart', JSON.stringify([...cart, p]))
                            toast.success("Item-added to cart")
                            }    
                      }
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="m-2 p-3">
              {products && products.length <total && (
                <button 
                  className="btn loadmore" 
                  onClick={(e) =>{
                    e.preventDefault() 
                    setPage(page+1)}}
                  >
                    {loading?"Loading...":(<> {""}Loadmore <AiOutlineReload /> </>)}</button>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
