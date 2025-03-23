const User = require("../Model/UserModel");

const getAllUsers = async (req, res, next) => {

    let Users;
    // get all users
    try{
        users = await User.find();
    }catch (err) {
        console.log(err);
    }
    //not found
    if(!users){
        return res.status(404).json({message:"User not found"});
    }
    // Display all users
    return res.status(200).json({ users});
};

//data insert
const addUsers = async (req, res, next) => {

    const {firstName,lastName,email,farmName,area,startDate,typeOfRice,password} = req.body;

    try{
        users = new User({firstName,lastName,email,farmName,area,startDate,typeOfRice,password});
        await users.save();
    }catch (err){
        console.log(err);
    }
    //not insert users
    if (!users){
        return res.status(404).send({message:"unable to add users"});
    }
    return res.status(200).json({ users });
};

//Get by Id
const getById = async (req,res,next) => {

    const id = req.params.id;

    let user;

    try {
        user = await User.findById(id);
    }catch (err) {
        console.log(err);
    }
    //not available users
    if (!user){
        return res.status(404).send({message:"User not found"});
    }
    return res.status(200).json({ user });
}

//Update User Details
const updateUser = async (req, res, next) => {

    const id = req.params.id;
    const {firstName,lastName,email,farmName,area,startDate,typeOfRice,password} = req.body;

    let users;

    try{
        users = await User.findByIdAndUpdate(id,
            { firstName: firstName,  lastName: lastName, email: email, farmName: farmName, area: area, startDate: startDate, typeOfRice: typeOfRice, password: password});
            users = await users.save();
    }catch(err) {
        console.log(err);
    }
    if (!users){
        return res.status(404).send({message:"Unable to update user"});
    }
    return res.status(200).json({ users });
};

//Delete User Details
const deleteUser = async (req, res, next) => {
    const id = req.params.id;
    
    let user;

    try{
       user = await User.findByIdAndDelete(id) 
    }catch (err) {
        console.log(err);
    }
    if (!user){
        return res.status(404).send({message:"Unable to Delete user details"});
    }
    return res.status(200).json({ user });
};

exports.getAllUsers = getAllUsers;
exports.addUsers = addUsers;
exports.getById = getById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;