
let HttpProxyAgent = require( 'http-proxy-agent' );

let options = {
    agent: new HttpProxyAgent( 'http://cache.ha.univ-nantes.fr:3128' ),
};
fetch( 'http://adresse_de_votre_requete', options )
// gérer la suite
