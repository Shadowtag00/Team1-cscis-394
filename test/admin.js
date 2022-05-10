const server = require('../server');
const request = require('supertest');
const expect = require('chai').expect;

describe('The admin page', function(err){
    var app;

    before(function(done){
        app = server.listen(3000, function(err){
            if(err) {return done(err);}
            done();
        });
    });

    /*

    ADD TESTS HERE

    */

    after(function(done){
        app.close(function(){
            done();
        });
    });

});