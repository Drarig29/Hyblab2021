// SLIDE CHOIX BICLOO


let initSlideChoixBicloo = function () {
  
  /*==================== Fleches ===========================*/

  const idFlecheD = '#fleche-droite-bycl';
  const idFlecheG = '#fleche-gauche-bycl';
  const nextD = 'choix-transport-4';
  const nextG = 'choix-transport-2';
  arrowbutton(idFlecheD, nextD);
  arrowbutton(idFlecheG, nextG);

  /*====================Bouton du bas ===========================*/
  d3.select('#plus-info-bicloo').on('click', function () {
    overrideAnim({
      targets: '#plus-info-bicloo',
      scale: 0
    });
    mySlidr.slide('info-choix-bicloo');
    initSlideInfosBicloo();
  });

  const infoSelection = 'infos-selection-bicloo';
  const idOkButton = '#ok-bicloo';
  okbutton(idOkButton,infoSelection);
  infobutton();

};

// SLIDE CHOIX TRANSPORT EN COMMUN


let initSlideChoixTransport = function () {

  const idFlecheD = '#fleche-droite-trans';
  const idFlecheG = '#fleche-gauche-trans';
  const nextD = 'choix-transport-1';
  const nextG = 'choix-transport-3';
  arrowbutton(idFlecheD, nextD);
  arrowbutton(idFlecheG, nextG);



  /*====================Bouton du bas ===========================*/
  d3.select('#plus-info-transports').on('click', function () {
    overrideAnim({
      targets: '#plus-info-transports',
      scale: 0
    });
    mySlidr.slide('info-choix-transports');
    initSlideInfosTransports();
  });


  const infoSelection = 'infos-selection-transport';
  const idOkButton = '#ok-transport';
  okbutton(idOkButton,infoSelection);
  infobutton();

  /*======================= Changer de Image Transport ===========================*/

  d3.select('#transport').on('click', function () {
    changeImage(this);
  });

  d3.select('#transport').on('click', function () {
    changeImage(this);
  });


};

// SLIDE CHOIX VELO

let initSlideChoixVelo = function () {

  /*==================== Fleches ===========================*/

  const idFlecheD = '#fleche-droite-velo';
  const idFlecheG = '#fleche-gauche-velo';
  const nextD = 'choix-transport-3';
  const nextG = 'choix-transport-1';
  arrowbutton(idFlecheD, nextD);
  arrowbutton(idFlecheG, nextG);

  /*====================Bouton du bas ===========================*/

  d3.select('#plus-info-velo').on('click', function () {
    overrideAnim({
      targets: ['#plus-info-velo'],
      scale: 0
    });
    mySlidr.slide('info-choix-velo');
    initSlideInfosVelo();
  });

  const infoSelection = 'infos-selection-velo';
  const idOkButton = '#ok-velo';
  okbutton(idOkButton,infoSelection);
  infobutton();

};

// SLIDE CHOIX VOITURE

let initSlideChoixVoiture = function () {
  
   /*==================== Fleches ===========================*/

   const idFlecheD = '#fleche-droite-voit';
   const idFlecheG = '#fleche-gauche-voit';
   const nextD = 'choix-transport-2';
   const nextG = 'choix-transport-4';
   arrowbutton(idFlecheD, nextD);
   arrowbutton(idFlecheG, nextG);
 
   /*====================Bouton du bas ===========================*/

  
   d3.select('#plus-info-voiture').on('click', function () {
    overrideAnim({
      targets: '#plus-info-voiture',
      scale: 0
    });
    mySlidr.slide('info-choix-voiture');
    initSlideInfosVoiture();
  });

  const infoSelection = 'infos-selection-voiture';
  const idOkButton = '#ok-voiture';
  okbutton(idOkButton,infoSelection);
  infobutton();
}


let arrowbutton = function (idButton, page) {
  d3.select(idButton).on('click', function () {
    overrideAnim({
      targets: idButton,
      scale: 1
    });
    mySlidr.slide(page);
    if (page == 'choix-transport-1') { //on va sur la page voiture
      initSlideChoixVoiture();
    }
    else if (page == 'choix-transport-2') { //on va sur la page velo
      initSlideChoixVelo();
    }
    else if (page == 'choix-transport-3') { //on va sur la page bicloo
      initSlideChoixBicloo();
    }
    else if (page == 'choix-transport-4') { //on va sur la page transport
      initSlideChoixTransport();
    }
  });

  d3.select(idButton).on('mouseover', function () {
    overrideAnim({
      targets: idButton,
      scale: 1.2
    });

  });

  d3.select(idButton).on('mouseout', function () {
    overrideAnim({
      targets: idButton,
      scale: 1
    });
  });

}

let okbutton = function (idbutton,page) {

  d3.select(idbutton).on('click', function () {
    overrideAnim({
      targets: idbutton,
      scale: 0
    });
    mySlidr.slide(page);
    if (page == 'infos-selection-voiture') {
      initSlideSelectionVoiture();
    }
    else if (page == 'infos-selection-velo') {
      initSlideSelectionVelo();
    }
    else if (page == 'infos-selection-bycloo') {
      initSlideSelectionBycloo();
    }
    else if (page == 'infos-selection-transport') {
      initSlideSelectionTransport();
    }
  });

}

let infobutton = function (page) {
  d3.select('#plus-info').on('click', function () {
    overrideAnim({
      targets: '#plus-info',
      scale: 0
    });
    mySlidr.slide('page-finale');
    initSlide2();
  });
}


function changeImage(element) {
  var attr = element.getAttribute("src");

  if (attr == "assets/choix/transportCommun1.svg")
    element.setAttribute("src", "assets/choix/transportCommun2.svg");
  else if (attr == "assets/choix/transportCommun2.svg")
    element.setAttribute("src", "assets/choix/transportCommun3.svg");
  else if (attr == "assets/choix/transportCommun3.svg")
    element.setAttribute("src", "assets/choix/transportCommun1.svg");
  else
    element.setAttribute("src", "assets/choix/transportCommun3.svg");
}




