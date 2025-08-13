import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { Badge } from '../UI';

const RisksList = ({ risks }) => {
  if (!risks || risks.length === 0) return null;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-600 text-white';
      case 'High': return 'bg-red-500 text-white';
      case 'Medium': return 'bg-yellow-500 text-white';
      case 'Low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className='bg-secondary-blue p-4 rounded-lg border border-blue-900'>
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
        Risks
      </h3>
      
      <div className="space-y-3">
        {risks.map((risk, index) => (
          <div 
            key={risk.id || index}
            className="flex items-start space-x-3 p-3 bg-risk-bg rounded-lg border border-red-200"
          >
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-800 leading-relaxed">
                {risk.risk || risk}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                {risk.severity && (
                  <Badge 
                    className={getSeverityColor(risk.severity)}
                    size="sm"
                  >
                    {risk.severity}
                  </Badge>
                )}
                {risk.category && (
                  <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    {risk.category}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RisksList;
