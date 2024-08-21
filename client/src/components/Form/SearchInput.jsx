import React from "react";
import { useSearch } from "../../context/search";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const SearchInput = () => {
    const [values, setValues]= useSearch()
    const navigate= useNavigate()

    const handleSearch = async(e) => {
        e.preventDefault()
        try{

            const {data}= await axios.get(`${import.meta.env.VITE_REACT_APP_API}/api/v1/product/search/${values.keyword}`)
            console.log(data)
            setValues({...values, results:data})
            navigate("/search")
            
        }catch(err){
            console.log(err)
        }
        }
  return (
    <>
      <form className="d-flex" role="search" onSubmit={handleSearch}>
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={values.keyword}
          onChange={(e)=> setValues({...values, keyword:e.target.value})}
        />
        <button className="btn btn-outline-success" type="submit" >
          Search
        </button>
      </form>
    </>
  );
};

export default SearchInput;
