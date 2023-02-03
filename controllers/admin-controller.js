import bcrypt from "bcryptjs";
import Admin from '../models/Admin';
import  jwt  from "jsonwebtoken";
export const addAdmin = async  (req,res,next) => {
    const { email,password} = req.body;
    if(!email && 
        email.trim() ==="" && 
        !password &&
        password.trim()===""
         ){
        return res.status(404).json({ message: "Invalid Inputs"});
     }
    let existingAdmin;
    try{
existingAdmin = await Admin.findOne({ email });
    }catch(err){
        return console.log(err);
    }
    if(existingAdmin){
        return res.status(404).json({ message: "Admin Already Exists"});
    }

    let admin;
    const hashedPassword = bcrypt.hashSync(password);
    try{ admin = new Admin({ email, password: hashedPassword});
    admin = await admin.save();
 } catch(e){
        return console.log(e)
    }
    if(!admin){
        return res.status(404).json({ message: "Can't Create Admin"});
    }
    return res.status(202).json({ admin });
};

export const adminLogin = async (req,res,next) => {
    const { email,password} = req.body;
    if(!email && 
        email.trim() ==="" && 
        !password &&
        password.trim()===""
         ){
        return res.status(404).json({ message: "Invalid Inputs"});
     }
     let existingAdmin;
     try{
        existingAdmin = await Admin.findOne({ email });
     }catch (e) {
        return console.log(e);
     }
     if(!existingAdmin){
        return res.status(404).json({message: "email doesn't exists"});
     }
     const isPasswordCorrect = bcrypt.compareSync(
        password,
        existingAdmin.password
     );

     if(!isPasswordCorrect) {
        return res.status(404).json({ message: "Incorrect Password"});
     }

//Jwt Token For admin 

     const token = jwt.sign({ id:existingAdmin._id }, process.env.SECRET_KEY, {
        expiresIn: "10d",
     });
     return res.status(200).json({ message:"Authentication Complete",token, id: existingAdmin._id });
};

export const getAdmins = async(req,res,next) => {

   let admins;
   try{
      admins = await Admin.findById(req.query.id).populate('addedMovies');
      console.log(admins);
   } catch (err) {
      return res.status(500).json({message: "Internal server Error"});
   }
   return res.status(202).json({ admins });
};

export const getAdminById = async(req,res,next) => {

   let admin;
   try{
      admin = await Admin.findById(req.query.id).populate('addedMovies');
      console.log("admin", admin);
   } catch (err) {
      return res.status(500).json({message: "Internal server Error"});
   }
   return res.status(202).json({ admin });
};

