const mongoose = require('mongoose')

async function connectdb(){
    try{
        await mongoose.connect(`${process.env.URI}/Auth`)
        console.log("Database connected successfully")
    }catch(error){
        console.log("Error connecting to Database", error)
    }
}

connectdb();