import React from "react";
import {
  Square2StackIcon,
  FireIcon,
  ArrowUpRightIcon,
  ClockIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";
import { Badge } from "../UI";

const CoreMetrics = ({ technology }) => {
  if (!technology) return null;

  const getImpactColor = (impact) => {
    switch (impact) {
      case "High Impact":
        return "#EF4444";
      case "Medium Impact":
        return "#F59E0B";
      case "Low Impact":
        return "#10B981";
      default:
        return "#6B7280";
    }
  };

  const getEffortColor = (effort) => {
    switch (effort) {
      case "High Effort":
        return "#EF4444";
      case "Medium Effort":
        return "#F59E0B";
      case "Low Effort":
        return "#10B981";
      default:
        return "#6B7280";
    }
  };

  return (
    <div className="bg-secondary-blue p-4 rounded-lg border border-blue-900">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <Square2StackIcon className="w-5 h-5 text-gray-400 mr-2" />
        Core Metrics
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Impact Score */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <FireIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">
                Impact Score
              </span>
            </div>
            <div
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor: getImpactColor(technology.impact_level),
              }}
            ></div>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {technology.impact_level}
          </div>
        </div>

        {/* Effort Score */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <ArrowUpRightIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">
                Effort Score
              </span>
            </div>
            <div
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor: getEffortColor(technology.effort_level),
              }}
            ></div>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {technology.effort_level}
          </div>
        </div>

        {/* Time to Market */}
        {technology.time_to_market && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ClockIcon className="w-4 h-4 text-gray-500" />
              <div className="text-sm font-medium text-gray-600">
                Time to Market
              </div>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {technology.time_to_market} months
            </div>
          </div>
        )}

        {/* Risk Score */}
        {technology.risk_score && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ShieldExclamationIcon className="w-4 h-4 text-gray-500" />
              <div className="text-sm font-medium text-gray-600">
                Risk Score
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-lg font-semibold text-gray-900">
                {technology.risk_score}/10
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${(technology.risk_score / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoreMetrics;
