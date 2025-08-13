import React from "react";
import { Badge } from "../UI";

const TechnologyHeader = ({ technology }) => {
  if (!technology) return null;

  const getTagDescription = (tagName) => {
    switch (tagName) {
      case "Leading":
        return "Technologies that hold limited risk and have well-defined, replicable outcomes";
      case "Nascent":
        return "Early-stage technologies that hold relatively high risk and limited real-world validation";
      case "Watchlist":
        return "Technologies worth monitoring for future potential";
      default:
        return "";
    }
  };

  const getTagBgColor = (tagName) => {
    switch (tagName) {
      case "Leading":
        return "bg-green-100";
      case "Nascent":
        return "bg-pink-100";
      case "Watchlist":
        return "bg-blue-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div>
      {/* Tag Description Banner */}
      <div
        className={`${getTagBgColor(
          technology.tag?.name
        )} px-4 py-3 rounded-lg mb-4`}
      >
        <p className="text-sm font-medium text-gray-800">
          {getTagDescription(technology.tag?.name)}
        </p>
      </div>

      {/* Technology Name and Tag */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Badge
            color={technology.tag?.color}
            size="md"
            className="font-medium"
          >
            {technology.tag?.name}
          </Badge>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">{technology.name}</h1>

        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <span>Domain:</span>
            <span className="font-medium text-primary-blue">
              {technology.domain?.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnologyHeader;
