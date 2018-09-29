const Joi = require('joi')
const authentication = require('../ultis/authentication')

module.exports = [
    {
        method: 'GET',
        path: '/',
        options: {
            handler: async (request, h) => {
                let user = request.auth.credentials
                return 'It works! Well done,'+user.name
            }
        }
    },
    {
        method: ['GET'],
        path: '/login',
        options: {
            auth: { mode: 'try' },
            handler: async (request, h) => {
                return h.file('./view/login.html')
            }
        }
    },
    {
        method: ['POST'],
        path: '/login',
        options: {
            auth: { mode: 'try' },
            handler: async (request, h) => {
                let username = request.payload.username
                let pwd = request.payload.password
                let auth = await authentication.authenticateByUserInfo(username, pwd)
                var cookie_options = {
                    ttl: 365 * 24 * 60 * 60 * 1000, // expires a year from today
                    encoding: 'none',    // we already used JWT to encode
                    isSecure: false,      // warm & fuzzy feelings
                    isHttpOnly: true,    // prevent client alteration
                    clearInvalid: false, // remove invalid cookies
                    strictHeader: true,  // don't allow violations of RFC 6265
                    path: '/'            // set the cookie for all routes
                }
                if (auth.token) {
                    h.state("token", auth.token, cookie_options)
                    return auth
                } else {
                    return auth
                }
            },
            description: 'User login by token',
            notes: 'user login to the website by token,return token to the browser',
            tags: ['api'], // ADD THIS TAG
            validate: {
                payload: {
                    username: Joi.string()
                        .alphanum().min(3).max(30).required()
                        .description('username'),
                    password: Joi.string()
                        .regex(/^[a-zA-Z0-9]{3,30}$/).required()
                        .description('password'),
                }
            }
        }
    }
]
