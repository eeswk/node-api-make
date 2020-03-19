const assert = require('assert')
//검증 라이브러리
const should = require('should')
// API 테스트 (통합테스트)
// 익스프레스 통합 테스트용 라이브러리
const request = require('supertest')

const app = require('./index')

//모카 테스트코드를 돌려주는 테스트 러너
//테스트 꾸러미: 테스트환경으로 모카에서는 describe()으로 구현
//테스트 케이스: 실제 테스트를 말하며 모카에서 it()으로 구현
describe('GET /users', () => {
    describe('성공', () => {
        //테스트코드
        it('배열을 반환한다.', (done) => {
            //assert.equal(1, 1)
            //(1).should.equal(1)
            request(app)
                .get('/users')            
                .end((err, res) => {
                    res.body.should.be.instanceof(Array)
                    res.body.forEach(user => {
                        user.should.have.property('name')
                    })
                    //console.log(res.body);                 
                    
                    //테스트 종료함수
                    done() 
                })
        })
        it('최대 limit 갯수 만큼 응답한다.', (done) => {
        request(app)
            .get('/users?limit=2')
            .end((err, res) => {
                res.body.should.have.lengthOf(2)
                done()
            })
        })
    })
    describe('실패', () => {
        it('limit 정수가 아니면 400을 응답한다.', done => {
            request(app)
                .get('/users?limit=one')
                .expect(400)
                .end(done)
        })
    })
})

describe('GET /users/:id', () => {
    describe('성공', () => {
        it('유저 객체를 반환한다', done =>{
            request(app)
            .get('/users/1')
            .end((err, res) => {          
                res.body.should.have.property('id', 1)
                done()
            })
        })
    })
    describe('실패', () => {
        it('id가 숫자가 아닐경우 400 응답', done =>{
            request(app)
            .get('/users/one')
            .expect(400)
            .end(done)
        })        
        it('유저를 찾을 수 없는 경우 404 응답', done =>{
            request(app)
            .get('/users/123')
            .expect(404)
            .end(done)
        })
    })

    describe('DELETE /users/:id', () => {
        describe('성공', () => {
            it('204 응답', done => {
                request(app)
                .delete('/users/3')
                .expect(204)
                .end(done)
            })
        })
        describe('실패', () => {
            it('id가 숫자가 아닐경우 400', done => {
                request(app)
                .delete('/users/three')
                .expect(400)
                .end(done)
            })
        })
        /*
        describe('실패', () => {
            it('id가 없는 경우 400', done => {
                request(app)
                .delete('/users/4')
                .expect(400)
                .end(done)
            })
        })
        */        
    })

    describe('POST /users', ()=> {
        describe('성공', () => {
            it('201 응답, 생성한 유저 객체를 응답', done => {
                request(app)
                    .post('/users')
                    .send({name: 'Daniel'})
                    .expect(201)
                    .end((err, res) => {          
                        res.body.should.have.property('name', 'Daniel')
                        done()
                    })                    
            })
        })
        describe('실패', () => {
            it('name이 없으면 400 응답', done => {
                request(app)
                .post('/users')
                .send({})
                .expect(400)
                .end(done)                                  
            })
            it('name이 중복이면 409 응답', done => {
                request(app)
                    .post('/users')
                    .send({name: 'Alice'})
                    .expect(409)
                    .end(done)                    
            })            
        })
    })
})
