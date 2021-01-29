const initSplashscreen = function () {
    const anim = bodymovin.loadAnimation({
        container: document.getElementById('logo-anim'),
        path: 'assets/logo-anim.json',
        renderer: 'svg',
        loop: false
    });

    anim.setSpeed(2.5);

    anim.addEventListener("data_ready", () => {
        setTimeout(() => {
            mySlidr.slide('page-accueil');
            initSlide1();
        }, 2000);
    });
};
