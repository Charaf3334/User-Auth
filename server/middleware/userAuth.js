import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) => {

    const {token} = req.cookies // we extract the token from the user's cookies

    if (!token) // no token means the user is not logged in
        return res.json({success: false, message: 'Not authorized. Try to login again'})

    try {

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET) // this verifies the JWT using the secret key, if its valid it will return the decoded payload

        if (tokenDecode.id) {
            req.body = req.body || {}; // ensure body is defined
            req.body.userId = tokenDecode.id; // we assign that id to be the request body userId
        }
        else // no id means not authorized
            return res.json({success: false, message: 'Not authorized. Try to login again'})

        next() // this will execute the controller function
        
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export default userAuth