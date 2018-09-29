const JWT = require('jsonwebtoken')
const config = require('../../config/config')
const users = require('../../config/test_data').registedUsers
module.exports = {
    /**
     * Authenticate function for input username and pwd
     * @username username input 
     * @pwd pwd input
     */
    authenticateByUserInfo: async (username, pwd) => {
        //This is a demo oprate 
        let message = ''
        if (!username || !pwd) {
            message = 'Missing username or password'
        } else {
            account = users[username]
            if (!account || account.password !== pwd) {
                message = 'Invalid username or password'
            }
        }
        if (message) {
            return { status: 0, message: message }
        }

        //Signature by jwt
        let userInfo = users[username]
        
        //jwt cannot catain any sensitive user info
        delete userInfo.password 
        const token = JWT.sign(userInfo, config.tokenSecret)
        return {status:1,token:token}
    },

    /**
     * Authenticate function for request token ,judge the existence of the user requesting 
     * @decodeToken ->The request token which decoded 
     */
    authenticateByToken: async (decodedToken) => {
        //This is a demo oprate 
        if (!users[decodedToken.username]) {
            return { isValid: false }
        } else {
            return { isValid: true }
        }
    }
}