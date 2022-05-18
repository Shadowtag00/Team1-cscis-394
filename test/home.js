const server = require('../server');
const request = require('supertest');
const expect = require('chai').expect;

describe('The home page', function(err){
    var app;

    before(function(done){
        app = server.listen(3000, function(err){
            if(err) {return done(err);}
            done();
        });
    });
    /*
    it('Should display all unflagged comments when loading the homepage', function(done){
        request(server)
            .get('/home')
    });
    */
    after(function(done){
        app.close(function(){
            done();
        });
    });

});