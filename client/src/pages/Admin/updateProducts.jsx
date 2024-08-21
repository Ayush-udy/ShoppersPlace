import React,{useState, useEffect} from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import { toast } from "react-toastify";
import {Select} from 'antd'
import {useNavigate, useParams } from "react-router-dom";
const {Option}= Select


const UpdateProducts = () => {

    const navigate= useNavigate()
    const params= useParams()
    const [categories, setCategories]= useState([])
    const [description, setDescription]= useState("")
    const [price, setPrice]= useState("")
    const [quantity, setQuantity]= useState("")
    const [shipping, setShipping]= useState("")
    const [category, setCategory]= useState("")
    const [photo, setPhoto]= useState("")
    const [name, setName]= useState("")
    const [id, setId]= useState("")
    //get single product
    const getSingleProduct =async()=>{
        try{
            const {data}= await axios.get(`${import.meta.env.VITE_REACT_APP_API}/api/v1/product/get-product/${params.slug}`)

            setName(data.product.name)
            setDescription(data.product.description)
            setPrice(data.product.price)
            setQuantity(data.product.quantity)
            setShipping(data.product.shipping)
            setCategory(data.product.category._id)
            setPhoto(data.product.photo)
            setId(data.product._id)

        }catch(err){
            console.log(err)
            
        }
    }
    useEffect (()=>{
        getSingleProduct()
        //eslint-disable-next-line
    },[])

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
        toast.error("Something went wrong in getting category");
      }
    };
    
    useEffect(() => {
      getAllCategory();
    }, []);
  
  //Update product function
  const handleUpdate= async(e)=>{
    e.preventDefault()
    try{
      const navigate= useNavigate
      const productData= new FormData()
      productData.append("name", name)
      productData.append("description", description)
      productData.append("price", price)
      productData.append("quantity", quantity)
      photo && productData.append("photo", photo)
      productData.append("category", category)
      const {data}= await axios.put(
        `${import.meta.env.VITE_REACT_APP_API}/api/v1/product/update-product/${id}`,
          productData)
        
      if(data?.success){
        toast.error(data?.message)
      }else {
        toast.success("Product Updated successfully")
        navigate('/dashboard/admin/products')
      }
  }
  catch(error){
    console.log(error)
    toast.error('Something was wrong')
  }
  }
  //Delete Product
  const handleDelete= async()=>{
    try{
      let answer= window.prompt("Are you sure you want to delete product ?")
      if(!answer) return 
      
      const {data}= await axios.delete(`${import.meta.env.VITE_REACT_APP_API}/api/v1/product/delete-product/${id}`)
      toast.success('Product Deleted Successfully')
      navigate('/dashboard/admin/products')
    }
    catch(err){
      console.log(err);
      toast.error('Something went wrong')
    }
  }
  return (
    <Layout title={'Dashboard-Create Product'}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Update Product</h1>
            <div className="m-1 w-75">
              <Select variant={false} placeholder="Select a category"
              size="large"
              showSearch
              className="form-select mb-3" onChange={(value)=>{setCategory(value)}}
              value= {category}
              >
                {categories?.map(c => (
                  <Option key={c._id} value= {c._id}>{c.name}</Option>
                ))}
              </Select>
              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {photo ?photo.name :"Upload Photo"}
                  <input 
                    type="file" 
                    name="photo" 
                    accept="image/*" 
                    onChange={(e)=>setPhoto(e.target.files[0])} 
                    hidden
                  />
                </label>
              </div>
              <div className="mb-3">
                {photo?(
                  <div className="text-center">
                    <img src={URL.createObjectURL(photo)} alt="product photo" height={'200px'} className="img img-responsive"/>
                  </div>
                ) :(
                    <div className="text-center">
                    <img src={`${import.meta.env.VITE_REACT_APP_API}/api/v1/product/product-photo/${id}`} alt="product photo" height={'200px'} className="img img-responsive"/>
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input type='text'
                className="form-control"
                placeholder="Enter product name"
                value={name}
                onChange={(e)=> setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input type='text'
                className="form-control"
                placeholder="Enter price"
                value={price}
                onChange={(e)=> setPrice(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input type='text'
                className="form-control"
                placeholder="Enter product description"
                value={description}
                onChange={(e)=> setDescription(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input type='text'
                className="form-control"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e)=> setQuantity(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <Select 
                variant={false}
                className="form-select mb-3"
                placeholder="Select Shipping"
                showSearch
                onChange={(value)=> setShipping(value)}
                value={shipping?"yes":"No"}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>

              </div>
                <div className="mb-3">
                  <button className="btn btn-primary" type="submit" onClick={handleUpdate}> 
                        Update Product
                    </button>
                </div>
                <div className="mb-3">
                  <button className="btn btn-danger" type="submit" onClick={handleDelete}> 
                        Delete Product
                    </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
    
  )
}

export default UpdateProducts