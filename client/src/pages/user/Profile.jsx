import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";
import axios from "axios";

const Profile = () => {
  //Context
  const [auth, setAuth] = useAuth();
  //States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");


  //Get user data
  useEffect(()=>{
    const {email, name, phone, address}= auth?.user
    setName(name);
    setEmail(email);
    setPhone(phone);
    setAddress(address);
  },[auth?.user])
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {data} = await axios.put(
        `${import.meta.env.VITE_REACT_APP_API}/api/v1/auth/profile`,

        { name, email, password, address, phone }
      );
      if(data?.error){
        toast.error(data?.error)
      }
      else {
        setAuth({...auth, user:data?.updatedUser})
        let ls=localStorage.getItem("auth")
        ls= JSON.parse(ls)
        ls.user= data.updatedUser
        localStorage.setItem('auth', JSON.stringify(ls))
        toast.success("Profile Updated Successfully")
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Your Profile"}>
      <div className="container-fluid p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="form-container">
              <h1>User Profile</h1>
              <form onSubmit={handleSubmit}>
                <div>
                  <div className="mb-3">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-control"
                      id="exampleInputName"
                      placeholder="Enter Your Name"
                      autoFocus
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control"
                      id="exampleInputEmail1"
                      placeholder="Enter Your Email"
                    
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control"
                      id="exampleInputPassword1"
                      placeholder="Enter Your Password"
                    
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-control"
                      id="exampleInputPhone"
                      placeholder="Enter Your Phone"
                    
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="form-control"
                      id="exampleInputAddress"
                      placeholder="Enter Your Address"
                    
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
