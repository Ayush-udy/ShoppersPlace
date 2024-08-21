import React, { useState } from 'react'
import Layout from '../components/Layout/Layout'
import { useSearch } from '../context/search';


const Search = () => {
  const [values, setValues]= useSearch();
  return (
    <Layout title= {"Search Results"}>
      <div className="container">
        <div className="text-center">
          <h1>Search Results</h1>
          <h6>{values?.results.length<1 ? 'No Products Found': `Found ${values?.results.length}`}</h6>
          <div className="flex-wrap d-flex mt-4 ">
              {values?.results.map((p) => (
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
                    <p className="card-text">₹{p.price}</p>
                    <button className="btn btn-primary ms-1">
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
        <input type="text" placeholder="Search..." />
        <button>Search</button>
      </div>
    </Layout>
  )
}

export default Search