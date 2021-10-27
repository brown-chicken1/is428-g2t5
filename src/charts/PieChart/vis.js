import * as d3 from 'd3';

/**
 * Bumpchart Module
 */
 var bumpChart = (function() {
        const compact = drawingStyle === "compact";
        const svg = d3.create("svg")
          .attr("cursor", "default")
          .attr("viewBox", [0, 0, width, height]);
        
        svg.append("g")
          .attr("transform", `translate(${margin.left + padding},0)`)
          .selectAll("path")
          .data(seq(0, quarters.length))
          .join("path")
          .attr("stroke", "#ccc")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "5,5")
          .attr("d", d => d3.line()([[bx(d), 0], [bx(d), height - margin.bottom]]));
        
        const series = svg.selectAll(".series")
          .data(chartData)
          .join("g")
          .attr("class", "series")
          .attr("opacity", 1)
          .attr("fill", d => color(d[0].rank))
          .attr("stroke", d => color(d[0].rank))
          .attr("transform", `translate(${margin.left + padding},0)`)
          .on("mouseover", highlight)
          .on("mouseout", restore);
        
        series.selectAll("path")
          .data(d => d)
          .join("path")
          .attr("stroke-width", strokeWidth(drawingStyle))
          .attr("d", (d, i) => { 
            if (d.next) 
              return d3.line()([[bx(i), by(d.rank)], [bx(i + 1), by(d.next.rank)]]);
          });
        
        const bumps = series.selectAll("g")
          .data((d, i) => d.map(v => ({territory: territories[i], profit: v, first: d[0].rank})))
          .join("g")
          .attr("transform", (d, i) => `translate(${bx(i)},${by(d.profit.rank)})`)
          //.call(g => g.append("title").text((d, i) => `${d.territory} - ${quarters[i]}\n${toCurrency(d.profit.profit)}`)); 
          .call(title);
        
        bumps.append("circle").attr("r", compact ? 5 : bumpRadius);
        bumps.append("text")
          .attr("dy", compact ? "-0.75em" : "0.35em")
          .attr("fill", compact ? null : "white")
          .attr("stroke", "none")
          .attr("text-anchor", "middle")    
          .style("font-weight", "bold")
          .style("font-size", "14px")
          .text(d => d.profit.rank + 1);   
        
        svg.append("g").call(g => drawAxis(g, 0, height - margin.top - margin.bottom + padding, d3.axisBottom(ax), true));
        const leftY = svg.append("g").call(g => drawAxis(g, margin.left, 0, d3.axisLeft(y.domain(left))));
        const rightY = svg.append("g").call(g => drawAxis(g, width - margin.right, 0, d3.axisRight(y.domain(right)))); 
        
        return svg.node();
        
        function highlight(e, d) {       
          this.parentNode.appendChild(this);
          series.filter(s => s !== d)
            .transition().duration(500)
            .attr("fill", "#ddd").attr("stroke", "#ddd");
          markTick(leftY, 0);
          markTick(rightY,  quarters.length - 1);
          
          function markTick(axis, pos) {
            axis.selectAll(".tick text").filter((s, i) => i === d[pos].rank)
              .transition().duration(500)
              .attr("font-weight", "bold")
              .attr("fill", color(d[0].rank));
          }
        }
        
        function restore() {
          series.transition().duration(500)
            .attr("fill", s => color(s[0].rank)).attr("stroke", s => color(s[0].rank));    
          restoreTicks(leftY);
          restoreTicks(rightY);
          
          function restoreTicks(axis) {
            axis.selectAll(".tick text")
              .transition().duration(500)
              .attr("font-weight", "normal").attr("fill", "black");
          }
        }

        drawAxis = (g, x, y, axis, domain) => {
            g.attr("transform", `translate(${x},${y})`)
              .call(axis)
              .selectAll(".tick text")
              .attr("font-size", "12px");
            
            if (!domain) g.select(".domain").remove();
          }

        title = g => g.append("title")
            .text((d, i) => `${d.territory} - ${quarters[i]}\nRank: ${d.profit.rank + 1}\nProfit: ${toCurrency(d.profit.profit)}`)

        strokeWidth = d3.scaleOrdinal()
            .domain(["default", "transit", "compact"])
            .range([5, bumpRadius * 2 + 2, 2]);

        bx = d3.scalePoint()
            .domain(seq(0, quarters.length))
            .range([0, width - margin.left - margin.right - padding * 2])
})();