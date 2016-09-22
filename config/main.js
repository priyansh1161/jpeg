module.exports.dev = {
    db : 'mongodb://127.0.0.1:27017/pintrest',
    apiURI : 'http://127.0.0.1:3000/api'
};
module.exports.production = {
    apiURI : 'https://jpeg.herokuapp.com/api',
    db : 'mongodb://test:test@ds046549.mlab.com:46549/jpeg'
};