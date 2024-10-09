const bcrypt= require('bcrypt');
const collection= require("../model/userConfig");

//User register 
const registerUser = async(req,res)=>{
    const {username,email,password}=req.body;
    const data={
        name:username,
        email:email,
        password: password,
        role: email=== "admin@gmail.com" ? "admin":"user"
    };

    try {
        // Check if the user already exists
        const existingUser = await collection.findOne({ name: data.name });
        if (existingUser) {
            return res.redirect("/?signupError=User already exists. Please choose another username.")
        }

        // Hash the password using bcrypt
        const saltRounds = 10;
        data.password = await bcrypt.hash(data.password, saltRounds);

        // Insert the new user into the database
        const userData = await collection.insertMany(data);
        // console.log(userData);
        // REdirect to home with a success message as query parameter
        res.redirect('/?signupSuccess=true');
    } catch (error) {
        console.error("Error during sign-up:", error);
        res.redirect('/?signupError=Error signing up user');
    }


}    

//  Fetch all users for Admin Panel
const getAllUsers=async(req,res)=>{
    try{
        if(req.session.user){
            const user=await collection.find({role:'user'});
            return res.render('adminpanel',{user})
        }else{
            res.redirect('/login')
        }
        
        
    }catch(error){
        console.error("Error fetching useras",error);
        res.status(500).send("Failed to fetch users")
    }
};



// Login Route
const loginUser  = async(req,res)=>{
    const{email,userPassword} =req.body
    try {
        // console.log(email,userPassword)
        const check=await collection.findOne({email:email});
        if(!check){
            return res.redirect("/?loginError= User name cannot be found");
        }

        // comapre the hash password from database with the plain text
        const isPasswordMatch = await bcrypt.compare(userPassword,check.password);
        if(!isPasswordMatch){
            return res.redirect('/?loginError= Incorrect Password');
            
        }    
        
        // Check the logged-in user is an admin or not
        req.session.user=check;
        res.redirect(check.role==='admin' ? "/adminpanel" : "/home")    
    } catch(error){
        console.log("Login Error",error)
        res.redirect("/?loginError= Failed Due to Wrong Details");
    }
}

// Logout Route.
const logoutUser = (req,res)=>{
    req.session.destroy((error)=>{
        if(error){
            return res.status(500).send("Error logging out");
        }
        res.clearCookie("connect.sid");   //Clear the session cookie
        res.redirect('/')
    })
}

// User details edit
const editUser = async(req, res) => {
    try {
        const userId = req.params.id;
       
        const user = await collection.findById(userId); 
        res.render('editUser', { user });
    } catch (error) {
        console.log("userEdit error", error);
        res.status(500).send("Error retrieving user deatils ")
    }
};
   
 const postEditUser = async(req,res)=>{
    try {
        const{name, email, password} = req.body
        const userId = req.params.id
        const user = await collection.updateOne({_id : userId }, {
        name : name
        })
        res.redirect('/adminpanel')
    } catch (error) {
       console.log(" error from edituser", error)   
    }
 }
//delete existing user from db(only admin)
const deleteUser=async (req,res)=>{
    try{
        const userId=req.params.id;
        await collection.findByIdAndDelete(userId);
        res.redirect('/adminpanel');
    }catch(error){
        console.error('Error deleting user',error);
        res.status(500).send("eror deleting user")
    }
}; 
  
module.exports={
    registerUser,loginUser,logoutUser,getAllUsers,editUser, postEditUser,deleteUser
};