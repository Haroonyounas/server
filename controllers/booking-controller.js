import mongoose from "mongoose";
import Bookings from "../models/Bookings";
import Movie from "../models/Movie";
import User from "../models/User";

export const newBooking = async (req, res, next) => {
  const { movie, date, seatNumber, user } = req.body;
  let existingMovie;
  let existingUser;

  try {
    existingMovie = await Movie.findById(movie);
    existingUser = await User.findById(user);
  } catch (err) {
    return console.log(err);
  }
  if (!existingMovie) {
    return res
      .status(404)
      .json({ message: "Movie doesn't exists with given ID" });
  }
  if (!existingUser) {
    return res
      .status(402)
      .json({ message: "User doesn't exists with this ID" });
  }

  let booking;

  try {
    booking = new Bookings({
      movie,
      date: new Date(`${date}`),
      seatNumber, 
      user})

    const session = await mongoose.startSession();
    session.startTransaction();
    existingUser.bookings.push(booking);
    existingMovie.bookings.push(booking);
    await existingUser.save({ session });
    await existingMovie.save({ session });
    await booking.save({ session });
    session.commitTransaction();
  } catch (err) {
    return console.log(err);
  }
  if (!booking) {
    return res.status(500).json({ message: "unable to create a movie" });
  }
  return res.status(200).json({ booking });
};

export const getBookingById = async (req, res, next) => {
  const id = req.params.id;
  let booking;
  try {
    booking = await Bookings.findById(req.querry.id);
  } catch (err) {
    return console.log(err);
  }
  if (!booking) {
    return res.status(500).json({ message: "Unexpected Error " });
  }
  return res.status(200).json({ booking });
};

export const deleteBooking = async (req, res) => {
  const id = req.params.id;
  let booking;
  try {
    booking = await Bookings.findByIdAndDelete(id);
    console.log(booking);
    const session = await mongoose.startSession();
    session.startTransaction();
    // await booking.user.bookings.pull(booking);
    // await booking.movie.bookings.pull(booking);
    // await booking.movie.save({ session });
    // await booking.user.save({ session });
  } catch (err) {
    return console.log(err);
  }
  if (!booking) {
    return res.status(404).json({ message: "unable to delete" });
  }
  return res.status(202).json({ message: "Deleted Successfully" });
};
