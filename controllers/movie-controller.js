import  jwt  from "jsonwebtoken";
import Movie from "../models/Movie";
import Admin from "../models/Admin";
import mongoose from "mongoose";
export const addMovie = async (req,res,next) => {
   const extractedToken = req.headers.authorization.split(" ")[1];
if(!extractedToken && extractedToken.trim() === ""){
    return res.status(404).json({message:"Token Not Found"});
}
console.log(extractedToken);

let adminId;

//Here we verified the token
jwt.verify(extractedToken, process.env.SECRET_KEY,(err,decrypted) => {
    if(err) {
      return  res.status(400).json({message: `${err.message}`});
}    else{
    adminId = decrypted.id;
    return;
}});

//Here we Created new movie for project 4
    const { title,description,releaseDate,posterUrl,featured,actors,} = req.body
    if(!title &&
     title.trim()=== "" && 
     !description && 
     description.trim()=="" && 
     !posterUrl && 
     posterUrl.trim()===""
     ){
        return res.status(422).json({message: "Invalid Input"});
     }

     let movie;
     try{ 
       movie = new Movie({
            description,
            releaseDate: new Date(`${releaseDate}`),
            featured,
            actors,
            admin: adminId,
            posterUrl,
            title,
        });
const session = await mongoose.startSession();
console.log(adminId)
const adminUser = await Admin.findById(adminId);
console.log(adminUser)
session.startTransaction();
await movie.save({ session });
adminUser.addedMovies.push(movie);
await adminUser.save({ session });
await session.commitTransaction();
 } catch(error) {
        return console.log(error);
     }

     if(!movie){
        return res.status(404).json({message: "Request Failed"});
     }
     return res.status(201).json({ movie });
};

export const getAllMovies = async(req,res,next) => {
  let movies;

  try{
movies = await Movie.find();
} catch (err) {
    return console.log(err)
  }
  if(!movies){
    return res.status(404).json({message: "Request Failed"})
  }
  return res.status(200).json({ movies });
};

export const getMovieById = async (req,res,next) => {
    const id = req.params.id;
    let movie;
    try{
     movie = await Movie.findById(id);
    }catch(e){
        return console.log(e)
    }
    if(!movie){
        return res.status(404).json({ message: "Invalid Movie ID"})
    }
    return res.status(202).json({ movie });
}