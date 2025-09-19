import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface WaterfallDataPoint {
  label: string;
  value: number;
  type: 'positive' | 'negative' | 'total' | 'subtotal';
  category?: string;
}

interface WaterfallChartProps {
  data: WaterfallDataPoint[];
  width?: number;
  height?: number;
  colors?: {
    positive: string;
    negative: string;
    total: string;
    subtotal: string;
  };
}

const WaterfallChart: React.FC<WaterfallChartProps> = ({
  data,
  width = 600,
  height = 400,
  colors = {
    positive: '#10B981',
    negative: '#EF4444',
    total: '#3B82F6',
    subtotal: '#8B5CF6'
  }
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 60, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Calculate cumulative values and positions
    let cumulativeValue = 0;
    const processedData = data.map((d, i) => {
      let startValue = cumulativeValue;
      
      if (d.type === 'total' || d.type === 'subtotal') {
        startValue = 0;
        cumulativeValue = d.value;
      } else {
        cumulativeValue += d.value;
      }

      return {
        ...d,
        startValue,
        endValue: d.type === 'total' || d.type === 'subtotal' ? d.value : cumulativeValue,
        cumulativeValue: cumulativeValue
      };
    });

    // Scales
    const xScale = d3.scaleBand()
      .domain(processedData.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.3);

    const allValues = processedData.flatMap(d => [d.startValue, d.endValue, d.cumulativeValue]);
    const yExtent = d3.extent(allValues) as [number, number];
    const yRange = yExtent[1] - yExtent[0];
    const yScale = d3.scaleLinear()
      .domain([yExtent[0] - yRange * 0.1, yExtent[1] + yRange * 0.1])
      .range([innerHeight, 0]);

    // Create tooltip
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "waterfall-tooltip")
      .style("position", "absolute")
      .style("background", "rgba(0, 0, 0, 0.8)")
      .style("color", "white")
      .style("padding", "8px 12px")
      .style("border-radius", "6px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("z-index", "1000");

    // Add grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale)
        .tickSize(-innerHeight)
        .tickFormat(() => ""))
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0.3);

    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickFormat(() => ""))
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0.3);

    // Draw bars
    const bars = g.selectAll(".bar")
      .data(processedData)
      .enter().append("g")
      .attr("class", "bar");

    bars.append("rect")
      .attr("x", (d: any) => xScale(d.label)!)
      .attr("width", xScale.bandwidth())
      .attr("y", (d: any) => {
        if (d.type === 'total' || d.type === 'subtotal') {
          return yScale(Math.max(0, d.value));
        }
        return yScale(Math.max(d.startValue, d.endValue));
      })
      .attr("height", (d: any) => {
        if (d.type === 'total' || d.type === 'subtotal') {
          return Math.abs(yScale(d.value) - yScale(0));
        }
        return Math.abs(yScale(d.startValue) - yScale(d.endValue));
      })
      .attr("fill", (d: any) => colors[d.type as keyof typeof colors])
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1)
      .attr("rx", 2)
      .style("cursor", "pointer")
      .on("mouseover", function(event: MouseEvent, d: any) {
        d3.select(this as SVGRectElement).attr("opacity", 0.8);
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(`
          <strong>${d.label}</strong><br/>
          Value: ${d.value.toLocaleString()}<br/>
          Type: ${d.type}<br/>
          ${d.type !== 'total' && d.type !== 'subtotal' ? `Cumulative: ${d.cumulativeValue.toLocaleString()}` : ''}
        `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this as SVGRectElement).attr("opacity", 1);
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

    // Add connecting lines
    for (let i = 0; i < processedData.length - 1; i++) {
      const current = processedData[i];
      const next = processedData[i + 1];
      
      if (current.type !== 'total' && current.type !== 'subtotal' && 
          next.type !== 'total' && next.type !== 'subtotal') {
        g.append("line")
          .attr("x1", xScale(current.label)! + xScale.bandwidth())
          .attr("y1", yScale(current.cumulativeValue))
          .attr("x2", xScale(next.label)!)
          .attr("y2", yScale(current.cumulativeValue))
          .attr("stroke", "#666")
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", "2,2")
          .style("opacity", 0.6);
      }
    }

    // Add value labels
    bars.append("text")
      .attr("x", (d: any) => xScale(d.label)! + xScale.bandwidth() / 2)
      .attr("y", (d: any) => {
        const barTop = d.type === 'total' || d.type === 'subtotal' 
          ? yScale(Math.max(0, d.value))
          : yScale(Math.max(d.startValue, d.endValue));
        return barTop - 5;
      })
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("font-weight", "600")
      .style("fill", "#374151")
      .text((d: any) => d.value.toLocaleString());

    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "middle")
      .style("font-size", "12px");

    g.append("g")
      .call(d3.axisLeft(yScale).tickFormat((d: any) => d3.format(".0s")(d as number)))
      .selectAll("text")
      .style("font-size", "11px");

    // Add zero line
    if (yScale.domain()[0] < 0 && yScale.domain()[1] > 0) {
      g.append("line")
        .attr("x1", 0)
        .attr("x2", innerWidth)
        .attr("y1", yScale(0))
        .attr("y2", yScale(0))
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .style("opacity", 0.5);
    }

    // Cleanup tooltip on unmount
    return () => {
      d3.selectAll(".waterfall-tooltip").remove();
    };
  }, [data, width, height, colors]);

  return (
    <div className="waterfall-chart-container">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="waterfall-chart"
      />
    </div>
  );
};

export default WaterfallChart;