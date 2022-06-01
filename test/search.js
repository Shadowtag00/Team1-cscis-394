const server = require('../server');
const request = require('supertest');
const expect = require('chai').expect;
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
describe('A user searching for another user', function(err){
    
    it('Should render search results when searching a user', function(done){
        authenticatedUser.get('/search')
            .expect(200)
            .end(done)
    });

});