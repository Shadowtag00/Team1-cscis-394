const server = require('../server');
const request = require('supertest');
const expect = require('chai').expect;
var app = require('../server');
const { assert } = require('chai');

const userCredentials = {
    "username" : "test",
    "password" : "test"
}
var authenticatedUser = request.agent(app);
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
describe('The user profile page', function(err){

    it('Should render the users profile page when choosing My Posts', function(done){
        authenticatedUser.get('/profile')
            .expect(200)
            .end(done)
    });

    it('Should redirect to the My Post page when deleting a users comment', function(done){
        authenticatedUser.get('/profile/69/deleteComment')//using random comment from homeTest account
            .expect(302)
            .expect('Location', '/profile')
            .end(done)
    });

    it('Should redirect to login page when user chooses to delete profile', function(done){
        authenticatedUser.get('/profile/test/delete')
            .expect(302)
            .expect('Location', '/')
            .end(done)
    });

});