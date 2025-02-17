import * as d3 from "d3";

const drawSubChart = (props) => {

    console.log("Hello!!!!!");
    const xAxisVal = [120, 125, 130,
        135, 140, 145, 150, 155, 160, 165,
        170, 175, 180, 185, 190, 195, 200,
        205, 210, 215, 220]

    const margin = {top: 10, right: 30, bottom: 150, left: 40},
        width = 1000 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    // define the chart
    var svg = d3.select(".vis-subPhysicalChart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    // Show the Y scale
    var y = d3.scaleLinear()
        .domain([0, 0.5])
        .range([height, 0])

    var x = d3.scaleLinear()
        .domain([120, 250])
        .range([0, width])

    svg.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(50,30)")
        .call(d3.axisLeft(y))

    svg.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(50,670)")
        .call(d3.axisBottom(x))


}

export default drawSubChart;