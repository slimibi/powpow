import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface GaugeChartProps {
  value: number;
  min?: number;
  max?: number;
  title?: string;
  width?: number;
  height?: number;
  thresholds?: Array<{
    min: number;
    max: number;
    color: string;
    label: string;
  }>;
  showLabels?: boolean;
  unit?: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  min = 0,
  max = 100,
  title = "",
  width = 300,
  height = 200,
  thresholds = [
    { min: 0, max: 33, color: '#EF4444', label: 'Low' },
    { min: 33, max: 66, color: '#F59E0B', label: 'Medium' },
    { min: 66, max: 100, color: '#10B981', label: 'High' }
  ],
  showLabels = true,
  unit = ""
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const radius = Math.min(width, height * 2) / 2 - 20;
    const centerX = width / 2;
    const centerY = height - 20;

    const g = svg.append("g")
      .attr("transform", `translate(${centerX}, ${centerY})`);

    // Scales
    const angleScale = d3.scaleLinear()
      .domain([min, max])
      .range([-Math.PI / 2, Math.PI / 2]);

    // Draw background arc
    const arcGenerator = d3.arc()
      .innerRadius(radius - 20)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    g.append("path")
      .attr("d", arcGenerator as any)
      .attr("fill", "#e5e7eb")
      .attr("stroke", "#d1d5db")
      .attr("stroke-width", 1);

    // Draw threshold segments
    thresholds.forEach((threshold, i) => {
      const startAngle = angleScale((threshold.min / 100) * (max - min) + min);
      const endAngle = angleScale((threshold.max / 100) * (max - min) + min);
      
      const thresholdArc = d3.arc()
        .innerRadius(radius - 18)
        .outerRadius(radius - 2)
        .startAngle(startAngle)
        .endAngle(endAngle);

      g.append("path")
        .attr("d", thresholdArc as any)
        .attr("fill", threshold.color)
        .attr("opacity", 0.8);
    });

    // Draw tick marks
    const tickData = d3.range(min, max + 1, (max - min) / 5);
    tickData.forEach((tick: number) => {
      const angle = angleScale(tick);
      const x1 = (radius - 25) * Math.cos(angle);
      const y1 = (radius - 25) * Math.sin(angle);
      const x2 = (radius - 15) * Math.cos(angle);
      const y2 = (radius - 15) * Math.sin(angle);

      g.append("line")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke", "#6b7280")
        .attr("stroke-width", 2);

      if (showLabels) {
        const labelX = (radius - 35) * Math.cos(angle);
        const labelY = (radius - 35) * Math.sin(angle);

        g.append("text")
          .attr("x", labelX)
          .attr("y", labelY)
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .style("font-size", "11px")
          .style("font-weight", "500")
          .style("fill", "#4b5563")
          .text(tick.toString());
      }
    });

    // Draw needle
    const needleAngle = angleScale(Math.min(Math.max(value, min), max));
    const needleLength = radius - 30;

    // Needle line
    g.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", needleLength * Math.cos(needleAngle))
      .attr("y2", needleLength * Math.sin(needleAngle))
      .attr("stroke", "#1f2937")
      .attr("stroke-width", 3)
      .attr("stroke-linecap", "round");

    // Needle center circle
    g.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 6)
      .attr("fill", "#1f2937")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // Value display
    g.append("text")
      .attr("x", 0)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .style("fill", "#1f2937")
      .text(`${value}${unit}`);

    // Title
    if (title) {
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "600")
        .style("fill", "#1f2937")
        .text(title);
    }

    // Create legend if thresholds exist
    if (thresholds.length > 0 && showLabels) {
      const legend = svg.append("g")
        .attr("transform", `translate(10, ${height - 50})`);

      thresholds.forEach((threshold, i) => {
        const legendItem = legend.append("g")
          .attr("transform", `translate(${i * 80}, 0)`);

        legendItem.append("rect")
          .attr("width", 12)
          .attr("height", 12)
          .attr("fill", threshold.color)
          .attr("rx", 2);

        legendItem.append("text")
          .attr("x", 18)
          .attr("y", 6)
          .attr("alignment-baseline", "middle")
          .style("font-size", "11px")
          .style("fill", "#4b5563")
          .text(threshold.label);
      });
    }

    // Add tooltip functionality
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "gauge-tooltip")
      .style("position", "absolute")
      .style("background", "rgba(0, 0, 0, 0.8)")
      .style("color", "white")
      .style("padding", "8px 12px")
      .style("border-radius", "6px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("z-index", "1000");

    // Add invisible overlay for tooltip
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "transparent")
      .style("cursor", "pointer")
      .on("mouseover", function(event: MouseEvent) {
        const currentThreshold = thresholds.find(t => 
          value >= (t.min / 100) * (max - min) + min && 
          value <= (t.max / 100) * (max - min) + min
        );
        
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(`
          <strong>${title || 'Gauge'}</strong><br/>
          Value: ${value}${unit}<br/>
          Range: ${min} - ${max}<br/>
          ${currentThreshold ? `Status: ${currentThreshold.label}` : ''}
        `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .on("mousemove", function(event: MouseEvent) {
        tooltip.style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      });

    // Cleanup tooltip on unmount
    return () => {
      d3.selectAll(".gauge-tooltip").remove();
    };
  }, [value, min, max, title, width, height, thresholds, showLabels, unit]);

  return (
    <div className="gauge-chart-container">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="gauge-chart"
      />
    </div>
  );
};

export default GaugeChart;