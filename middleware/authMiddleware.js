//Middleware to check if the user is logged in 
function checkAuth(req,res,next){
    if(req.session.user){
        next();
    }else{
        res.redirect('/')
    }
}


//Middleware yto check if the user is an admin 
function checkAdmin(req,res,next){
    if(req.session.user && req.session.user.role==='admin'){
        next();
    }        
    else{
        res.status(403).send("Access denied: Admins only");
    }
}

module.exports={checkAuth,checkAdmin};