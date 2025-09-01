import React, { Fragment } from 'react';
import { CheckIcon } from 'lucide-react';
type ProgressIndicatorProps = {
  currentStep: number;
  steps: string[];
};
export const ProgressIndicator = ({
  currentStep,
  steps
}: ProgressIndicatorProps) => {
  return <div className="w-full">
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div className="flex items-center">
          {steps.map((step, index) => <Fragment key={index}>
              {/* Step Circle */}
              <div className="relative flex items-center justify-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${index + 1 < currentStep ? 'border-indigo-600 bg-indigo-600 text-white' : index + 1 === currentStep ? 'border-indigo-600 text-indigo-600' : 'border-gray-300 text-gray-500'}`}>
                  {index + 1 < currentStep ? <CheckIcon className="h-5 w-5" /> : <span className="text-sm font-medium">{index + 1}</span>}
                </div>
                <div className={`absolute -bottom-6 whitespace-nowrap text-xs font-medium ${index + 1 <= currentStep ? 'text-indigo-600' : 'text-gray-500'}`}>
                  {step}
                </div>
              </div>
              {/* Connector Line */}
              {index < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${index + 1 < currentStep ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>}
            </Fragment>)}
        </div>
      </div>
      {/* Mobile View */}
      <div className="sm:hidden">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => <Fragment key={index}>
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${index + 1 < currentStep ? 'border-indigo-600 bg-indigo-600 text-white' : index + 1 === currentStep ? 'border-indigo-600 text-indigo-600' : 'border-gray-300 text-gray-500'}`}>
                  {index + 1 < currentStep ? <CheckIcon className="h-4 w-4" /> : <span className="text-xs font-medium">{index + 1}</span>}
                </div>
                {index + 1 === currentStep && <div className="text-xs font-medium text-indigo-600 mt-1">
                    {step}
                  </div>}
              </div>
              {/* Connector Line */}
              {index < steps.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${index + 1 < currentStep ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>}
            </Fragment>)}
        </div>
      </div>
    </div>;
};