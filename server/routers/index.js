const routeList = {
    Login: require('./login')
  }
  
  module.exports.routes = function (server) {
    for (let k in routeList) {
      let rs = routeList[k]
      server.route(rs)
    }
  }