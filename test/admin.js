const server = require('../server');
const request = require('supertest');
const expect = require('chai').expect;
var app = require('../server');
const { assert } = require('chai');

const userCredentials = {
    "username" : "admin",
    "password" : "Team1Password"
}
var authenticatedUser = request.agent(app);
before(function(done){
    //alert = sinon.spy();
    authenticatedUser
        .post('/login')
        .send(userCredentials)
        .end(function(err,res){
            expect(res.statusCode).to.equal(302);
            expect('Location', '/admin');
            done();
        });
});
describe('The admin page', function(err){

    it('Should render the admin page on login', function(done){
        authenticatedUser.get('/admin')
            .expect(200)
            .end(done)
    });

    it('Should refresh the admin page when a valid comment is posted.', function(done){
        authenticatedUser.post('/admin')
            .send({
                "comment_box" : "This is a test."
            })
            .expect(302)
            .expect('Location', '/admin')
            .end(done)
    });

    it('Should refresh the admin page when a profane comment is posted.', function(done){
        authenticatedUser.post('/admin')
            .send({
                "comment_box" : "fuck test."
            })
            .expect(302)
            .expect('Location', '/admin')
            .end(done)
    });

    it('Should refresh the page when deleting a comment', function(done){
        authenticatedUser.get('/admin/97/delete') //using a random comment id just to see if redirect works correctly
            .expect(302)
            .expect('Location', '/admin')
            .end(done)
    });
    
    it('Should redirect to the admin page after submitting an edit', function(done){
        authenticatedUser.get('/admin/39/edit')
            .expect(200)
            .then((res) => {
                authenticatedUser.post('/admin/submit_edit')
                .send({
                    "comment_box" : "Test edit."
                })
                .expect(302)
                .expect('Location', '/admin')
                .end(done)
            })
    });
    
    it('Should refresh the page when flagging/unflagging a comment', function(done){
        authenticatedUser.get('/admin/51/form') //using comment id 51 for any non-destructive test
            .expect(302)
            .expect('Location', '/admin')
            .end(done)
    });

});