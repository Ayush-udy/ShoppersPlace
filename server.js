const  express= require('express')
const colors=require('colors')
const dotenv =require('dotenv')
const morgan =require('morgan')
const connectDB =require('./configurations/database')
const authRoutes= require('./routes/authRoutes')
const categoryRoutes= require('./routes/categoryRoutes')
const productRoutes= require('./routes/productRoutes')
const cors= require('cors')


//Config Env
dotenv.config()

//rest Objec
const app= express()

//database config
connectDB()

//Middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);


//rest api
app.get('/', (req, res)=>{
    res.send("<h1>Welcome to ShoppersPlace App!</h1>")
})

//Port 
const PORT= process.env.PORT|| 8080;

//run listen
app.listen(PORT, () =>{
    console.log(`Server Running on ${process.env.DEV_MODE} mode  port ${PORT}`.bgCyan.white)
})
