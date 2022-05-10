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

    it('Should redirect (refresh) homepage when user posts a comment', function(done){
        request(server)
            .post('/home')
            .send({
                "comment_box": "test"
            })
            .expect(302)
            .expect('Location', '/home')
            .end(done);
    });

    after(function(done){
        app.close(function(){
            done();
        });
    });

});