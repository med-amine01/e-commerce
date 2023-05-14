//check if the user is admin
module.exports = function (req,res,next){
    //401 unauthorized
    //403 forbidden
    if(!req.user_token.isAdmin)
        return res.status(401).send('You are not authorise to do this action.');
    next();
}