import React, { Fragment } from 'react';
import { CheckIcon } from 'lucide-react';
type BookingFormProgressProps = {
  currentStep: number;
  steps: string[];
};
export const BookingFormProgress = ({
  currentStep,
  steps
}: BookingFormProgressProps) => {
  return <div className="hidden sm:block">
      <div className="flex items-center">
        {steps.map((step, index) => <Fragment key={index}>
            {/* Step Circle */}
            <div className="relative flex items-center justify-center">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${currentStep > index + 1 ? 'border-indigo-600 bg-indigo-600 text-white' : currentStep === index + 1 ? 'border-indigo-600 text-indigo-600' : 'border-gray-300 text-gray-400'}`}>
                {currentStep > index + 1 ? <CheckIcon className="h-5 w-5" /> : <span className="text-sm font-medium">{index + 1}</span>}
              </div>
              <div className="absolute -bottom-6 whitespace-nowrap text-sm font-medium text-center" style={{
            width: '100px',
            marginLeft: '-50px',
            marginRight: '-50px'
          }}>
                <span className={currentStep >= index + 1 ? 'text-indigo-600' : 'text-gray-500'}>
                  {step}
                </span>
              </div>
            </div>
            {/* Connector Line (except after the last step) */}
            {index < steps.length - 1 && <div className="flex-1 h-0.5 mx-2 sm:mx-4 md:mx-8" style={{
          backgroundColor: currentStep > index + 1 ? '#4f46e5' : '#e5e7eb'
        }}></div>}
          </Fragment>)}
      </div>
    </div>;
};