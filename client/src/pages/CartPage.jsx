import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import axios from "axios";
import DropIn from "braintree-web-drop-in-react";
import { toast } from "react-toastify";
import "../styles/cartStyles.css";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);

  // Total Price
  const totalPrice = () => {
    try {
      const total = cart.reduce((sum, item) => sum + item.price, 0);
      return total.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      });
    } catch (err) {
      console.error("Error in calculating total price:", err);
      return "Error in calculating total Price";
    }
  };

  // Delete Item
  const removeCartItem = (pid) => {
    try {
      const updatedCart = cart.filter((item) => item._id !== pid);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (err) {
      console.error("Error in removing cart item:", err);
    }
  };

  // Get Payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API}/api/v1/product/braintree/token`
      );
      setClientToken(data.clientToken);
    } catch (err) {
      console.error("Error in getting token:", err);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getToken();
    }
  }, [auth?.token]);

  // Handle Payment
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API}/api/v1/product/braintree/payment`,
        {
          nonce,
          cart,
        }
      );
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully");
    } catch (err) {
      console.error("Error in processing payment:", err);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="cart-page">
        <div className="row">
          <div className="col-12">
            <h1 className="text-center bg-light p-2">
              {`Hello ${auth?.token && auth?.user?.name}`}
            </h1>
            <h4 className="text-center">
              {cart?.length > 1
                ? `You have ${cart.length} items in your cart ${
                    auth?.token ? "" : "Please login to checkout"
                  }`
                : "Your cart is empty"}
            </h4>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-8">
            {cart?.map((p) => (
              <div key={p.id} className="row mb-3 p-3 card flex-row">
                <div className="col-4 col-md-4">
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
                <div className="col-8 col-md-8">
                  <h5 className="card-title">{p.name}</h5>
                  <p>{p.description.substring(0, 50)}...</p>
                  <p className="card-text">Price: ₹{p.price}</p>
                  <p className="card-text">Quantity: {p.quantity}</p>
                  <button
                    className="btn btn-danger cart-remove-btn"
                    onClick={() => removeCartItem(p._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="col-12 col-md-4 cart-summary">
            <h2>Cart Summary</h2>
            <p>Total | Checkout | Payment</p>
            <h4 className="text-center">Total: {totalPrice()}</h4>
            {auth?.user?.address ? (
              <>
                <div className="mb-3">
                  <h4>{auth?.user?.address}</h4>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                </div>
              </>
            ) : (
              <div className="mb-3">
                {auth?.token ? (
                  <button
                    className="btn btn-outline"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                ) : (
                  <button
                    className="btn btn-outline"
                    onClick={() => navigate("/login", { state: "/cart" })}
                  >
                    Please Login to Checkout
                  </button>
                )}
              </div>
            )}
            <div className="mt-2">
              {!clientToken || !cart?.length ? (
                ""
              ) : (
                <>
                  <DropIn
                    options={{
                      authorization: clientToken,
                      paypal: {
                        flow: "vault",
                      },
                    }}
                    onInstance={(instance) => setInstance(instance)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handlePayment}
                    disabled={loading || !instance || !auth?.user?.address}
                  >
                    {loading ? "Processing..." : "Make Payment"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
