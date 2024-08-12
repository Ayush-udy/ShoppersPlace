import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { toast } from "react-toastify";
import axios from "axios";
import CategoryForm from "../../components/Form/CategoryForm";
import { Modal } from 'antd'


const CreateCtegory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName]= useState("")
  const [visible, setVisible]= useState(false)
  const [selected, setSelected]= useState(null)
  const [updatedName, setUpdatedName]= useState("")
  //Handle Form

  const handleSubmit = async(e)=>{
    e.preventDefault()
    try{
      const {data}= await axios.post(`${import.meta.env.VITE_REACT_APP_API}/api/v1/category/create-category`, {name})
      if(data?.success){
        toast.success(`${name} category created`)
        getAllCategory()
      }
      
    }
    catch(error){
      console.log(error)
      toast.error('Something went wrong')
    }
  }

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

  //Update category
  const handleUpdate= async(e)=>{
    e.preventDefault()
    try{
      const {data}= await axios.put(`${import.meta.env.VITE_REACT_APP_API}/api/v1/category//update-category/${selected._id}`,{name:updatedName})
      if(data.success){
        toast.success(`${updatedName} is updated`)
        setSelected(null)
        setUpdatedName("")
        setVisible(false)
        getAllCategory()
      }
      else {
        toast.error(data.message)
      }
    }catch(error){
      toast.error('Something went wrong')
    }
    
  }

  //Delete category
  const handleDelete= async(pid)=>{
    try{
      const {data}= await axios.delete(`${import.meta.env.VITE_REACT_APP_API}/api/v1/category//delete-category/${pid}`)
      if(data.success){
        toast.success(`Category is deleted`)
        getAllCategory()
      }
      else {
        toast.error(data.message)
      }
    }catch(error){
      toast.error('Something went wrong')
    }
    
  }

  return (
    <Layout title={"Dashboard- Create Category"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-lg-3 col-md-4 col-sm-12">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Category</h1>
            <div className="p-3 w-50">
              <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName}/>
            </div>
            <div className="w-75">
              <div>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories?.map((c) => (
                      <>
                        <tr>
                          <td key={c._id}>{c.name}</td>
                          <td>
                            <button 
                              className="btn btn-primary ms-2" 
                              onClick= {()=> {
                                setVisible(true); 
                                setUpdatedName(c.name)
                                setSelected(c)
                              }}
                            >
                                Edit</button>
                            <button className="btn btn-danger ms-2" onClick={()=>{handleDelete(c._id)}}>Delete</button>
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Modal onCancel={()=>setVisible(false)}  footer={null} visible={visible}>
              <CategoryForm value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdate} />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCtegory;
