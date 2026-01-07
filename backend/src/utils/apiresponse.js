class apiresponse{
    constructor( statuscode,data, message="SUCCESS"){
        this.statuscode= statuscode,
        this.data = data,
        this.message = message,
        this.success= statuscode
    }
}
export {apiresponse}