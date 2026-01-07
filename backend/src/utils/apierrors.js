import { Error } from "mongoose";

class apierrors extends Error{
    constructor(
        statuscode,
        error=[],
        message = "Something went wrong",
        stack = ""

    ){
super(message)
this.message = message;
this.error = error
this.statuscode = statuscode;
this.success = "false";
this.data = null
if(stack){
    this.stack = stack;
}else{
    Error.captureStackTrace(this,this.constructor)
}
    }
};
export{apierrors}
