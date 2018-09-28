const Joi = require('joi')
const authentication = require('../ultis/authentication')

module.exports = [
    {
        method:'GET',
        path:'/',
        options:{
            handler: async (request, h) => {
                return 'It works!'
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
                return auth
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
