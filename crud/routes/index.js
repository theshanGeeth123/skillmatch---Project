import { Router } from "express";

const appRouter = Router();

appRouter.get("/",(req,res)=> {
    res.send("Working 1234522dfde ");
})



export default appRouter;