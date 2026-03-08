import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const fetchUser = async(req,res)=>{

    const token = req.cookies.token;

    const decoded = await jwt.verify(token,process.env.JWT_SECRET);
    if(decoded){
        return decoded.id;
    } else{
        return null;
    }      

}

export const routeUrl = (req,res,next)=>{

    return req.originalUrl;
}

export const isActiveRoute = (req,currentRoute)=>{
    //console.log("Current Route",request.originalUrl);
    return req.originalUrl === currentRoute ? 'active' : '';
}

//export {fetchUser,routeUrl}