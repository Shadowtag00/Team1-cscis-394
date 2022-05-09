const server = require('../server');
const request = require('supertest');
const expect = require('chai').expect;

describe('The express server', function(err){
    var app;

    before(function(done){
        app = server.listen(3000, function(err){
            if(err) {return done(err);}
            done();
        });
    });

    if('Should render the login page for the root path', function(done){

        request(server)
            .get('/')
            .expect('Content-Type', /html/)
            .expect(200, function(err,res) {
                if(err) {return done(err);}

                done();
            });
    });

    after(function(done){
        app.close(function(){
            done();
        });
    });











});