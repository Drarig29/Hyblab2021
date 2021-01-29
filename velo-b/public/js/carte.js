const initCarte = function () {
    d3.xml("assets/carte.svg").then(data => {
        const carte = d3.select("#carte");
        carte.node().append(data.documentElement);

        const parts = carte.selectAll("g")
            .on("mouseover", function () {
                parts.style("opacity", .5);
                d3.select(this).style("opacity", 1);
            })
            .on("mouseout", () => parts.style("opacity", 1))
            .on("click", function () {
                console.log(this.id); // selectionné

                mySlidr.slide('choix-transport-2');
                initSlideChoixVelo();
            });
    });
};
