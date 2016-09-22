var mongoose = require('mongoose');
var configure = require('../../config/main');

var config = configure.dev;
if(process.env.NODE_ENV=='production')
    config = configure.production;
var dbURI = config.db;
mongoose.connect(dbURI,function (err) {
    if(err)
        console.log('mongoose error ',err);
    else
        console.log('connected to '+dbURI);
});
mongoose.connection.on('disconnected',function () {
    console.log('Disconnected from Db at ',dbURI);
});

var gracefullShutdown = function (msg,cb) {
    console.log('Disconnected from db due to '+msg);
    cb();
}

process.once('SIGUSR2',function () {
   gracefullShutdown('SIGUSR2',function () {
        process.kill(process.pid,'SIGUSR2');
   });
});
// process.on('SIGKILL',function () {
//     gracefullShutdown('SIGKILL',function () {
//         process.exit(0);
//     });
// });
process.on('SIGINT',function () {
    gracefullShutdown('SIGINT',function () {
        process.exit(0);
    });
});
process.on('SIGTERM',function () {
    gracefullShutdown('SIGTERM',function () {
        process.exit(0);
    });
});
require('./card');
require('./user');