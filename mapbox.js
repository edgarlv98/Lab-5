const credentials = require('./credentials.js')
const request = require('request')

const darkSky = function(latitud, longitud, callback){
    const url = 'https://api.darksky.net/forecast/'+credentials.DARK_SKY_SECRET_KEY+'/'+latitud+','+longitud+'?'+'lang=es&units=si'
    request(url, function(error, response, body){
        const parsedBody = JSON.parse(body)
        if(error){
            //callback("Sin servicio", undefined)
            console.log("Sin servicio")
        } else if(parsedBody.code == '400'){
            //callback(parsedBody.error, undefined)
            console.log(parsedBody.error)
        } else {
            const currentInfo = parsedBody.currently
            const info = {
                temperatura: currentInfo.temperature,
                resumen: currentInfo.summary,
                probabilidad: currentInfo.precipProbability
            }
            console.log(`${info.resumen}. Actualmente esta a ${info.temperatura}°C. Hay ${info.probabilidad * 100}% de lluvia.`)
        }
    })
}

const mapBox = function(city, callback){
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+city+'.json?access_token='+credentials.MAPBOX_TOKEN
    request(url, function(error,response,body){
        const parsedBody = JSON.parse(body);
        if(error){
            console.log("Sin servicio")
            //callback("La ciudad no existe", undefined)
        } else if(parsedBody.message == 'Not Authorized - Invalid Token'){
            console.log(parsedBody.message)
            //callback(parsedBody.message, undefined)
        }
        else if(parsedBody.features == 0){
            console.log('La ciudad no existe')
            //callback(parsedBody.message, undefined)
        } else {
            const info = {
                longitud: parsedBody.features[0].center[0],
                latitud: parsedBody.features[0].center[1]
            }
            darkSky(info.latitud, info.longitud)
        }
    })
}

module.exports = {
    darkSky: darkSky,
    mapBox: mapBox
}