import React from "react";
import { CheckCircleIcon, StarIcon } from "@heroicons/react/24/outline";

const BenefitsList = ({ benefits }) => {
  if (!benefits || benefits.length === 0) return null;

  return (
    <div className="bg-secondary-blue p-4 rounded-lg border border-blue-900">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <StarIcon className="w-5 h-5 text-green-500 mr-3" />
        Benefits
      </h3>

      <div className="space-y-3">
        {benefits.map((benefit, index) => (
          <div
            key={benefit.id || index}
            className="flex items-start space-x-3 p-3 bg-benefit-bg rounded-lg border border-green-200"
          >
            <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-800 leading-relaxed">
                {benefit.benefit || benefit}
              </p>
              {benefit.category && (
                <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  {benefit.category}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default BenefitsList;
