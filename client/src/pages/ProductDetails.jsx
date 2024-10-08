import React, {useState, useEffect} from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import "../styles/ProductDetailsStyles.css";

const ProductDetails = () => {

    const navigate= useNavigate()
    const params= useParams()
    const [product, setProduct] = useState({})
    const [relatedProducts, setRelatedProducts]= useState([])

    
    // Initial details 
    useEffect(() => {
        if(params?.slug) getProduct()

    },[params?.slug])
        
    //Get Product
    const getProduct= async()=>{
        try{
            const { data } = await axios.get(
                `${import.meta.env.VITE_REACT_APP_API}/api/v1/product/get-product/${params.slug}`
              );
              setProduct(data?.product)
              getSimilarProduct(data?.product._id, data?.product.category._id)
        }
        catch(err){
            console.log(err)
        }
    }

    //Get similar product
    const getSimilarProduct = async (pid, cid) => {
      try {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_API
          }/api/v1/product/related-product/${pid}/${cid}`
        );
        setRelatedProducts(data?.products);
      } catch (err) {
        console.log(err);
      }
    };

  return (
    <Layout>
        <div className="row container mt-2 product-details">
            <div className="col-md-6">
                <img 
                    src={`${import.meta.env.VITE_REACT_APP_API}/api/v1/product/product-photo/${product._id}`} 
                    className="card-img-top card-img" 
                    alt={product.name} 
                    height='400px'
                    width={"350px"}
                />
            </div>
            <div className="col-md-6 product-details-info">
                <h1 className='text-center'>Product Details</h1>
                <h4>Name: {product.name}</h4>
                <h4>Description: {product.description}</h4>
                <h4>Price: ₹{product.price}</h4>
                <h4>Category: {product.category?.name}</h4>
                <h4>Quantity: {product.quantity}</h4>
                <button className="btn btn-secondary ms-1">
                      Add to Cart
                </button>
            </div>
        </div>
        <hr/>
        <div className="row container similar-products">
            <h1>Similar Products</h1>
              {relatedProducts.length <1 && 
              (<p className='text-center'>No Similar Products found</p>)}
            <div className="flex-wrap d-flex ">
              {relatedProducts?.map((p) => (
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
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">{p.description.substring(0,30)}...</p>
                    <p className="card-title card-price">₹{p.price}</p>
                    
                    <button className="btn btn-dark ms-1">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

        </div>
    </Layout>
  )
}

export default ProductDetails