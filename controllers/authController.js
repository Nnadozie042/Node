const User=require("../models/userModel")
const {hashPassword,comparePassword}=require("../helper/auth")
const jwt=require("jsonwebtoken")

const test = (req, res) => {
    
    res.json("hellow world my name is ugwu nnadozie ebere")

}

const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body
        //checking of name

        if (!name) {
            return res.json({ error: "name is required" })
        };

        //checking of password

        if (!password || password.lenth < 6) {
            return res.json({
                error: "password is required and should be more than 6"
            })
        }
        //checking of email
        const exist = await User.findOne({ email: email })
        if (exist) {
            res.json({ error: "email is already taken" })
        }

       const hashedPassword=await hashPassword(password)
        // creating a new user
        const user = await User.create({
            name,
            email,
            password:hashedPassword
        })
        return res.json(user)

    } catch (err) {
        console.log(err)
    }

}

//check if user exist

const loginUser=async(req,res)=>{
    
    try{

        const {email,password}=req.body

        const user=await User.findOne({email:email})
        if(!user){
            return res.json({error:"no user found"})
        }
        //check if password match

        const match= await comparePassword(password,user.password)

        if(match){
            jwt.sign({email:user.email,id:user._id, name:user.name},process.env.JWT_SECRET,{},(err,token)=>{

                if(err)throw err;
                res.cookie("token",token).json(user)

            })
        }

        if(!match){
             return res.json({error:"password doesnot match"})
        }

    }catch(err){
      console.log(err)
    }
}

const getProfile=(req,res)=>{
    const{token}=req.cookies

    if(token){
        jwt.verify(token,process.env.JWT_SECRET,{},(err,user)=>{
            if(err) throw err;
            res.json(user)
        }
        )
    }else{
        res.json(null)
    }};

module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile
}