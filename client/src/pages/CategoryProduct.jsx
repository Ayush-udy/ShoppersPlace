import React, {useState, useEffect} from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import "../styles/CategoryProductStyles.css"

const CategoryProduct = () => {
    const navigate= useNavigate()
    const params= useParams()
    const [products, setProducts]= useState([])
    const [category, setCategory]= useState([])

    useEffect( ()=>{
        if(params?.slug) getProductByCat()
    }, [params?.slug])

    const getProductByCat= async()=>{
        try{
            const {data}= await axios.get(`${import.meta.env.VITE_REACT_APP_API}/api/v1/product/product-category/${params.slug}`)
            setProducts(data?.products)
            setCategory(data?.category)
        } catch(err){
            console.log(err)
        }
    }


  return (
    <Layout>
        <div className="container mt-3 category">
            <div className="row">
                <div className="col-md-12">
                    <h4 className='text-center'>Category - {category?.name} </h4>
                    <h6 className='text-center'>{products?.length} result Found</h6>
                </div>
            </div>
            <div className="row">
            <div className="col-md-9 offeset-1">
            <div className="flex-wrap d-flex ">
              {products?.map((p) => (
                <div
                  className="card m-2"
                  style={{ width: "18rem" }}
                  key={p._id}
                >
                  <img
                    src={`${
                      import.meta.env.VITE_REACT_APP_API
                    }/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top card-img"
                    alt={p.name}
                  />
                  <div className="card-body ">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">{p.description.substring(0,30)}...</p>
                    <p className="card-text">₹{p.price}</p>
                    <button 
                      className="btn btn-primary ms-1" 
                      onClick= {()=>navigate(`/product/${p.slug}`)}>
                      More Details
                    </button>
                    <button className="btn btn-secondary ms-1">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
            </div>
            

            </div>
        </div>
    </Layout>
  )
}

export default CategoryProduct