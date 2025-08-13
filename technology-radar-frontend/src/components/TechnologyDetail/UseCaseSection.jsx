import React from "react";
import {
  DocumentTextIcon,
  LinkIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";

const UseCaseSection = ({ technology }) => {
  if (!technology?.use_case?.title && !technology?.source_url) return null;

  return (
    <div className="bg-secondary-blue p-4 rounded-lg border border-blue-900">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <LightBulbIcon className="w-5 h-5 text-yellow-500 mr-3" />
        Use Case & Implementation
      </h3>
      {technology.use_case?.title && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <DocumentTextIcon className="w-5 h-5 text-gray-600" />
            <h4 className="font-medium text-gray-900">
              {technology.use_case.title}
            </h4>
          </div>

          {technology.use_case.description && (
            <p className="text-gray-700 leading-relaxed">
              {technology.use_case.description}
            </p>
          )}
        </div>
      )}

      {technology.source_url && (
        <div className="flex items-center space-x-2">
          <LinkIcon className="w-4 h-4 text-gray-500" />
          <a
            href={technology.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-blue hover:text-blue-700 text-sm font-medium"
          >
            View Source
          </a>
        </div>
      )}
    </div>
  );
};

export default UseCaseSection;
