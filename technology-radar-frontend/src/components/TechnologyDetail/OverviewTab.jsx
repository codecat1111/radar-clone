import React from "react";
import CoreMetrics from "./CoreMetrics";
import BenefitsList from "./BenefitsList";
import RisksList from "./RisksList";
import UseCaseSection from "./UseCaseSection";

const OverviewTab = ({ technology }) => {
  console.log("Selected technology data:", technology);
  if (!technology) return null;

  return (
    <div className="p-6 space-y-6 bg-blue-50">
      {/* Technology Description */}
      <div className="bg-secondary-blue p-4 rounded-lg border border-blue-900">
        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
          <span className="w-2 h-2 bg-primary-blue rounded-full mr-3"></span>
          Description
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {technology.description}
        </p>
      </div>

      {/* Core Metrics */}
      <CoreMetrics technology={technology} />

      {/* Benefits */}
      <BenefitsList benefits={technology.benefits || []} />

      {/* Risks */}
      <RisksList risks={technology.risks || []} />

      {/* Use Case */}
      <UseCaseSection technology={technology} />

      {/* Impact Description */}
      {technology.impact_description && (
        <div className="bg-secondary-blue p-4 rounded-lg border border-blue-900">
          <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
            Impact Description
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {technology.impact_description}
          </p>
        </div>
      )}
    </div>
  );
};

export default OverviewTab;
