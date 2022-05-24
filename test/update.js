const server = require('../server');
const request = require('supertest');
const expect = require('chai').expect;
var app = require('../server');
const { assert } = require('chai');

const userCredentials = {
    "username" : "updateTest",
    "password" : "updateTest"
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

describe('The profile update page', function(err){

    it('Should render the update form when choosing to update profile', function(done){
        authenticatedUser.get('/update')
            .expect(200)
            .end(done)
    });

    it('Should refresh the update page when first name credentials are updated', function(done){
        authenticatedUser.post('/update')
            .send({
                "firstName" : "newUpdateTest"
            })
            .expect(302)
            .expect('Location', '/update')
            .end(done)
    });

    it('Should refresh the update page when last name credentials are updated', function(done){
        authenticatedUser.post('/update')
            .send({
                "lastName" : "newUpdateTest"
            })
            .expect(302)
            .expect('Location', '/update')
            .end(done)
    });

    it('Should refresh the update page when username credentials are updated', function(done){
        authenticatedUser.post('/update')
            .send({
                "username" : "updateTest"
            })
            .expect(302)
            .expect('Location', '/update')
            .end(done)
    });

    it('Should refresh the update page when password credentials are updated', function(done){
        authenticatedUser.post('/update')
            .send({
                "password" : "updateTest"
            })
            .expect(302)
            .expect('Location', '/update')
            .end(done)
    });

});