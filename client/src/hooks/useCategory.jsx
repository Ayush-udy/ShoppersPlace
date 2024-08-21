import {useState, useEffect} from "react"
import axios from "axios"
export default function useCategory(){
    const [categories, setCategories]= useState([])

    //Get Category
    const getCategories =async()=>{
        try{
            const { data } = await axios.get(
                `${import.meta.env.VITE_REACT_APP_API}/api/v1/category/get-category`
              );
            setCategories(data?.category)
        } catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
        getCategories()
        }, [])
    return categories
}