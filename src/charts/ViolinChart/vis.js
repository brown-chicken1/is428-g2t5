import * as d3 from 'd3';


const draw = (props) => {

    let data = props.data;

// set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 150, left: 40},
        width = 1000 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    d3.select(".vis-ViolinChart > *").remove(); // select css


    let allDataTemp = data;
    data = [];


    for (let i = 0; i < allDataTemp.length; i++) {
        data.push
        ({
            id: allDataTemp[i].ID,
            name: allDataTemp[i].Name,
            sex: allDataTemp[i].Sex,
            age: allDataTemp[i].Age,
            height: allDataTemp[i].Height,
            weight: allDataTemp[i].Weight,
            team: allDataTemp[i].Team,
            noc: allDataTemp[i].NOC,
            games: allDataTemp[i].Games,
            year: allDataTemp[i].Year,
            season: allDataTemp[i].Season,
            city: allDataTemp[i].City,
            sport: allDataTemp[i].Sport,
            event: allDataTemp[i].Event,
            medal: allDataTemp[i].Medal,
        })
    }

    // console.log(data);


    data = data.filter(function (d) {
        return d.height != 'NA'
    });

    data.map(d => {
            if (d.medal === 'NA') {
                d.medal = 0
            } else if (d.medal === 'Bronze') {
                d.medal = 1
            } else if (d.medal === 'Silver') {
                d.medal = 2
            } else if (d.medal === 'Gold') {
                d.medal = 3
            }
        }
    );

    // console.log(data);

    data.sort(function (element_a, element_b) {
        return element_b.medal - element_a.medal;
    });

    data.sort(function (element_a, element_b) {
        return element_a.sport - element_b.sport;
    });

    data.sort(function (element_a, element_b) {
        return element_a.id - element_b.id;
    });
    // console.log(data);


    var dataPreProc = data;
    data = [];
    data.push(dataPreProc[1]);
    // accounting for the double counting of athletes

    // first run just removes duplicate medals
    for (let i = 1; i < dataPreProc.length; i++) {
        // remove extra medals for the same sport
        if (dataPreProc[i].id === dataPreProc[i - 1].id) {
            if (dataPreProc[i].sport != dataPreProc[i - 1].sport) {
                data.push(dataPreProc[i]);
            }
        } else {
            data.push(dataPreProc[i]);
        }
    }

    // console.log(data);


    // append the svg object to the body of the page
    var svg = d3.select(".vis-ViolinChart") // select css
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // make axis

    let totalSport = new Set();
    //console.log(data);
    //console.log(data.length);

    if (data[0]) {
        for (let i = 0; i < data.length; i++) {
            totalSport.add(data[i].sport)
        }

    }

    // totalSport = [...new Set(totalSport)];
    //console.log(totalSport);


    // Show the Y scale
    var y = d3.scaleLinear()
        .domain([120, 220])
        .range([height, 0])


    var dataGold;
    var dataSilver;
    var dataBronze;
    var dataNA;

    if (data[0]) {
        dataGold = data.filter(function (d) {
            return d.medal === 3
        });
        dataSilver = data.filter(function (d) {
            return d.medal === 2
        });
        dataBronze = data.filter(function (d) {
            return d.medal === 1
        });
        dataNA = data.filter(function (d) {
            return d.medal === 0
        });


        // declare the histogram (the bins)
        var histogram = d3.bin()
            .domain(y.domain())
            .thresholds(y.ticks(20))    // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
            .value(d => d)

        var sumstat = d3
            .rollup(data, function (d) {
                let input = d.map(function (g) {
                    return g.height;
                })    // Keep the variable called height
                let median = d3.quantile(d.map(function (g) {
                    return g.height;
                }).sort(d3.ascending), .5)
                let bins = histogram(input)   // And compute the binning on it.
                return [bins, median];
            }, d => d.sport);

        var sumstatGold = d3
            .rollup(dataGold, function (d) {
                let input = d.map(function (g) {
                    return g.height;
                })    // Keep the variable called height
                let median = d3.quantile(d.map(function (g) {
                    return g.height;
                }).sort(d3.ascending), .5)
                let bins = histogram(input)   // And compute the binning on it.
                return [bins, median];
            }, d => d.sport);

        var sumstatSilver = d3
            .rollup(dataSilver, function (d) {
                let input = d.map(function (g) {
                    return g.height;
                })    // Keep the variable called height
                let median = d3.quantile(d.map(function (g) {
                    return g.height;
                }).sort(d3.ascending), .5)
                let bins = histogram(input)   // And compute the binning on it.
                return [bins, median];
            }, d => d.sport);

        var sumstatBronze = d3
            .rollup(dataBronze, function (d) {
                let input = d.map(function (g) {
                    return g.height;
                })    // Keep the variable called height
                let median = d3.quantile(d.map(function (g) {
                    return g.height;
                }).sort(d3.ascending), .5)
                let bins = histogram(input)   // And compute the binning on it.
                return [bins, median];
            }, d => d.sport);

        var sumstatNA = d3
            .rollup(dataNA, function (d) {
                let input = d.map(function (g) {
                    return g.height;
                })    // Keep the variable called height
                let median = d3.quantile(d.map(function (g) {
                    return g.height;
                }).sort(d3.ascending), .5)
                let bins = histogram(input)   // And compute the binning on it.
                return [bins, median];
            }, d => d.sport);        //console.log(sumstat);

        // https://stackoverflow.com/questions/56795743/how-to-convert-map-to-array-of-object/56795800
        let sumstatArray = Array.from(sumstat, ([key, value]) => ({key, value}));
        sumstatArray = sumstatArray.sort((a, b) => (a.value[1] > b.value[1] ? 1 : -1));

        let sumstatGoldArray = Array.from(sumstatGold, ([key, value]) => ({key, value}));
        sumstatGoldArray = sumstatGoldArray.sort((a, b) => (a.value[1] > b.value[1] ? 1 : -1));

        let sumstatSilverArray = Array.from(sumstatSilver, ([key, value]) => ({key, value}));
        sumstatSilverArray = sumstatSilverArray.sort((a, b) => (a.value[1] > b.value[1] ? 1 : -1));

        let sumstatBronzeArray = Array.from(sumstatBronze, ([key, value]) => ({key, value}));
        sumstatBronzeArray = sumstatBronzeArray.sort((a, b) => (a.value[1] > b.value[1] ? 1 : -1));

        let sumstatNAArray = Array.from(sumstatNA, ([key, value]) => ({key, value}));
        sumstatNAArray = sumstatNAArray.sort((a, b) => (a.value[1] > b.value[1] ? 1 : -1));

        // console.log(sumstatArray);
        // console.log(sumstatSilverArray);
        // console.log(sumstatBronzeArray);
        // // What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
        var maxNum = 0
        for (let i = 0; i < sumstatArray.length; i++) {
            let allBins = sumstatArray[i].value[0]
            let lengths = allBins.map(function (a) {
                return a.length;
            })
            let longuest = d3.max(lengths)
            if (longuest > maxNum) {
                maxNum = longuest
            }
        }

        var maxNumGold = 0
        for (let i = 0; i < sumstatGoldArray.length; i++) {
            let allBins = sumstatGoldArray[i].value[0]
            let lengths = allBins.map(function (a) {
                return a.length;
            })
            let longuest = d3.max(lengths)
            if (longuest > maxNumGold) {
                maxNumGold = longuest
            }
        }

        let totalSport2 = sumstatArray.map(x => x.key);

        var x = d3.scaleBand()
            .range([0, width])
            .domain(totalSport2)
            .paddingInner(1)
            .paddingOuter(.5);


        svg.append("g")
            .attr("id", "yAxis")
            .style("font-size", 30)
            .call(d3.axisLeft(y))

        svg.append("g")
            .attr("id", "xAxis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "center")
            .attr("dx", "0em")
            .attr("dy", ".90em")
            .attr("transform", "translate(100,0)")
            .attr("transform", "rotate(0)");


        var xNum = d3.scaleLinear()
            .range([0, 100])
            .domain([-3000, 3000])


        function findSport(d) {
            for (let i = 0; i < sumstatArray.length; i++) {
                if (d === sumstatArray[i].value[0]) {
                    return i; // return the index of the sport
                }
            }
        }


        // Add the shape to this svg!
        svg
            .selectAll("myViolin")
            .data(sumstatArray)
            .enter()        // So now we are working group per group
            .append("g")
            .attr("transform", function (d) {
                let translateAmount = x(d.key) - 50;
                return ("translate(" + translateAmount + " ,0)")
            }) // Translation on the right to be at the group position
            .append("path")
            .datum(function (d) {
                return (d.value[0])
            })     // So now we are working bin per bin
            .style("stroke", "none")
            .style("stroke-width", "1px")
            .style("opacity", 1)
            .style("fill", "#008ecc")
            // .text(function(d){ return "MOOOO";})
            .attr("d", d3.area()

                .x0(function (d) {
                    // cons
                    // console.log(d.length);
                    // console.log(xNum(-d.length));
                    return (xNum(-d.length))
                })
                .x1(function (d) {
                    return (xNum(d.length))
                })
                .y(function (d) {
                    // console.log(d.x0);
                    // console.log(y(d.x0));
                    return (y(d.x0))
                })
                .curve(d3.curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
            )
            .on('click', function (d) {
                d3.select(this)
                    .style("fill", "#0000cc")

                drawSubChart(props, d, sumstatArray, sumstatGoldArray, sumstatSilverArray, sumstatBronzeArray, sumstatNAArray);
                // svg.selectAll('')
            })
            .on("mouseover", function (event, d) { // For d3@v5 or an earlier version, it should be: function(d) {
                d3.select(this)
                    .style("fill", "#0000cc")
             })
            .on("mouseout", function (event, d) { // For d3@v5 or an earlier version, it should be: function(d) {
                d3.select(this)
                    .style("fill", "#008ecc")
                            })
            .append("title")
            .text(function (d) {
                    const sport = findSport(d)
                    let tempLength = 0
                    for (let i = 0; i < sumstatArray[sport].value[0].length; i++) {
                        tempLength += sumstatArray[sport].value[0][i].length
                    }

                    return "Sport: " + sumstatArray[sport].key + "\nMedian Height: " + sumstatArray[sport].value[1] + " cm" +
                        "\nUnique Athletes: " + tempLength;
                }
            )
        ;
  }

}


function drawSubChart(props, d, sumstatArray, sumstatGoldArray, sumstatSilverArray, sumstatBronzeArray, sumstatNAArray) {

    // console.log(sumstatArray);
    // console.log(sumstatGoldArray[0].value[0]);
    // console.log(sumstatSilverArray[0].value[0]);
    // console.log(sumstatBronzeArray[0].value[0]);
    // console.log(sumstatNAArray[0].value[0]);

    const xAxisVal = [120, 125, 130,
        135, 140, 145, 150, 155, 160, 165,
        170, 175, 180, 185, 190, 195, 200,
        205, 210, 215, 220]

    const margin = {top: 10, right: 30, bottom: 150, left: 40},
        width = 1000 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    function findSport() {
        for (let i = 0; i < sumstatArray.length; i++) {
            if (d.target.__data__ === sumstatArray[i].value[0]) {
                return i; // return the index of the sport
            }
        }
    }

    function makeGraphDetails(histoData, xAxisVal) {
        // find total length
        let numberOfAthletes = 0;
        for (let i = 0; i < histoData.length; i++) {
            numberOfAthletes += histoData[i].length
        }

        let playerDict = []
        for (let i = 0; i < histoData.length; i++) {
            playerDict.push({
                key: xAxisVal[i],
                value: histoData[i].length / numberOfAthletes
            })
        }
        return playerDict
    }

    function findMaxAmongAll(achievementCategory) {
        var currMax = achievementCategory[0].value
        for (let i = 0; i < achievementCategory.length; i++) {
            if (achievementCategory[i].value > currMax) {
                currMax = achievementCategory[i].value
            }
        }
        return currMax;
    }

    const chosenSport = findSport()


    const allPeople = makeGraphDetails(sumstatArray[chosenSport].value[0], xAxisVal);
    const goldMedal = makeGraphDetails(sumstatGoldArray[chosenSport].value[0], xAxisVal);
    const silverMedal = makeGraphDetails(sumstatSilverArray[chosenSport].value[0], xAxisVal);
    const bronzeMedal = makeGraphDetails(sumstatBronzeArray[chosenSport].value[0], xAxisVal);
    const noMedal = makeGraphDetails(sumstatNAArray[chosenSport].value[0], xAxisVal);

    let maxValues = Math.max(findMaxAmongAll(allPeople), findMaxAmongAll(goldMedal), findMaxAmongAll(silverMedal), findMaxAmongAll(bronzeMedal), findMaxAmongAll(noMedal));


    // find
    // the
    // maximum
    // value
    // for the Y
    // axis


    // define the chart
    var svg = d3.select(".vis-subPhysicalChart")

    // Show the Y scale
    var y = d3.scaleLinear()
        .domain([0, Math.max(maxValues) + 0.1])
        .range([height, 0])

    var x = d3.scaleLinear()
        .domain([120, 220])
        .range([0, width])

    // Gold Medallists

    // Gold medallists
    svg.selectAll("#goldPath").data(goldMedal)
        .join(
            function (enter) {
                return enter.datum(goldMedal)
                    .append("path")
                    .attr("id", "goldPath")
                    .attr("fill", "rgba(255, 215, 0, 0.05)")
                    .attr("d", d3.area()
                        .x(function (d) {
                            return x(d.key)
                        })
                        .y0(y(0))
                        .y1(function (d) {
                            return y(d.value)
                        })
                        .curve(d3.curveBumpX))
                    .attr("transform", "translate(50,30)")
                    .transition().duration(1000)

            },
            function (update) {
                return update.datum(goldMedal)
                    .transition().duration(1000)
                    .attr('fill', 'rgba(255,215, 0, 0.05)')
                    .attr("d", d3.area()
                        .x(function (d) {
                            return x(d.key)
                        })
                        .y0(y(0))
                        .y1(function (d) {
                            return y(d.value)
                        })
                        .curve(d3.curveBumpX))

            },
        )
        .append("title")
        .text(function (d) {
                return "MOO MOO COW"
            }
        )

    svg.selectAll("#goldLine").data(goldMedal)
        .join(
            function (enter) {
                return enter.datum(goldMedal)
                    .append("path")
                    .attr("id", "goldLine")
                    .attr('fill', 'rgba(255,255,255,0)')
                    .attr("stroke", "#777777")
                    .attr("stroke-width", 1.5)
                    .attr("d", d3.line()
                        .x(function (d) {
                            return x(d.key)
                        })
                        .y(function (d) {
                            return y(d.value)

                        })
                        .curve(d3.curveBumpX))

                    .attr("transform", "translate(50,30)")
                    .transition().duration(1000)

            },
            function (update) {
                return update.datum(goldMedal)
                    .transition().duration(1000)
                    .attr('fill', 'rgba(255,255,255,0)')
                    .attr("stroke", "#777777")
                    .attr("stroke-width", 1.5)
                    .attr("d", d3.line()
                        .x(function (d) {
                            return x(d.key)
                        })
                        .y(function (d) {
                            return y(d.value)
                        })
                        .curve(d3.curveBumpX))

            },
        )
        .on("mouseover", function (event, d) {
            svg.selectAll("#goldPath").raise()
                .style("fill", "rgba(255, 215, 0, 0.10)")
            d3.select(this)
                .raise()
        })
        .on("mouseout", function (event, d) {
            d3.select(this)
                .lower()
            svg.selectAll("#goldPath").lower()
                .style("fill", "rgba(255, 215, 0, 0.05)")
        })


    ;

    ;

    // Silver Medallists
    svg.selectAll("#silverPath").data(silverMedal)
        .join(
            function (enter) {
                return enter.datum(silverMedal)
                    .append("path")
                    .attr("id", "silverPath")
                    .attr("fill", "rgba(192, 192, 192, 0.1)")
                    .attr("d", d3.area()
                        .x(function (d) {
                            return x(d.key)
                        })
                        .y0(y(0))
                        .y1(function (d) {
                            return y(d.value)
                        })
                        .curve(d3.curveBumpX))
                    .attr("transform", "translate(50,30)")
                    .transition().duration(1000)

            },
            function (update) {
                return update.datum(silverMedal)
                    .transition().duration(1000)
                    .attr("fill", "rgba(192, 192, 192, 0.1)")
                    .attr("d", d3.area()
                        .x(function (d) {
                            return x(d.key)
                        })
                        .y0(y(0))
                        .y1(function (d) {
                            return y(d.value)
                        })
                        .curve(d3.curveBumpX))
            },
        )
    svg.selectAll("#silverLine").data(silverMedal)
        .join(
            function (enter) {
                return enter.datum(silverMedal)
                    .append("path")
                    .attr("id", "silverLine")
                    .attr("fill", "rgba(0,0,0,0)")
                    .attr("stroke", "#777777")
                    .attr("stroke-width", 1.5)
                    .attr("d", d3.line()
                        .x(function (d) {
                            return x(d.key)
                        })
                        .y(function (d) {
                            return y(d.value)

                        })
                        .curve(d3.curveBumpX))

                    .attr("transform", "translate(50,30)")
                    .transition().duration(1000)
            },
            function (update) {
                return update.datum(silverMedal)
                    .transition().duration(1000)
                    .attr('fill', 'rgba(0,0,0,0)')
                    .attr("stroke", "#777777")
                    .attr("stroke-width", 1.5)
                    .attr("d", d3.line()
                        .x(function (d) {
                            return x(d.key)
                        })
                        .y(function (d) {
                            return y(d.value)
                        })
                        .curve(d3.curveBumpX))

            },
        )
        .on("mouseover", function (event, d) {
            svg.selectAll("#silverPath").raise()
                .style("fill", "rgba(192, 192, 192, 0.20)")
            d3.select(this)
                .raise()
        })
        .on("mouseout", function (event, d) {
            d3.select(this)
                .lower()
            svg.selectAll("#silverPath").lower()
                .style("fill", "rgba(192,192,192, 0.10)")
        })


    ;

    // BRONZE MEDALLISTS
    svg.selectAll("#bronzePath").data(bronzeMedal)
        .join(
            function (enter) {
                return enter.datum(bronzeMedal)
                    .append("path")
                    .attr("id", "bronzePath")
                    .attr('fill', 'rgba(205,127,50,0.025)')
                    .attr("d", d3.area()
                        .x(function (d) {
                            return x(d.key)
                        })
                        .y0(y(0))
                        .y1(function (d) {
                            return y(d.value)

                        })
                        .curve(d3.curveBumpX))
                    .attr("transform", "translate(50,30)")
                    .transition().duration(1000)
            },
            function (update) {
                return update.datum(bronzeMedal)
                    .transition().duration(1000)
                    .attr('fill', 'rgba(205,127,50,0.025)')
                    .attr("d", d3.area()
                        .x(function (d) {
                            return x(d.key)
                        })
                        .y(y(0))
                        .y1(function (d) {
                            return y(d.value)
                        })
                        .curve(d3.curveBumpX))

            },
        )


    svg.selectAll("#bronzeLine").data(bronzeMedal)
        .join(
            function (enter) {
                return enter.datum(bronzeMedal)
                    .append("path")
                    .attr("id", "bronzeLine")
                    .attr("fill", "rgba(0,0,0,0)")
                    .attr("stroke", "#CD7F32")
                    .attr("stroke-width", 1.5)
                    .attr("d", d3.line()
                        .x(function (d) {
                            return x(d.key)
                        })
                        .y(function (d) {
                            return y(d.value)

                        })
                        .curve(d3.curveBumpX))

                    .attr("transform", "translate(50,30)")
                    .transition().duration(1000)
            },
            function (update) {
                return update.datum(bronzeMedal)
                    .transition().duration(1000)

                    .attr('fill', 'rgba(0,0,0,0)')
                    .attr("stroke", "#CD7F32")
                    .attr("stroke-width", 1.5)
                    .attr("d", d3.line()
                        .x(function (d) {
                            return x(d.key)
                        })
                        .y(function (d) {
                            return y(d.value)
                        })
                        .curve(d3.curveBumpX))

            },
        )
        .on("mouseover", function (event, d) {
            svg.selectAll("#bronzePath").raise()
                .style("fill", "rgba(205,127,50,0.05)")
            d3.select(this)
                .raise()
        })
        .on("mouseout", function (event, d) {
            d3.select(this)
                .lower()
            svg.selectAll("#bronzePath").lower()
                .style("fill", "rgba(205,127,50, 0.025)")
        })


    ;
    // all other athletes
    svg.selectAll("#naPath").data(noMedal)
        .join(
            function (enter) {
                return enter.datum(noMedal)
                    .append("path")
                    .attr("id", "naPath")
                    .attr('fill', 'rgba(230,230,230,0.025)')
                    .attr("d", d3.area()
                        .x(function (d) {
                            return x(d.key)
                        })
                        .y0(y(0))
                        .y1(function (d) {
                            return y(d.value)

                        })
                        .curve(d3.curveBumpX))
                    .attr("transform", "translate(50,30)")
                    .transition().duration(1000)
            },
            function (update) {
                return update.datum(noMedal)
                    .transition().duration(1000)
                    .attr('fill', 'rgba(230,230,230,0.015)')
                    .attr("d", d3.area()
                        .x(function (d) {
                            return x(d.key)
                        })
                        .y(y(0))
                        .y1(function (d) {
                            return y(d.value)
                        })
                        .curve(d3.curveBumpX))

            },
        )


    svg.selectAll("#naLine").data(noMedal)
        .join(
            function (enter) {
                return enter.datum(noMedal)
                    .append("path")
                    .attr("id", "naLine")
                    .attr("fill", "rgba(0,0,0,0)")
                    .attr("stroke", "rgb(220, 220, 220)")
                    .attr("stroke-width", 1.5)
                    .attr("d", d3.line()
                        .x(function (d) {
                            return x(d.key)
                        })
                        .y(function (d) {
                            return y(d.value)

                        })
                        .curve(d3.curveBumpX))

                    .attr("transform", "translate(50,30)")
                    .transition().duration(1000)
            },
            function (update) {
                return update.datum(noMedal)
                    .transition().duration(1000)
                    .attr('fill', 'rgba(0,0,0,0)')
                    .attr("stroke", 'rgb(220, 220, 220)')
                    .attr("stroke-width", 1.5)
                    .attr("d", d3.line()
                        .x(function (d) {
                            return x(d.key)
                        })
                        .y(function (d) {
                            return y(d.value)
                        })
                        .curve(d3.curveBumpX))

            },
        )
        .on("mouseover", function (event, d) {
            svg.selectAll("#naPath").raise()
                .style("fill", "rgba(230,230,230,0.3)")
            d3.select(this)
                .raise()
        })
        .on("mouseout", function (event, d) {
            d3.select(this)
                .lower()
            svg.selectAll("#naPath").lower()
                .style("fill", "rgba(230,230,230, 0.015)")
        })


    ;

    // smooth axes transition
    svg.select(".yaxis")
        .transition().duration(1000)
        .call(d3.axisLeft(y))

    svg.select(".xaxis")
        .transition().duration(1000)
        .call(d3.axisBottom(x))

}


// find javacsript key by value
// https://stackoverflow.com/questions/9907419/how-to-get-a-key-in-a-javascript-object-by-its-value
// https://www.d3-graph-gallery.com/graph/line_basic.html
// https://stackoverflow.com/questions/49319648/remove-outline-along-the-axes-in-d3-js-area-chart
// https://stackoverflow.com/questions/58322806/d3-join-enter-called-instead-of-update
// https://stackoverflow.com/questions/25146333/update-second-chart-on-mouseover
// https://stackoverflow.com/questions/63416477/d3-js-getting-x-axis-to-transition-smoothly-in-a-time-series-graph-for-each-sec

// https://bl.ocks.org/bumbeishvili/63841a5dcf018b902457fa80d5c5d83e
// https://stackoverflow.com/questions/56795743/how-to-convert-map-to-array-of-object/56795800

// https://www.d3-graph-gallery.com/graph/violin_basicHist.html
export default draw;
