class apierrors extends Error{
    constructor(
        statuscode,
        message = "Something went wrong",
        errors=[],
        stack = ""

    ){
super(message)
this.message = message;
this.errors = errors
this.statuscode = statuscode;
this.success = false;
this.data = null
if(stack){
    this.stack = stack;
}else{
    Error.captureStackTrace(this,this.constructor)
}
    }
};
export{apierrors}