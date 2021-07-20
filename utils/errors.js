class ExpressError extends Error{

    
    constructor(status,msg){
        super();
        this.status=status;
        this.message=msg;
        this.timing=Date.now()
    }
}

module.exports=ExpressError;