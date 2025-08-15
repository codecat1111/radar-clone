import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import useAppStore from "../../store/useAppStore";
import { LoadingSpinner } from "../UI";

// Configuration constants
const RADIAL_CONFIG = {
  width: 700,
  height: 700,
  innerRadius: 60,
  middleRadius: 140,
  outerRadius: 280,
  domainCircleRadius: 14,
  techCircleRadius: 6,
  selectedTechRadius: 10,
  animationDuration: 500,
  fadeDelay: 300,
  spinDuration: 500,
};

const RadialChart = ({
  technologies = [],
  domains = [],
  onTechnologyClick,
}) => {
  const svgRef = useRef();
  const {
    filters,
    setSelectedDomain,
    setSelectedTechnologyId,
    setIsTransitioning,
    isTransitioning,
  } = useAppStore();
  const { selectedDomain, selectedTechnologyId } = filters;
  const [domainNames, setDomainNames] = useState([]);

  // Extract unique domain names
  useEffect(() => {
    const uniqueDomains = [
      ...new Set(
        technologies.map((tech) =>
          typeof tech.domain === "string" ? tech.domain : tech.domain.name
        )
      ),
    ];
    setDomainNames(uniqueDomains);
  }, [technologies]);

  // Set default domain and technology if none selected
  useEffect(() => {
    if (!selectedDomain && domainNames.length > 0) {
      const defaultDomain = domainNames[0];
      const defaultTech = technologies.find(
        (tech) => tech.domain === defaultDomain
      );
      setSelectedDomain(defaultDomain);
      if (defaultTech) {
        setSelectedTechnologyId(defaultTech.id);
      }
    }
  }, [
    domainNames,
    technologies,
    selectedDomain,
    setSelectedDomain,
    setSelectedTechnologyId,
  ]);

  // Helper function to get domain color
  const getDomainColor = (domainName) => {
    const domainData = domains.find((d) => d.name === domainName);
    return domainData?.color || "#4A90E2";
  };

  useEffect(() => {
    if (!domainNames.length || !selectedDomain) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const centerX = RADIAL_CONFIG.width / 2;
    const centerY = RADIAL_CONFIG.height / 2;

    // Create main group and add spin animation
    const mainGroup = svg
      .append("g")
      .attr("transform", `translate(${centerX}, ${centerY})`);

    // Add initial spin animation to the main group
    mainGroup
      .transition()
      .duration(RADIAL_CONFIG.spinDuration) // Use the config value (500ms)
      .ease(d3.easeLinear)
      .attr("transform", `translate(${centerX}, ${centerY}) rotate(360)`)
      .on("end", function () {
        // Reset to normal position after spin
        d3.select(this).attr("transform", `translate(${centerX}, ${centerY})`);
      });

    // 1. Inner Circle (plain circle)
    mainGroup
      .append("circle")
      .attr("r", 0)
      .attr("fill", "none")
      .attr("stroke", "#4A90E2")
      .attr("stroke-width", 2)
      .transition()
      .delay(RADIAL_CONFIG.spinDuration)
      .duration(RADIAL_CONFIG.animationDuration)
      .attr("r", RADIAL_CONFIG.innerRadius);

    // 2. Middle Circle with gaps for domains (will be drawn after domain positions are calculated)

    // Calculate domain positions
    const angleStep = (2 * Math.PI) / domainNames.length;
    const domainPositions = domainNames.map((domain, i) => ({
      domain,
      angle: i * angleStep,
      x: Math.cos(i * angleStep) * RADIAL_CONFIG.middleRadius,
      y: Math.sin(i * angleStep) * RADIAL_CONFIG.middleRadius,
    }));

    // 2. Draw Middle Circle with gaps at domain positions
    domainPositions.forEach((pos, i) => {
      // Calculate the angle span for the gap around each domain
      const gapAngle =
        Math.asin(
          RADIAL_CONFIG.domainCircleRadius / RADIAL_CONFIG.middleRadius
        ) * 2;

      // Calculate the start and end angles for the arc (avoiding the domain circle)
      const prevDomain =
        domainPositions[i === 0 ? domainNames.length - 1 : i - 1];
      const nextDomain =
        domainPositions[i === domainNames.length - 1 ? 0 : i + 1];

      // Arc from previous domain (plus gap) to current domain (minus gap)
      let startAngle = prevDomain.angle + gapAngle / 2;
      let endAngle = pos.angle - gapAngle / 2;

      // Handle angle wrapping
      if (startAngle > endAngle) {
        endAngle += 2 * Math.PI;
      }

      // Only draw if there's a meaningful arc
      if (endAngle - startAngle > 0.1) {
        const arc = d3
          .arc()
          .innerRadius(RADIAL_CONFIG.middleRadius)
          .outerRadius(RADIAL_CONFIG.middleRadius)
          .startAngle(startAngle)
          .endAngle(endAngle);

        const domainColor = getDomainColor(pos.domain);

        mainGroup
          .append("path")
          .attr("d", arc)
          .attr("fill", "none")
          .attr("stroke", domainColor)
          .attr("stroke-width", 2)
          .attr("opacity", 0)
          .transition()
          .delay(RADIAL_CONFIG.spinDuration + i * 50)
          .duration(RADIAL_CONFIG.animationDuration)
          .attr("opacity", 1);
      }
    });

    // Domain circles and connecting lines (reverted to original)
    domainPositions.forEach((pos, i) => {
      // Calculate line start from inner circle edge
      const innerX = Math.cos(pos.angle) * RADIAL_CONFIG.innerRadius;
      const innerY = Math.sin(pos.angle) * RADIAL_CONFIG.innerRadius;

      // Calculate where line should end (just before domain circle) - ORIGINAL LOGIC
      const lineEndDistance =
        RADIAL_CONFIG.middleRadius - RADIAL_CONFIG.domainCircleRadius - 1;
      const lineEndX = Math.cos(pos.angle) * lineEndDistance;
      const lineEndY = Math.sin(pos.angle) * lineEndDistance;

      // Get domain color
      const domainColor = getDomainColor(pos.domain);

      // Curved line from inner circle to just before domain circle
      const path = d3.path();
      path.moveTo(innerX, innerY);

      // Create a curve by adding a control point perpendicular to the line
      const midX = (innerX + lineEndX) / 2;
      const midY = (innerY + lineEndY) / 2;
      const perpX = -(lineEndY - innerY) * 0.3; // Perpendicular offset
      const perpY = (lineEndX - innerX) * 0.3;
      const controlX = midX + perpX;
      const controlY = midY + perpY;

      path.quadraticCurveTo(controlX, controlY, lineEndX, lineEndY);

      mainGroup
        .append("path")
        .attr("d", path.toString())
        .attr("stroke", domainColor)
        .attr("stroke-width", 0.5)
        .attr("fill", "none")
        .attr("opacity", 0.4)
        .attr("stroke-dasharray", function () {
          return this.getTotalLength();
        })
        .attr("stroke-dashoffset", function () {
          return this.getTotalLength();
        })
        .transition()
        .delay(RADIAL_CONFIG.spinDuration + i * 50)
        .duration(RADIAL_CONFIG.animationDuration)
        .attr("stroke-dashoffset", 0);

      // Domain circle
      const isSelected = pos.domain === selectedDomain;

      mainGroup
        .append("circle")
        .attr("cx", pos.x)
        .attr("cy", pos.y)
        .attr("r", 0)
        .attr("fill", isSelected ? domainColor : "#fff")
        .attr("stroke", domainColor)
        .attr("stroke-width", 2)
        .attr("opacity", isSelected ? 1 : 0.6)
        .attr("cursor", "pointer")
        .transition()
        .delay(RADIAL_CONFIG.spinDuration + i * 50)
        .duration(RADIAL_CONFIG.animationDuration)
        .attr("r", RADIAL_CONFIG.domainCircleRadius)
        .on("end", function () {
          d3.select(this).on("click", () => handleDomainClick(pos.domain));
        });

      // Domain label positioning
      const labelDistance = 70;
      const labelX =
        Math.cos(pos.angle) * (RADIAL_CONFIG.middleRadius + labelDistance);
      const labelY =
        Math.sin(pos.angle) * (RADIAL_CONFIG.middleRadius + labelDistance);

      // Domain label with text wrapping
      const domainName =
        typeof pos.domain === "string" ? pos.domain : pos.domain.name;
      const words = domainName.split(" ");

      // Create text group for multi-line labels
      const textGroup = mainGroup
        .append("g")
        .attr("transform", `translate(${labelX}, ${labelY})`)
        .attr("opacity", 0);

      // Calculate total text height for centering
      const lineHeight = 13;
      const totalHeight = words.length * lineHeight;
      const startY = -(totalHeight / 2) + lineHeight / 2;

      // Add each word as separate line if more than one word
      if (words.length > 1) {
        words.forEach((word, wordIndex) => {
          textGroup
            .append("text")
            .attr("x", 0)
            .attr("y", startY + wordIndex * lineHeight)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "700")
            .attr("fill", isSelected ? domainColor : "#374151")
            .text(word);
        });
      } else {
        // Single word
        textGroup
          .append("text")
          .attr("x", 0)
          .attr("y", 0)
          .attr("text-anchor", "middle")
          .attr("font-size", "12px")
          .attr("font-weight", "700")
          .attr("fill", isSelected ? domainColor : "#374151")
          .text(domainName);
      }

      // Animate text group
      textGroup
        .transition()
        .delay(
          RADIAL_CONFIG.spinDuration + i * 50 + RADIAL_CONFIG.animationDuration
        )
        .duration(300)
        .attr("opacity", isSelected ? 1 : 0.8);
    });

    // 3. Outer Circle
    mainGroup
      .append("circle")
      .attr("r", 0)
      .attr("fill", "none")
      .attr("stroke", "#4A90E2")
      .attr("stroke-width", 2)
      .attr("opacity", 0.3)
      .transition()
      .delay(RADIAL_CONFIG.spinDuration)
      .duration(RADIAL_CONFIG.animationDuration)
      .attr("r", RADIAL_CONFIG.outerRadius);

    // Technologies for selected domain
    const selectedDomainTechs = technologies.filter((tech) => {
      const techDomain =
        typeof tech.domain === "string" ? tech.domain : tech.domain.name;
      return techDomain === selectedDomain;
    });

    console.log("Selected domain:", selectedDomain);
    console.log("Available technologies:", selectedDomainTechs.length);

    selectedDomainTechs.forEach((tech, techIndex) => {
      // Find domain position for connecting line
      const domainPos = domainPositions.find(
        (pos) => pos.domain === selectedDomain
      );

      if (domainPos) {
        // Get domain color for tech lines
        const domainColor = getDomainColor(selectedDomain);

        // Calculate a small arc around the domain position for technologies
        const maxTechs = selectedDomainTechs.length;
        const arcSpan = Math.PI / 1.5; // 60 degrees arc span
        const startAngle = domainPos.angle - arcSpan / 2;
        const angleStep = maxTechs > 1 ? arcSpan / (maxTechs - 1) : 0;

        // Position technology in the arc around its domain
        const techAngle = startAngle + techIndex * angleStep;
        const techX = Math.cos(techAngle) * RADIAL_CONFIG.outerRadius;
        const techY = Math.sin(techAngle) * RADIAL_CONFIG.outerRadius;

        // Define domainEdgeX and domainEdgeY
        const domainEdgeX =
          Math.cos(domainPos.angle) *
          (RADIAL_CONFIG.middleRadius + RADIAL_CONFIG.domainCircleRadius + 3);
        const domainEdgeY =
          Math.sin(domainPos.angle) *
          (RADIAL_CONFIG.middleRadius + RADIAL_CONFIG.domainCircleRadius + 3);

        // Curved path from domain edge to technology
        const path = d3.path();
        path.moveTo(domainEdgeX, domainEdgeY);

        // Create slight curve
        const controlX =
          (domainEdgeX + techX) / 2 + (techY - domainEdgeY) * 0.1;
        const controlY =
          (domainEdgeY + techY) / 2 - (techX - domainEdgeX) * 0.1;

        path.quadraticCurveTo(controlX, controlY, techX, techY);

        // Extension line
        mainGroup
          .append("path")
          .attr("d", path.toString())
          .attr("fill", "none")
          .attr("stroke", domainColor)
          .attr("stroke-width", 2)
          .attr("opacity", 0)
          .transition()
          .delay(
            RADIAL_CONFIG.spinDuration +
              RADIAL_CONFIG.animationDuration +
              techIndex * 30
          )
          .duration(400)
          .attr("opacity", 0.4);

        // Technology circle
        const isSelectedTech = tech.id === selectedTechnologyId;
        mainGroup
          .append("circle")
          .attr("cx", techX)
          .attr("cy", techY)
          .attr("r", 0)
          .attr("fill", isSelectedTech ? domainColor : getTechColor(tech))
          .attr("stroke", isSelectedTech ? domainColor : domainColor)
          .attr("stroke-width", isSelectedTech ? 3 : 2)
          .attr("cursor", "pointer")
          .transition()
          .delay(
            RADIAL_CONFIG.spinDuration +
              RADIAL_CONFIG.animationDuration +
              techIndex * 30
          )
          .duration(400)
          .attr(
            "r",
            isSelectedTech
              ? RADIAL_CONFIG.selectedTechRadius
              : RADIAL_CONFIG.techCircleRadius
          )
          .on("end", function () {
            d3.select(this)
              .on("click", () => handleTechnologyClick(tech))
              .on("mouseenter", function () {
                if (!isSelectedTech) {
                  d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("r", RADIAL_CONFIG.techCircleRadius + 2);
                }
              })
              .on("mouseleave", function () {
                if (!isSelectedTech) {
                  d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("r", RADIAL_CONFIG.techCircleRadius);
                }
              });
          });

        // Technology label with better positioning and text wrapping
        const techName =
          typeof tech.name === "string" ? tech.name : tech.name.toString();
        const words = techName.split(" ");

        // Position label outside the technology circle
        const labelDistance = RADIAL_CONFIG.selectedTechRadius + 80;
        const directionX = techX / RADIAL_CONFIG.outerRadius;
        const directionY = techY / RADIAL_CONFIG.outerRadius;
        const labelX = techX + directionX * labelDistance;
        const labelY = techY + directionY * labelDistance;

        // Create text group for multi-line tech labels
        const techTextGroup = mainGroup
          .append("g")
          .attr("transform", `translate(${labelX}, ${labelY})`)
          .attr("opacity", 0);

        // Calculate total text height for centering
        const techLineHeight = 14;
        const techTotalHeight = words.length * techLineHeight;
        const techStartY = -(techTotalHeight / 2) + techLineHeight / 2;

        // Add each word as separate line if more than one word or if text is too long
        if (words.length > 1 || techName.length > 12) {
          // Split into lines - max 2 lines
          const maxWordsPerLine = Math.ceil(words.length / 2);
          const line1 = words.slice(0, maxWordsPerLine).join(" ");
          const line2 = words.slice(maxWordsPerLine).join(" ");

          // First line
          if (line1) {
            techTextGroup
              .append("text")
              .attr("x", 0)
              .attr("y", techStartY)
              .attr("text-anchor", "middle")
              .attr("font-size", "13px")
              .attr("font-weight", isSelectedTech ? "700" : "600")
              .attr("fill", isSelectedTech ? domainColor : "#374151")
              .text(line1.length > 15 ? line1.substring(0, 15) + "..." : line1);
          }

          // Second line
          if (line2) {
            techTextGroup
              .append("text")
              .attr("x", 0)
              .attr("y", techStartY + techLineHeight)
              .attr("text-anchor", "middle")
              .attr("font-size", "13px")
              .attr("font-weight", isSelectedTech ? "700" : "600")
              .attr("fill", isSelectedTech ? domainColor : "#374151")
              .text(line2.length > 15 ? line2.substring(0, 15) + "..." : line2);
          }
        } else {
          // Single word, short text
          techTextGroup
            .append("text")
            .attr("x", 0)
            .attr("y", 0)
            .attr("text-anchor", "middle")
            .attr("font-size", "13px")
            .attr("font-weight", isSelectedTech ? "700" : "600")
            .attr("fill", isSelectedTech ? domainColor : "#374151")
            .text(techName);
        }

        // Animate tech text group
        techTextGroup
          .transition()
          .delay(
            RADIAL_CONFIG.spinDuration +
              RADIAL_CONFIG.animationDuration +
              techIndex * 30 +
              200
          )
          .duration(300)
          .attr("opacity", 1);
      }
    });
  }, [
    domainNames,
    selectedDomain,
    selectedTechnologyId,
    technologies,
    domains,
  ]);

  // Handle domain click with spin animation
  const handleDomainClick = (domain) => {
    console.log("Domain clicked:", domain);
    if (domain === selectedDomain || isTransitioning) return;

    setIsTransitioning(true);

    // 360-degree spin animation
    const svg = d3.select(svgRef.current);
    const mainGroup = svg.select("g");

    mainGroup
      .transition()
      .duration(RADIAL_CONFIG.animationDuration)
      .attr(
        "transform",
        `translate(${RADIAL_CONFIG.width / 2}, ${
          RADIAL_CONFIG.height / 2
        }) rotate(360)`
      )
      .on("end", () => {
        // Reset transform and update domain
        mainGroup.attr(
          "transform",
          `translate(${RADIAL_CONFIG.width / 2}, ${RADIAL_CONFIG.height / 2})`
        );
        setSelectedDomain(domain);

        // Select first technology of new domain
        const firstTech = technologies.find((tech) => tech.domain === domain);
        if (firstTech) {
          setSelectedTechnologyId(firstTech.id);
          setTimeout(() => {
            onTechnologyClick(firstTech);
            setIsTransitioning(false);
          }, RADIAL_CONFIG.fadeDelay);
        } else {
          setIsTransitioning(false);
        }
      });
  };

  // Handle technology click
  const handleTechnologyClick = (technology) => {
    if (technology.id === selectedTechnologyId || isTransitioning) return;

    setSelectedTechnologyId(technology.id);
    onTechnologyClick(technology);
  };

  // Get technology color based on tag
  const getTechColor = (tech) => {
    if (tech.tags?.includes("Leading")) return "#90EE90";
    if (tech.tags?.includes("Nascent")) return "#FFB6C1";
    if (tech.tags?.includes("Watchlist")) return "#87CEEB";
    return "#4A90E2";
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        ref={svgRef}
        width={RADIAL_CONFIG.width}
        height={RADIAL_CONFIG.height}
        className="overflow-visible"
      />
    </div>
  );
};

export default RadialChart;
