import mongoose from "mongoose";
import {USER_ROLES} from "../utils/constants.js"
const userSchema = new mongoose.Schema                                                                                  ({
    name:{
        type: String,
        required:[true,"Name is required"],
        maxlength : [50,"Name cannot exceed 50 characters"],
    } ,
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,"Please provide a valid email address"],
        trim:true,
        lowercase:true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
        select: false,
    },
    role:{
        type:String,
        enum:{
            values:Object.values(USER_ROLES),
            message: "Role must be admin, restaurant_owner or client",
        } ,
        default:USER_ROLES.CLIENT,
    },
    phone:{
        type:String,
    },
    address:{
        type:String,
    },

},
    {timestamps:true}
);
const User = mongoose.model("User",userSchema);
export default User;    