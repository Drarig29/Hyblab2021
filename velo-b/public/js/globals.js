function overrideAnim(data) {
    anime.remove(data.targets);
    anime(data);
}

const initButtons = function () {
    d3.selectAll('.fancy-button').on('mouseover', function () {
        overrideAnim({
            targets: this,
            scale: 0.95
        });
    });

    d3.selectAll('.fancy-button').on('mouseout', function () {
        overrideAnim({
            targets: this,
            scale: 1
        });
    });
};
