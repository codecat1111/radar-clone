import React, { useState } from "react";

const RadarTooltip = () => {
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    data: null,
  });

  // This would be connected to D3.js hover events
  // For now, it's a placeholder structure

  if (!tooltip.visible) {
    return null;
  }

  return (
    <div
      className="radar-tooltip"
      style={{
        left: tooltip.x,
        top: tooltip.y,
      }}
    >
      <div className="font-medium">{tooltip.data?.name}</div>
      <div className="text-sm opacity-80">
        Risk Score: {tooltip.data?.risk_score}
      </div>
    </div>
  );
};

export default RadarTooltip;
