import React ,{useState}from "react";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate} from "react-router-dom";
import "../../styles/AuthStyles.css"


const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [newpassword, setNewPassword] = useState("");
    const [answer, setAnswer] = useState("");
  
    const navigate = useNavigate();
  
    const handleSubmit= async(e)=>{
      e.preventDefault()
      try {
        const res= await axios.post(
          `${import.meta.env.VITE_REACT_APP_API}/api/v1/auth/forgot-password`,
           
          {email, answer, newpassword}
  
          );
        if(res && res.data.success){
          toast.success(res.data.message)

          navigate("/login")
        }
        else{
          toast.error(res.data.message)
        }
  
      } catch (error) {
        console.log(error)
        toast.error('Something went wrong')
      }
    }

  return (
    <Layout title="Forgot Password">
        <div className="form-container">
          <h1>Reset Password</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <div className="mb-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  id="exampleInputEmail1"
                  placeholder="Enter Your Email"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="form-control"
                  id="exampleInputAnswer1"
                  placeholder="Enter Your Favourite sport"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  value={newpassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-control"
                  id="exampleInputNewPassword1"
                  placeholder="Enter Your New Password"
                  required
                />
              </div>
              
              <button type="submit" className="btn btn-primary">
                Reset
              </button>
            </div>
          </form>
        </div>
      </Layout>
  )
}

export default ForgotPassword