import express from 'express';
import { Post } from '../model/Post.js';
import { User } from '../model/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Cookie } from 'express-session';
import dotenv from 'dotenv';
import { routeUrl } from '../helper/routehelper.js';
dotenv.config();

const adminRoute = express.Router();
const jwtSecret = process.env.JWT_SECRET;

const authenticateToken = async (req, res, next) => {

    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "Access denied" });
    }
    try {
        const decoded = await jwt.verify(token, jwtSecret);
        req.user = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};
const redirectIfAuthicated = (req,res,next)=>{
    const token = req.cookies.token;
    if(token){
        return res.redirect('/admin/dashboard');
    }else{
        next();
    }
}
adminRoute.get('/', redirectIfAuthicated, (req, res) => {
    console.log(jwtSecret);
    console.log("Admin route",routeUrl(req,res));
    const token = req.cookies.token;
    const local = {
        title: "Admin Section",
        description: "This is the admin section of our blog website"
    }

    res.render('admin/index', { layout: './layouts/admin', local,token,req });

});
adminRoute.get('/dashboard', authenticateToken, async (req, res) => {

    const local = {
        title: "Admin Dashboard",
        description: "This is the admin dashboard of our blog website"
    }
    const userId = req.user;

    const posts = await Post.find({}).sort({createdAt:-1});

    //console.log(token);

    res.render('admin/dashboard', { layout: './layouts/admin', local, token: req.cookies.token, posts, req });
});

adminRoute.get('/add-post', authenticateToken, async (req, res) => {

    const local = {
        title: "Admin Add Post",
        description: "This is the admin dashboard of our blog website"
    }
    const userId = req.user;

    //const posts = await Post.find({});

    //console.log(userId);

    res.render('admin/add-post', { layout: './layouts/admin', local,token: req.cookies.token,req });
});
adminRoute.post('/add-post', authenticateToken, async (req, res) => {

    try {
        const userId = req.user;

        const { title, body } = req.body;
        const post = await Post.create({ title, body});
        res.redirect('/admin/dashboard');

    } catch (error) {
        console.log(error);
        res.redirect('/admin/add-post');
    }


});

adminRoute.post('/login', async (req, res) => {

    console.log(jwtSecret);
    //res.send("Login route");
    try {
        const { username, password } = req.body;
        const user = await User.find({ username: username });
        //console.log(user);
        if (user.length > 0) {
            const isMatch = await bcrypt.compare(password, user[0].password);
            if (isMatch) {
                const token = jwt.sign({ id: user[0]._id }, jwtSecret);
                res.cookie('token', token, { httpOnly: true });
                //res.send("Login successful");
                res.redirect('/admin/dashboard');
            } else {
                res.status(401).json({ error: "Invalid credentials" });
            }
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.redirect('/admin');
    }


});

adminRoute.post('/register', async (req, res) => {

    try {
        const { username, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ username: username, password: hashedPassword });
        //res.status(201).json({ message: "User registered successfully", user });
        res.redirect('/admin');
    } catch (error) {
        // console.log(res.statusCode);
        res.status(500).json({ error: error.message });

        //res.redirect('/admin'); 
    }


});

adminRoute.get('/edit-post/:id', authenticateToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        const local = {
            title: "Edit Post",
            description: "Edit your blog post"
        };
        res.render('admin/edit-post', { layout: './layouts/admin', local, post,token: req.cookies.token, req });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

adminRoute.put('/edit-post/:id', authenticateToken, async (req, res) => {
    try{

        const { title, body } = req.body;
        const post = await Post.findByIdAndUpdate(req.params.id, { title, body,updatedAt:Date.now() }, { new: true });
        if(!post){
            return res.status(404).json({ error: "Post not found" });
        }
        res.redirect(`/admin/edit-post/${req.params.id}`);


    }catch(error){
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }


});

adminRoute.delete('/delete-post/:id', authenticateToken, async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);   
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }   
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }

});

adminRoute.get('/logout', authenticateToken, async (req, res) => {
    res.clearCookie('token');
    res.redirect('/admin');
});

export { adminRoute };