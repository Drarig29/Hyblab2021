const app = require('../../server');

const chai = require('chai')
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
chai.should();

const routes = [
    "quartiers",
    "amenagements-cyclables",
    "abris-velo",
    "gonfleurs-libre-service",
    "stations-velo-libre-service",
    "arrets-tan",
    "velocistes",
    "services-velos-bicloo",
    "disponibilites-parcs-relais",
    "disponibilites-places-parking",
    "disponibilites-bicloo"]

const quartiers = ['nord','sud','est','ouest','centre']

describe('Test API', () => {
    routes.forEach(r => {
        describe('Test endpoint ' + r, () => {
            if (r !== 'quartiers' && r !== 'services-velos-bicloo')
                describe('Test route /api/' + r + '/' + ((r === 'services-velos-bicloo')?'':'all'), () => {
                    it('Doit retourner les données de la route pour l\'ensemble de Nantes', (done) => {
                        chai.request(app)
                            .get('/api/' + r + '/' + ((r === 'services-velos-bicloo')?'':'all'))
                            .end((err, response) => {
                                expect(err).to.be.null;
                                response.should.have.status(200);
                                response.body.should.be.a('array');
                                done();
                            });
                    })
                })
            if (r !== 'services-velos-bicloo') {
                quartiers.forEach(q => {
                    describe('Test route /api/' + r + '/' + q + '/', () => {
                        it('Doit retourner les données de la route liées à ce quartier', (done) => {
                            chai.request(app)
                                .get('/api/' + r + '/' + q)
                                .end((err, response) => {
                                    expect(err).to.be.null;
                                    response.should.have.status(200);
                                    response.body.should.be.a('array');
                                    done();
                                });
                        })
                    })
                })
                describe('Test route /api/' + r + '/Paramètreinvalide/', () => {
                    it('Doit retourner une erreur', (done) => {
                        chai.request(app)
                            .get('/api/' + r + '/invalidparemeter/')
                            .end((err, response) => {
                                expect(err).to.be.null;
                                response.should.have.status(400);
                                done();
                            });
                    })
                })
            }
        })
    })
    describe('Test route inexistante /api/route/inexistante/', () => {
        it('Doit retourner une erreur', (done) => {
            chai.request(app)
                .get('/api/route/inexistante/')
                .end((err, response) => {
                    expect(err).to.be.null;
                    response.should.have.status(404);
                    done();
                });
        })
    })
})
