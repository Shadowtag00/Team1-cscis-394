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

    it('Should render the login page for the root path', function(done){

        request(server)
            .get('/')
            .expect('Content-Type', /html/)
            .expect(200, function(err,res) {
                if(err) {return done(err);}

                done();
            });
    });

    it('Should not respond to PUT requests for the root path', function(done){
        request(server)
            .put('/')
            .expect(404, function(err, res){
                if(err) {return done(err);}

                done();
            });
    });

    it('Should respond to valid user login input with a redirect to the homepage', function(done){
        request(server)
            .post('/login')
            .send({
                "username": "test",
                "password": "test"
            })
            .expect(302)
            .expect('Location', '/home')
            .end(done);
    });


    it('Should respond to valid admin login input with a redirect to the admin page', function(done){
        request(server)
            .post('/login')
            .send({
                "username": "admin",
                "password": "Team1Password"
            })
            .expect(302)
            .expect('Location', '/admin')
            .end(done);
    });


    it('Should respond to trying to login with no credentials with an error', function(done){
        request(server)
            .post('/login')
            .expect(400)
            .end(done);
    });



    //tests for register page
    it('Should render the register page when choosing to register', function(done){

        request(server)
            .get('/register')
            .expect('Content-Type', /html/)
            .expect(200, function(err,res) {
                if(err) {return done(err);}

                done();
            });
    });


    it('Should not respond to PUT requests for the register path', function(done){
        request(server)
            .put('/register')
            .expect(404, function(err, res){
                if(err) {return done(err);}

                done();
            });
    });


    it('Should respond to valid user registration input with a redirect to the login page', function(done){
        request(server)
            .post('/register')
            .send({
                "firstname" : "first",
                "lastname": "last",
                "username": "user",
                "password": "password"
            })
            .expect(302)
            .expect('Location', '/')
            .end(done);
    });


    it('Should respond to trying to register with incorrect or no credentials with an error', function(done){
        request(server)
            .post('/register')
            .expect(400)
            .end(done);
    });
    
    after(function(done){
        app.close(function(){
            done();
        });
    });











});