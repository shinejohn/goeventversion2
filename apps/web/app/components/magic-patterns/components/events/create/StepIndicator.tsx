import React from 'react';
import { CheckIcon } from 'lucide-react';

interface Step {
  id: string;
  name: string;
  description: string;
  status: 'complete' | 'current' | 'upcoming';
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center justify-center space-x-4">
        {steps.map((step, stepIdx) => (
          <li key={step.id} className={`flex items-center ${stepIdx !== steps.length - 1 ? 'pr-8' : ''}`}>
            {step.status === 'complete' ? (
              <div className="flex items-center">
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                  <CheckIcon className="h-4 w-4" />
                </div>
                <div className="ml-4 min-w-0">
                  <p className="text-sm font-medium text-indigo-600">{step.name}</p>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
              </div>
            ) : step.status === 'current' ? (
              <div className="flex items-center">
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {stepIdx + 1}
                </div>
                <div className="ml-4 min-w-0">
                  <p className="text-sm font-medium text-indigo-600">{step.name}</p>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  {stepIdx + 1}
                </div>
                <div className="ml-4 min-w-0">
                  <p className="text-sm font-medium text-gray-500">{step.name}</p>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
              </div>
            )}
            
            {stepIdx !== steps.length - 1 && (
              <div className="ml-8 w-12 h-0.5 bg-gray-300" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

