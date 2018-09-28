/**
 * An https server demo build by hapijs 17.5.4
 * build by fengqiao
 * email:fengqiaozhu@gmail.com
 * Date:2018-09-28
 * node-version: 10.10.0
 */
const Hapi = require('hapi')
const Path = require('path')
const Inert = require('inert')
const HapiError = require('hapi-error')
const Good = require('good')
const HapiSwagger = require('hapi-swagger')
const HapiAuthJWT = require('hapi-auth-jwt2')
const HapiGate = require('hapi-gate')
const Vision = require('vision')
const HandleBars = require('handlebars')
const fs = require('fs')

const Pack = require('../package')
const config = require('../config/config')
const Authentication = require('../server/ultis/authentication')
const router = require('../server/routers/index')
var host = process.env.HOST || 'localhost'
var port = process.env.PORT || 443

//plugins config
const options = {
    good: {
        ops: {
            interval: 1000
        },
        reporters: {
            myConsoleReporter: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ log: '*', response: '*' }]
            }, {
                module: 'good-console'
            }, 'stdout'],
            myFileReporter: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ ops: '*' }]
            }, {
                module: 'good-squeeze',
                name: 'SafeJson'
            }, {
                module: 'good-file',
                args: ['./test/fixtures/awesome_log']
            }]
        }
    },
    swagger: {
        info: {
            title: 'Hapijs-server-Demo API Documentation',
            version: Pack.version
        },
        lang: 'zh-cn'
    },
    hapiErrorConfig: {
        statusCodes: {
            "401": { // if the statusCode is 401
                "redirect": "/login" // redirect to /login page/endpoint
            }
        }
    }
}

//Instantiation server object
const server = new Hapi.Server({
    host: host,
    port: port,
    routes: {
        cors: {
            origin: 'ignore' //Make the Cross-domain request worked
        }
    },
    tls: {
        key: fs.readFileSync('./server/https_keys/server_no_passwd.key'),
        cert: fs.readFileSync('./server/https_keys/server.crt')
    }
})

const initServer = async () => {
    try {
        // registe the plugins used
        await server.register(Inert) //Define relative path for the project;
        await server.register(HapiAuthJWT) //Build JSON web token authentication for the project
        await server.register(Vision) // Apply engine support
        await server.register({ //resolve the server error
            plugin: HapiError,
            options: options.hapiErrorConfig
        })

        await server.register({ //The monitor of server,write server log into log file,print log in console; 
            plugin: Good,
            options: options.good
        })

        await server.register({ //Swagger API documentation server,auto create api document
            plugin: HapiSwagger,
            options: options.swagger
        })

        await server.register({ //Redirect all http request to https
            plugin: HapiGate,
            options: {
                http: true,
                www: true
            }
        })

        /**
         * Config the jwt authentication
         */
        server.auth.strategy('jwt', 'jwt', {
            key: config.tokenSecret,
            verifyOptions: { ignoreExpiration: true, algorithms: ['HS256'] },
            validate: async function (decoded, request, session) {
                // Function for the authentication with decoded token information
                let auth = await Authentication.authenticateByToken(decoded)
                return auth
            }
        })
        server.auth.default('jwt')

        //Apply engine for the swagger and hapi-error
        server.views({
            engines: {
                html: HandleBars// or Jade or Riot or React etc.
            },
            path: Path.resolve(__dirname, '../view')
        })

        //Mount routers
        router.routes(server)
        await server.start()
        console.log(`Server running @ ${server.info.uri}`)
    } catch (err) {
        throw err
    }
}

initServer()