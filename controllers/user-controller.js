import  jwt  from "jsonwebtoken";
import User from '../models/User';
import bcrypt from "bcryptjs";
import Bookings from '../models/Bookings';
export const getAllUsers = async (req, res,next) => {
    let users;
    try{
        users = await User.find().populate('addedMovies');;
     }
    catch (err){
        return console.log(err);
    }

    if (!users) {
        return res.status(500).json({message:"User not FOUND"});
    }

    return res.status(200).json({ users });
};
export const signUp = async(req,res,next) => {
const {name,email,password} = req.body;
if(!name && 
    name.trim() ===""&& 
    !email && 
    email.trim() ==="" && 
    !password &&
    password.trim()===""
     ){
    return res.status(500).json({ message: "Invalid Inputs"});
 }
 const hashedPassword = bcrypt.hashSync(password);

let user;
try{
    user = new User({ name, email, password:hashedPassword });
    user = await user.save();
}   catch (err) {
    return console.log(err);
}
if (!user) {
    return res.status(500).json({message: "Unexpected Error"});
}
return res.status(200).json({ id: user._id });
};
export const updateUser = async (req,res,next) => {
    const id = req.params.id;
    const {name,email,password} = req.body;
if(!name && 
    name.trim() ===""&& 
    !email && 
    email.trim() ==="" && 
    !password &&
    password.trim()===""
     ){
    return res.status(500).json({ message: "Invalid Inputs"});
 }

 const hashedPassword = bcrypt.hashSync(password);

 let user;
 try{
user = await User.findByIdAndUpdate(id,{
    name,
    email, 
    password:hashedPassword,
});

 }catch(err){
   return console.log(err);
 }
 if (!user){
    return res.status(500).json({message: "Something Went Wrong"});
 }
res.status(200).json({message: "Updated Successfully"});

};
export const deleteUser = async (req,res,next) => {
    const id = req.params.id;
    let user;
    try{ 
        user = await User.findByIdAndRemove(id);
    }
    catch(e) {
        return console.log(e);
    }
    if (!user){
        return res.status(500).json({message: "404 Error"});
    }
    return res.status(200).json({message: "Deleted Successfully"});
}



export const login = async (req,res,next) => {
    const {email,password} = req.body;
if(
    !email && 
    email.trim() ==="" && 
    !password &&
    password.trim()===""
     ){
    return res.status(500).json({ message: "Invalid Inputs"});
 }
let existingUser;
 try{
    existingUser = await User.findOne({ email });

 }
 catch(e){
    return console.log(e)
 }

 if(!existingUser) {
    return res.status(500).json({message: "You are not registered with us Bro"});
 }
 const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

 if(!isPasswordCorrect) {
    return res.status(500).json({message: "Password incorrect"});
 }

 const token = jwt.sign({ id:existingUser._id }, process.env.SECRET_KEY, {
    expiresIn: "10d",
 });
 return res.status(202).json({ message:"Authentication Complete",token, id: existingUser._id });
};


export const getBookingsOfUser = async (req,res,next) => {
    const id = req.params.id;
    let bookings;
    try{ 
         bookings = await Bookings.find({ user: id });

    }catch(err){
        return console.log(err);
    }
    if(!bookings){
        return res.status(500).json({message: "unable to get Bookings"})
    }

    return res.status(200).json({ bookings });
};

export const getUserById = async (req, res,next) => {
    const id = req.params.id;
    let user;
    try{
        user = await User.findById(id);
     }
    catch (err){
        return console.log(err);
    }

    if (!user) {
        return res.status(500).json({message:"Unexpected Error"});
    }

    return res.status(200).json({ user });
};

