import express  from 'express';
const mainrouter = express.Router();
import {Post} from '../model/Post.js';

mainrouter.get('',async (req,res)=>{
    const local = {
        title:"Home",
        description:"This is the home page of our blog website"
    }

    const perpage = 5;
    const page = req.query.page || 1;

    const skip = (page - 1) * perpage;

    const data = await Post.aggregate([
        {$sort:{createdAt:-1}},
        {
            $skip:skip
        },
        {
            $limit:perpage
        }
    ])
    .exec();
    const total = await Post.countDocuments();
    //const data = await Post.find({}).sort({createdAt:-1}).skip(skip).limit(perpage);
    //console.log(total);
    const totalpage = Math.ceil(total / perpage);

   const hasprev = page > 1;
    const hasnext = page < totalpage;

    res.render('index',{local,data,total,totalpage,page,hasprev,hasnext,req});
});

/* const postInsert = async () => {
    await Post.insertMany([
        {
            title:"Third Post",
            body:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate."
        },
        {
            title:"Fourth Post",
            body:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate."
        }, 
        {
            title:"Third Post",
            body:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate."
        },
        {
            title:"Fourth Post",
            body:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate."
        },
        {
            title:"Fifth Post",
            body:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate."
        },
        {
            title:"Sixth Post",
            body:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate."
        },
        {
            title:"Seventh Post",
            body:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate."
        },
        {
            title:"Eighth Post",
            body:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate."
        },
        {
            title:"Ninth Post",
            body:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate."
        },
        {
            title:"Tenth Post",
            body:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate."
        },
        {
            title:"Eleventh Post",
            body:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate."
        },
        {
            title:"Twelfth Post",
            body:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate."
        }
    
    ]); 
    
};
postInsert(); */
mainrouter.get('/post/:id',async (req,res)=>{

    
    const slug = req.params.id;

    const post = await Post.findById({_id:slug});

    const local = {
        title:post.title,
        description:"This is the Post details page of our blog website"
    }
    console.log(post);


    res.render('post',{local,post,req});
});

mainrouter.post('/search',async (req,res)=>{

    const searchTerm = req.body.searchTerm.trim();
    //res.send(searchTerm);

    const regex = new RegExp(searchTerm,'i');
    //console.log(regex);
    /* const data = await Post.aggregate([
        {
            $match:{
                $or:[
                {
                    title:{$regex:regex}
                },
                {
                    body:{$regex:regex}
                }
            ]
            }
        }

    ]).exec(); */
    const data = await Post.find({
        $or:[
            {
                title:{$regex:regex}
            },
            {
                body:{$regex:regex}
            }
        ]  
    })
//console.log(data);
   const local = {
        title:"Search Results",
        description:"This is the search results page of our blog website"
    }
    res.render('search',{local,data,req}); 

})

mainrouter.get('/about',(req,res)=>{
    const local = {
        title:"About",
        description:"This is the about page of our blog website"
    }
    res.render('about',{local,req});
});

mainrouter.get('/contact',(req,res)=>{
    const local = {
        title:"Contact",
        description:"This is the contact page of our blog website"
    }
    res.render('contact',{local,req});
});

export {mainrouter};