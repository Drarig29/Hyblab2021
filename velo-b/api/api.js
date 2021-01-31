'use strict';

// import des module Utiles
const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');
const config = require('../config');


let proxy = {
    agent: new HttpsProxyAgent( 'http://cache.ha.univ-nantes.fr:3128'),
};

const API_NANTES_ROUTES = {
    parcs_relais: "https://data.nantesmetropole.fr/api/records/1.0/search/?dataset=244400404_parcs-relais-nantes-metropole-disponibilites&q=&lang=fr&facet=grp_nom&facet=grp_statut&rows=-1",
    disponibilites_bicloo: "https://data.nantesmetropole.fr/api/records/1.0/search/?dataset=244400404_stations-velos-libre-service-nantes-metropole-disponibilites&q=&lang=fr&facet=banking&facet=bonus&facet=status&facet=contract_name&rows=-1",
    places_parking: "https://data.nantesmetropole.fr/api/records/1.0/search/?dataset=244400404_parkings-publics-nantes-disponibilites&q=&lang=fr&facet=grp_nom&facet=grp_statut&rows=-1",
}

const QUARTIERS = ["nord","sud","est","ouest","centre", "all"]

function loadJSONFile(file_name){
    let rawdata = fs.readFileSync(`./velo-b/api/data/${file_name}`);
    let jsondata = JSON.parse(rawdata);
    return jsondata
}

// export de notre application vers le serveur principal
module.exports = () => {

    // création d'une app express
    const app = express();

    // routes depuis les fichiers json
    app.get('/quartiers/:quartier', JsonRoute((req) => getLocalJSONData('quartiers.json', req.params['quartier'])));
    app.get('/abris-velo/:quartier', JsonRoute((req) => getLocalJSONData('abris-velo.json', req.params['quartier'])));
    app.get('/amenagements-cyclables/:quartier', JsonRoute((req) => getLocalJSONData('amenagements-cyclables.json', req.params['quartier'])));
    app.get('/gonfleurs-libre-service/:quartier', JsonRoute((req) => getLocalJSONData('gonfleurs-libre-service.json', req.params['quartier'])));
    app.get('/stations-velo-libre-service/:quartier', JsonRoute((req) => getLocalJSONData('stations-velo-libre-service.json', req.params['quartier'])));
    app.get('/arrets-tan/:quartier', JsonRoute((req) => getLocalJSONData('arrets-tan.json', req.params['quartier'])));
    app.get('/velocistes/:quartier', JsonRoute((req) => getLocalJSONData('velocistes.json', req.params['quartier'])));
    app.get('/services-velos-bicloo/', JsonRoute(() => getLocalJSONData('tarifs-bicloo.json')));

    // routes depuis l'api de nantes metropole
    app.get('/disponibilites-parcs-relais/:quartier', JsonRoute((req) => fetchData(API_NANTES_ROUTES.parcs_relais, req.params['quartier'])));
    app.get('/disponibilites-places-parking/:quartier', JsonRoute((req) => fetchData(API_NANTES_ROUTES.places_parking, req.params['quartier'])));
    app.get('/disponibilites-bicloo/:quartier', JsonRoute((req) => fetchData(API_NANTES_ROUTES.disponibilites_bicloo, req.params['quartier'])));

    app.get('/update/', (req,res) => update(req, res));

    app.get('*', (req, res) => {
        res.status(404).send(JSON.stringify({error:{message:'Point d\'entrée inexistant.', code:404}}))
    });

    function getLocalJSONData(file_name, quartier){
        if(!QUARTIERS.includes(quartier)){
            throw {message:"Quartier invalide", code:400};
        }
        let data;
        try {
            data = loadJSONFile(file_name);
        }catch (e){
            // Faire appel à la route update si ce message apparait
            throw {message:"Données indisponnibles", code:503, error_content:e};
        }
        if(quartier === "all"){
            return Array.isArray(data)?data:Object.values(data).reduce((acc, val) => acc.concat(val), []);
        }else{
            return data[quartier]
        }
    }

    // utilitaire pour créer une route qui envoie du json
    function JsonRoute(callback) {
        return async function(req, res) {
            res.set({
                'Content-Type': 'application/json',
                'charset': 'utf-8'
            });
            try {
                res.status(200).send(JSON.stringify(await callback(req, res)));
            }catch (e){
                const err = e
                if(err.code){
                    err.code = err.code?err.code:500
                }
                res.status(err.code).send(JSON.stringify({error:err}));
            }
        };
    }

    async function update(req, res) {
        const api_routes = loadJSONFile('nantes-api-fetcher.json');
        const quartiers = loadJSONFile('quartiers.json');
        let liste_arrets;
        let liste_bicloo;
        for (const o of api_routes) {
            let data = {};
            if (o.quartiers) {
                for (const k of Object.keys(quartiers)) {
                    data[k] = await fetchData(o.route, k);
                }
            } else {
                data = await fetchData(o.route);
            }
            // save temporaire
            if(o.fileName === 'arrets-tan.json'){
                liste_arrets = data;
                // skip to next for value
                continue;
            }
            // save temporaire
            else if(o.fileName === 'stations-velo-libre-service.json'){
                liste_bicloo = Object.values(data).flat();
            }
            fs.writeFileSync(`./velo-b/api/data/${o.fileName}`, JSON.stringify(data));
        }
        // for each key get the value and map it to add bicloo_near
        Object.keys(liste_arrets).forEach(k => {
            liste_arrets[k].map(ar => ar.bicloo_near = IsBiclooNear(ar, liste_bicloo));
        })
        fs.writeFileSync(`./velo-b/api/data/arrets-tan.json`, JSON.stringify(liste_arrets));
        res.status(200).send('Done');
    }

    function IsBiclooNear(arret, stations_bicloos)
    {
        return (undefined !== stations_bicloos.find(station =>
            (arret.stop_coordinates[1] - station.geo_shape.coordinates[0]) ** 2
            +(arret.stop_coordinates[0] - station.geo_shape.coordinates[1]) ** 2 < 0.000001
        ))
    }

    /*
    @param base_url: string
    @param quartier?: string ("nord","sud","est","ouest")
     */
    async function fetchData(base_url, quartier=undefined){
        let url = base_url;
        if(quartier) {
            if(!QUARTIERS.includes(quartier)){
                throw {message:"Quartier invalide", code:400};
            }
            const quartiers = loadJSONFile('quartiers.json');
            if(quartier !== "all") {
                const polygon_api = quartiers[quartier].reduce((acc, val) => acc + `(${val[0]}%2C${val[1]})%2C`, '').slice(0, -3);
                url += '&geofilter.polygon=' + polygon_api;
            }
        }
        let response;
        try{
            response = await fetch(url, config.env==='prod'?proxy:undefined);
        } catch (e) {
            throw {message:"Une erreur inconnue est survenue.", code:500, error_content:e};
        }
        return (await response.json()).records.map(r => r.fields);
    }

    return app;
}
