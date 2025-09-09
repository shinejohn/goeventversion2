import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { InfoIcon, PaletteIcon, DollarSignIcon, EyeIcon, SaveIcon, SendIcon, ClockIcon, CheckIcon, ChevronRightIcon } from 'lucide-react';
import { BasicInfoStep } from './wizard/BasicInfoStep';
import { AutomationRulesStep } from './wizard/AutomationRulesStep';
import { CustomizationStep } from './wizard/CustomizationStep';
import { MonetizationStep } from './wizard/MonetizationStep';
import { CalendarPreview } from './CalendarPreview';
type CalendarWizardProps = {
  mode: 'create' | 'edit';
  initialData?: any;
};
export const CalendarWizard = ({
  mode,
  initialData
}: CalendarWizardProps) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    name: initialData?.name || '',
    category: initialData?.category || '',
    description: initialData?.description || '',
    tags: initialData?.tags || [],
    geographicScope: initialData?.geographicScope || 'local',
    visibility: initialData?.visibility || 'public',
    // Automation Rules
    automationRules: initialData?.automationRules || [],
    // Customization
    customization: initialData?.customization || {
      bannerImage: '',
      logo: '',
      colorTheme: 'indigo',
      customCategories: [],
      welcomeMessage: '',
      memberPermissions: {
        canAddEvents: false,
        canInviteMembers: false,
        canModerateDiscussions: false,
        canEditCalendar: false
      }
    },
    // Monetization
    monetization: initialData?.monetization || {
      isPaid: false,
      price: 0,
      benefits: [],
      sponsorSlots: 0,
      promoCodes: []
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveOption, setSaveOption] = useState<'draft' | 'publish' | 'schedule'>('draft');
  const [scheduleDate, setScheduleDate] = useState<string>('');
  const [showScheduleOptions, setShowScheduleOptions] = useState(false);
  const steps = [{
    id: 1,
    name: 'Basic Info',
    icon: <InfoIcon className="h-5 w-5" />
  }, {
    id: 2,
    name: 'Automation Rules',
    icon: <div className="h-5 w-5" />
  }, {
    id: 3,
    name: 'Customization',
    icon: <PaletteIcon className="h-5 w-5" />
  }, {
    id: 4,
    name: 'Monetization',
    icon: <DollarSignIcon className="h-5 w-5" />
  }];
  const updateFormData = (section: any, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };
  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      typeof window !== "undefined" && window.scrollTo(0, 0);
    }
  };
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      typeof window !== "undefined" && window.scrollTo(0, 0);
    }
  };
  const handleSave = (option: 'draft' | 'publish' | 'schedule') => {
    if (option === 'schedule' && !scheduleDate) {
      setShowScheduleOptions(true);
      return;
    }
    setSaveOption(option);
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        if (option === 'publish') {
          navigate(`/calendar/${initialData?.id || 'new-calendar'}`);
        }
      }, 2000);
    }, 1500);
  };
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep formData={formData} updateFormData={data => updateFormData('basicInfo', data)} />;
      case 2:
        return <AutomationRulesStep formData={formData} updateFormData={data => updateFormData('automationRules', data)} />;
      case 3:
        return <CustomizationStep formData={formData} updateFormData={data => updateFormData('customization', data)} />;
      case 4:
        return <MonetizationStep formData={formData} updateFormData={data => updateFormData('monetization', data)} />;
      default:
        return null;
    }
  };
  return <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Side: Wizard */}
      <div className="flex-1">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="hidden sm:block">
            <nav className="flex items-center justify-center" aria-label="Progress">
              <ol role="list" className="flex items-center space-x-5">
                {steps.map(step => <li key={step.id}>
                    <button onClick={() => setCurrentStep(step.id)} className={`flex flex-col items-center ${step.id < currentStep ? 'text-indigo-600' : step.id === currentStep ? 'text-indigo-600' : 'text-gray-400'}`}>
                      <span className={`flex items-center justify-center w-10 h-10 rounded-full ${step.id < currentStep ? 'bg-indigo-100 text-indigo-600' : step.id === currentStep ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {step.id < currentStep ? <CheckIcon className="h-5 w-5" /> : step.icon}
                      </span>
                      <span className="text-sm mt-2">{step.name}</span>
                    </button>
                  </li>)}
              </ol>
            </nav>
          </div>
          <div className="sm:hidden">
            <p className="text-sm font-medium text-indigo-600">
              Step {currentStep} of {steps.length}:{' '}
              {steps[currentStep - 1]?.name}
            </p>
          </div>
        </div>
        {/* Step Content */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          {renderStepContent()}
        </div>
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button type="button" onClick={handlePrevStep} disabled={currentStep === 1} className={`px-4 py-2 rounded-md text-sm font-medium ${currentStep === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
            Previous
          </button>
          <div className="flex space-x-3">
            {currentStep === steps.length ? <div className="flex space-x-3">
                <button type="button" onClick={() => handleSave('draft')} disabled={isSaving} className="px-4 py-2 rounded-md text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center">
                  <SaveIcon className="h-4 w-4 mr-1.5" />
                  Save Draft
                </button>
                <div className="relative">
                  <button type="button" onClick={() => setShowScheduleOptions(!showScheduleOptions)} className="px-4 py-2 rounded-md text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1.5" />
                    Schedule
                  </button>
                  {showScheduleOptions && <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Publish Date & Time
                      </label>
                      <input type="datetime-local" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="w-full mb-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                      <button type="button" onClick={() => handleSave('schedule')} disabled={!scheduleDate} className={`w-full px-3 py-2 rounded-md text-sm font-medium ${!scheduleDate ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                        Confirm Schedule
                      </button>
                    </div>}
                </div>
                <button type="button" onClick={() => handleSave('publish')} disabled={isSaving} className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 flex items-center">
                  <SendIcon className="h-4 w-4 mr-1.5" />
                  Publish Now
                </button>
              </div> : <button type="button" onClick={handleNextStep} className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 flex items-center">
                Next Step
                <ChevronRightIcon className="h-4 w-4 ml-1.5" />
              </button>}
          </div>
        </div>
      </div>
      {/* Right Side: Preview */}
      <div className="lg:w-96">
        <div className="sticky top-24">
          <div className="bg-white shadow-sm rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Live Preview</h3>
              <EyeIcon className="h-5 w-5 text-gray-400" />
            </div>
            <CalendarPreview formData={formData} />
          </div>
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
            <h3 className="font-medium text-indigo-800 mb-2">Tips</h3>
            <ul className="text-sm text-indigo-700 space-y-2">
              {currentStep === 1 && <>
                  <li>• Choose a clear, descriptive name for your calendar</li>
                  <li>
                    • Add relevant tags to help people discover your calendar
                  </li>
                  <li>
                    • Write a compelling description that explains the value
                  </li>
                </>}
              {currentStep === 2 && <>
                  <li>
                    • Set up automation rules to keep your calendar updated
                  </li>
                  <li>• Be specific with keywords to get better matches</li>
                  <li>• Use multiple rules for different types of events</li>
                </>}
              {currentStep === 3 && <>
                  <li>
                    • Upload a high-quality banner image (1200x400px
                    recommended)
                  </li>
                  <li>• Choose colors that match your brand or theme</li>
                  <li>• Write a welcoming message to engage new subscribers</li>
                </>}
              {currentStep === 4 && <>
                  <li>
                    • Clearly communicate the value subscribers will receive
                  </li>
                  <li>
                    • Set a fair price based on the exclusivity of your content
                  </li>
                  <li>• Create promotional codes for marketing campaigns</li>
                </>}
            </ul>
          </div>
        </div>
      </div>
      {/* Success Message */}
      {saveSuccess && <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-md p-4 shadow-lg z-50">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckIcon className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                {saveOption === 'draft' ? 'Calendar draft saved successfully!' : saveOption === 'schedule' ? `Calendar scheduled to publish on ${new Date(scheduleDate).toLocaleString()}` : 'Calendar published successfully!'}
              </p>
            </div>
          </div>
        </div>}
    </div>;
};