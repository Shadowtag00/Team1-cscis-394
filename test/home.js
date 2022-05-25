const server = require('../server');
const request = require('supertest');
const expect = require('chai').expect;
//var sinon = require("sinon");
var app = require('../server');
const { assert } = require('chai');

const userCredentials = {
    "username" : "homeTest",
    "password" : "homeTest"
}

var authenticatedUser = request.agent(app);
//var alert;
before(function(done){
    //alert = sinon.spy();
    authenticatedUser
        .post('/login')
        .send(userCredentials)
        .end(function(err,res){
            expect(res.statusCode).to.equal(302);
            expect('Location', '/home');
            done();
        });
});
describe('The home page', function(err){
  
    it('Should render the homepage on login', function(done){
        authenticatedUser.get('/home')
            .expect(200)
            .end(done)
    });

    it('Should refresh the homepage when a valid comment is posted.', function(done){
        authenticatedUser.post('/home')
            .send({
                "comment_box" : "This is a test."
            })
            .expect(302)
            .expect('Location', '/')
            .end(done)
    });

    it('Should refresh the homepage when a profane comment is posted.', function(done){
        authenticatedUser.post('/home')
            .send({
                "comment_box" : "fuck test."
            })
            .expect(302)
            .expect('Location', '/')
            .end(done)
    });

    it('Should redirect to reply page after choosing to reply', function(done){
        authenticatedUser.get('/home/39/reply')
            .expect(200)
            .end(done)
    });
});
