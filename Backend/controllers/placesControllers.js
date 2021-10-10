const HttpError = require("../models/httpError");
const uuid = require("uuid");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const Place = require("../models/placeSchema");
const User = require("../models/userSchema");
var Dummy_Array = [
  {
    id: "p1",
    desc: "this is the description of the world p1",
    info: "this is the information in this beautiful world p1",
    user: "u1",
  },
  {
    id: "p2",
    desc: "this is the description of the world p2",
    info: "this is the information in this beautiful world p2",
    user: "u2",
  },
  {
    id: "p3",
    desc: "this is the description of the world p3",
    info: "this is the information in this beautiful world p3",
    user: "u1",
  },
];

/////////

const getPlacesByPlaceId = async (req, res, next) => {
  const pid = req.params.id;
  let place;
  try {
    place = await Place.findById(pid);
  } catch (error) {
    const err = new HttpError("Sorry something went wrong", 500);
    return next(err);
  }
  if (!place) {
    const err = new HttpError("Place with given id is not found", 500);
    return next(err);
  }
  res.json({ place: place.toObject({ getters: true }) });
  console.log("This is the get method");
};

//////////

const getPlacesByUserId = async (req, res, next) => {
  const userid = req.params.uid;
  let place;
  try {
    place = await Place.find({ user: userid });
  } catch (error) {
    const err = HttpError("Sorry something went wrong", 500);
    return next(err);
  }
  if (!place) {
    const error = new HttpError(
      "Sorry! No places found with the given user ID.",
      404
    );
    return next(error);
  }
  res.json({ place });
};

const form = (req, res) => {
  res.send(
    '<form action="/api/project/users" method="POST"><input type="text" name="userName"/><button type="submit">Submit</button></form>'
  );
};

///////////
const addPlaces = async (req, res, next) => {
  const error = validationResult(req);

  const { title, desc, info, user } = req.body;
  if (!error.isEmpty()) {
    console.log(error);
    const httpError = new HttpError(error.msg, 422);
    return next(httpError);
  }
  let placeWithTitle;
  try {
    placeWithTitle = await Place.findOne({ title: title });
  } catch (error) {
    return next(new HttpError("something went wrong!"));
  }
  if (placeWithTitle) {
    return next(new HttpError("place with same title exists", 500));
  }
  let userExist;
  try {
    userExist = await User.findById(user);
  } catch (error) {
    return next(new HttpError("Somthing went wrong", 500));
  }

  if (!userExist) {
    return next(new HttpError("The given user doesnot exists!"));
  }

  const place = Place({
    title,
    desc,
    info,
    user,
  });
  try {
    //const sess = await mongoose.startSession({retryWrites:false});
    console.log("1");
    //sess.startTransaction();
    console.log("2");
    await place.save();
    console.log("3");
    userExist.places.push(place);
    console.log("4");
    await userExist.save();
    console.log("5");
    //await sess.commitTransaction();
    console.log("6");
  } catch (error) {
    return next(
     error
    );
  }

  res.json({ message: place });

  // Dummy_Array.push(place)
};

///////

const updateById = async (req, res, next) => {
  const pid = req.params.pid;
  const { desc, info, user } = req.body;
  let place;
  try {
    place = await Place.findById(pid);
  } catch (error) {
    const err = new HttpError("sorry something went wrong", 500);
    return next(err);
  }
  if (!place) {
    const error = new HttpError(
      "sorry the place with the given id not found ",
      404
    );
    return next(error);
  }

  //   const newPlace = {
  //     id: pid,
  //     desc: desc,
  //     info: info,
  //     user: user,
  //   };
  //   const index = Dummy_Array.indexOf(place);
  //   Dummy_Array[index] = newPlace;

  place.desc = desc;
  place.info = info;
  place.user = user;
  try {
    await place.save();
  } catch (error) {
    const err = new HttpError("something went wrong!", 500);
    return next(err);
  }
  res.json({
    message: "place updated",
    place: place.toObject({ getters: true }),
  });
};

const deletePlace = async (req, res, next) => {
  const pid = req.params.pid;
  let place;
  try {
    place = await Place.findById(pid);
  } catch (error) {
    const err = new HttpError("something went wrong !", 404);
    return next(err);
  }
  if (!place) {
    return next(
      new HttpError("couldnt find the place with the given place id", 404)
    );
   
    }
    let user;
    try{
        user = await User.findById(place.user)
    }catch(error){
        return next(error)
console.log(user)
  }
  try {
    await Place.deleteOne(place);
     user.places.pull(place)
     await user.save()
  } catch (error) {
    return next(error);
  }
  res.status(200).json({ place: place });
};

exports.getPlacesByPlaceId = getPlacesByPlaceId;
exports.getPlacesByUserId = getPlacesByUserId;
exports.form = form;
exports.addPlaces = addPlaces;
exports.updateById = updateById;
exports.deletePlace = deletePlace;
