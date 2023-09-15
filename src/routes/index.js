


const authRouter=require('./auth')
// const auth = require("../middleware/auth");

const InitRoutes = (app) => {


  app.use("/auth", authRouter)

  console.log("Routes Initialized Successfully")


}


module.exports=InitRoutes;

