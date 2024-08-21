import React, {useState, useEffect} from 'react'
import AdminMenu from '../../components/Layout/AdminMenu'
import Layout from '../../components/Layout/Layout'
import axios from 'axios'
import { toast } from 'react-toastify'
import moment from 'moment'
import { useAuth } from '../../context/auth'
import {Select} from 'antd'
const {Option}= Select


const AdminOrders = () => {
    const [status, setStatus]= useState(["Not Process", "Processing", "Shipped", "deliver", "cancel"])
    const [changeStatue, setChangeStatus] =useState("")
    
    const [orders, setOrders] = useState([]);
    const [auth, setAuth] = useAuth();
    const getOrders = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API}/api/v1/auth/all-orders`
        );
        setOrders(data);
      } catch (err) {
        console.log(err);
      }
    };
    useEffect(() => {
      if (auth?.token) getOrders();
    }, [auth?.token]);
  
    const handleChange= async(orderId, value)=>{
        try{
            const {data}= await axios.put(`${import.meta.env.VITE_REACT_APP_API}/api/v1/auth/order-status/${orderId}`, {status: value})
            getOrders()
        }
        catch(err){
            console.log(err)
        }
    }
    return (
    <Layout title={"All Ordered Data"}>
    <div className="row">
        <div className="col-md-3">
            <AdminMenu/>
        </div>
        <div className="col-md-9">
            <h1 className='text-center'>All Orders</h1>
            {orders?.map((o, i) => {
              return (
                <div className="border-shadow" key={o._id}>
                  <table className="table">
                    <thread>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Status</th>
                        <th scope="col">Buyer</th>
                        <th scope="col">Date</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Quantity</th>
                      </tr>
                    </thread>
                    <tbody>
                      <tr>
                        <td>{i + 1}</td>
                        <td>
                            <Select 
                                bordered={false} 
                                onChange={(value)=> handleChange(o._id, value)}  
                                defaultValue={o?.status}>
                                {status.map((s,i)=>(
                                    <Option key={i} value={s}>
                                        {s}
                                    </Option>
                                ))}
                                
                            </Select>
                        </td>
                        <td>{o?.buyer?.name}</td>
                        <td>{moment(o?.createAt).fromNow()}</td>
                        <td>{o?.payment.success ? "Success" : "Failed"}</td>
                        <td>{o?.products?.length}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="container">
                    {o?.products?.map((p, i) => (
                      <div key={p.id} className="row mb-3 p-3 card flex-row">
                        <div className="col-md-4">
                          <img
                            src={`${
                              import.meta.env.VITE_REACT_APP_API
                            }/api/v1/product/product-photo/${p._id}`}
                            className="card-img-top card-img"
                            alt={p.name}
                            width="100px"
                            height={"100px"}
                          />
                        </div>
                        <div className="col-md-8">
                          <h5 className="card-title">{p.name}</h5>
                          <p>{p.description.substring(0, 50)}...</p>
                          <p className="card-text">Price: ₹{p.price}</p>
                          <p className="card-text">Quantity: {p.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
    </div>
    </Layout>
  )
}

export default AdminOrders