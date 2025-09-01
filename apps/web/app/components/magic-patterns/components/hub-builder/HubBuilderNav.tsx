import React from 'react';
import { ClipboardIcon, PaintbrushIcon, LayoutIcon, UsersIcon, DollarSignIcon, EyeIcon, CheckIcon } from 'lucide-react';
type BuilderStep = 'setup' | 'design' | 'sections' | 'permissions' | 'monetization' | 'preview';
type HubBuilderNavProps = {
  activeStep: BuilderStep;
  setActiveStep: (step: BuilderStep) => void;
};
export const HubBuilderNav: React.FC<HubBuilderNavProps> = ({
  activeStep,
  setActiveStep
}) => {
  const steps: {
    id: BuilderStep;
    name: string;
    icon: React.ReactNode;
  }[] = [{
    id: 'setup',
    name: 'Basic Setup',
    icon: <ClipboardIcon className="h-5 w-5" />
  }, {
    id: 'design',
    name: 'Design',
    icon: <PaintbrushIcon className="h-5 w-5" />
  }, {
    id: 'sections',
    name: 'Sections',
    icon: <LayoutIcon className="h-5 w-5" />
  }, {
    id: 'permissions',
    name: 'Permissions',
    icon: <UsersIcon className="h-5 w-5" />
  }, {
    id: 'monetization',
    name: 'Monetization',
    icon: <DollarSignIcon className="h-5 w-5" />
  }, {
    id: 'preview',
    name: 'Preview & Publish',
    icon: <EyeIcon className="h-5 w-5" />
  }];
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h2 className="font-medium text-gray-900">Hub Builder</h2>
      </div>
      <nav className="flex flex-col">
        {steps.map((step, index) => <button key={step.id} onClick={() => setActiveStep(step.id)} className={`flex items-center px-4 py-3 text-left ${activeStep === step.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-gray-50 border-l-4 border-transparent'} ${index !== steps.length - 1 ? 'border-b border-gray-200' : ''}`}>
            <div className={`flex items-center justify-center h-8 w-8 rounded-full mr-3 ${activeStep === step.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
              {step.icon}
            </div>
            <div className="flex-1">
              <div className={`text-sm font-medium ${activeStep === step.id ? 'text-indigo-700' : 'text-gray-700'}`}>
                {step.name}
              </div>
              {activeStep === step.id && <div className="text-xs text-indigo-500 mt-0.5">
                  Current step
                </div>}
            </div>
            {activeStep === step.id && <CheckIcon className="h-5 w-5 text-indigo-600" />}
          </button>)}
      </nav>
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Need help? Check out our{' '}
          <a href="#" className="text-indigo-600 hover:text-indigo-800">
            Hub Builder Guide
          </a>
          .
        </div>
      </div>
    </div>;
};