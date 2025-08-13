import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import useAppStore from "../../store/useAppStore";
import { LoadingSpinner } from "../UI";
import RadarTooltip from "./RadarTooltip";

const RADAR_CONFIG = {
  width: 700,
  height: 700,
  center: { x: 300, y: 300 },
  maxRadius: 250,
  pointRadius: 6,
  pointHoverRadius: 8,
};

const RadarChart = ({ technologies = [], onTechnologyClick }) => {
  const svgRef = useRef();
  const { loading } = useAppStore();

  useEffect(() => {
    if (!technologies.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create radar gradient
    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "radarGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#8FBC8F");
    gradient.append("stop").attr("offset", "50%").attr("stop-color", "#DAA520");
    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#CD853F");

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#CD853F");

    // Create main group
    const g = svg
      .append("g")
      .attr(
        "transform",
        `translate(${RADAR_CONFIG.center.x}, ${RADAR_CONFIG.center.y})`
      );

    // Draw background circle
    g.append("circle")
      .attr("r", RADAR_CONFIG.maxRadius)
      .attr("fill", "url(#radarGradient)")
      .attr("stroke", "#666")
      .attr("stroke-width", 2);
    // Add outer boundary circle (green)
    const outerRadius = RADAR_CONFIG.maxRadius + 20;
    g.append("circle")
      .attr("r", outerRadius)
      .attr("fill", "none")
      .attr("stroke", "#4CAF50")
      .attr("stroke-width", 3);

    // Draw grid circles
    const gridCircles = [0.25, 0.5, 0.75, 1.0];
    gridCircles.forEach((ratio) => {
      g.append("circle")
        .attr("r", RADAR_CONFIG.maxRadius * ratio)
        .attr("fill", "none")
        .attr("stroke", "rgba(255,255,255,0.3)")
        .attr("stroke-width", 1);
    });

    // Draw grid lines
    const gridLines = 4; // Only 4 lines: top, right, bottom, left
    for (let i = 0; i < gridLines; i++) {
      const angle = i * 90 * (Math.PI / 180); // 90-degree intervals
      g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", Math.cos(angle - Math.PI / 2) * RADAR_CONFIG.maxRadius)
        .attr("y2", Math.sin(angle - Math.PI / 2) * RADAR_CONFIG.maxRadius)
        .attr("stroke", "rgba(255,255,255,0.3)")
        .attr("stroke-width", 1);
    }

    // Add impact and effort labels around the outer circle
    const labelRadius = RADAR_CONFIG.maxRadius + 40; // Position outside circle

    // High Impact(top)
    g.append("text")
      .attr("x", 0)
      .attr("y", -labelRadius)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "#333")
      .text("HIGH IMPACT");
    // High Effort (right)
    g.append("text")
      .attr("x", labelRadius)
      .attr("y", 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "#333")
      .attr("transform", `rotate(90, ${labelRadius}, 5)`)
      .text("HIGH EFFORT");

    // Low Impact (bottom)
    g.append("text")
      .attr("x", 0)
      .attr("y", labelRadius + 15)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "#333")
      .text("LOW IMPACT");

    // Low Effort (left)
    g.append("text")
      .attr("x", -labelRadius)
      .attr("y", 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "#333")
      .attr("transform", `rotate(-90, ${-labelRadius}, 5)`)
      .text("LOW EFFORT");

    // Convert polar coordinates to cartesian
    const getCartesian = (angle, radius) => {
      const radian = (angle - 90) * (Math.PI / 180);
      const x = Math.cos(radian) * (radius * RADAR_CONFIG.maxRadius);
      const y = Math.sin(radian) * (radius * RADAR_CONFIG.maxRadius);
      return { x, y };
    };

    // Draw technology points
    g.selectAll(".radar-point")
      .data(technologies)
      .enter()
      .append("circle")
      .attr("class", "radar-point")
      .attr("cx", (d) => getCartesian(d.angle, d.radius).x)
      .attr("cy", (d) => getCartesian(d.angle, d.radius).y)
      .attr("r", RADAR_CONFIG.pointRadius)
      .attr("fill", (d) => d.tag?.color || "#9CA3AF")
      .attr("stroke", "#FFFFFF")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        if (onTechnologyClick) {
          onTechnologyClick(d);
        }
      })
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", RADAR_CONFIG.pointHoverRadius)
          .attr("stroke-width", 3);
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", RADAR_CONFIG.pointRadius)
          .attr("stroke-width", 2);
      });
  }, [technologies, onTechnologyClick]);

  if (loading) {
    return (
      <div className="radar-container">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="radar-container">
      <svg
        ref={svgRef}
        width={RADAR_CONFIG.width}
        height={RADAR_CONFIG.height}
        viewBox={`0 0 ${RADAR_CONFIG.width} ${RADAR_CONFIG.height}`}
        className="max-w-full h-auto"
      />
      <RadarTooltip />
    </div>
  );
};

export default RadarChart;
