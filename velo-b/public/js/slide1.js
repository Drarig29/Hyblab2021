let initSlide1 = function () {

    d3.select('#startButton').on('click', function () {
        overrideAnim({
            targets: '#startButton',
            scale: 0
        });
        mySlidr.slide('page-carte');
        initCarte();
    });

    d3.select('#startButton').on('mouseover', function () {
        overrideAnim({
            targets: '#startButton',
            scale: 1.2
        });
    });

    d3.select('#startButton').on('mouseout', function () {
        overrideAnim({
            targets: '#startButton',
            scale: 1
        });
    });
};
