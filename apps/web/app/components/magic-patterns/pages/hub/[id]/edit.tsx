import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigationContext } from '../../../context/NavigationContext';
import { HubData } from '../../hub/create';
// Import all the builder components
import { HubBuilderNav } from '../../../components/hub-builder/HubBuilderNav';
import { SetupWizard } from '../../../components/hub-builder/SetupWizard';
import { DesignCustomizer } from '../../../components/hub-builder/DesignCustomizer';
import { SectionManager } from '../../../components/hub-builder/SectionManager';
import { PermissionsRoles } from '../../../components/hub-builder/PermissionsRoles';
import { MonetizationSetup } from '../../../components/hub-builder/MonetizationSetup';
import { HubPreview } from '../../../components/hub-builder/HubPreview';
import { SaveIcon, EyeIcon, ChevronLeftIcon, CheckIcon, AlertCircleIcon } from 'lucide-react';
type BuilderStep = 'setup' | 'design' | 'sections' | 'permissions' | 'monetization' | 'preview';
// Mock function to fetch hub data
const fetchHubData = async (hubId: string): Promise<HubData> => {
  // This would be an API call in a real application
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Return mock data
  return {
    id: hubId,
    name: 'Jazz Lovers Community',
    slug: 'jazz-lovers',
    category: 'music',
    subcategories: ['jazz', 'blues'],
    mission: 'A community dedicated to sharing jazz events, discussing legendary artists, and connecting musicians with venues.',
    audience: 'Jazz musicians, enthusiasts, and venue owners',
    geographicScope: 'global',
    design: {
      template: 'default',
      headerImage: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      colors: {
        primary: '#4f46e5',
        secondary: '#818cf8',
        accent: '#c084fc',
        background: '#ffffff',
        text: '#1f2937'
      },
      fonts: {
        heading: 'Playfair Display',
        body: 'Inter'
      },
      layout: 'magazine'
    },
    sections: [{
      id: 'hero',
      type: 'hero',
      title: 'Welcome to Jazz Lovers',
      enabled: true,
      order: 0,
      settings: {
        showTitle: true,
        showDescription: true,
        ctaText: 'Join the Community',
        ctaEnabled: true
      }
    }, {
      id: 'featured',
      type: 'featured',
      title: 'Featured Content',
      enabled: true,
      order: 1,
      settings: {
        itemCount: 3,
        showImages: true,
        contentType: 'mixed'
      }
    }, {
      id: 'events',
      type: 'events',
      title: 'Upcoming Jazz Events',
      enabled: true,
      order: 2,
      settings: {
        itemCount: 4,
        showLocation: true,
        showDate: true
      }
    }, {
      id: 'members',
      type: 'members',
      title: 'Community Members',
      enabled: true,
      order: 3,
      settings: {
        showCount: true,
        featuredCount: 6,
        showJoinDate: false
      }
    }, {
      id: 'discussions',
      type: 'discussions',
      title: 'Recent Discussions',
      enabled: true,
      order: 4,
      settings: {
        itemCount: 5,
        showAuthor: true,
        showReplyCount: true
      }
    }],
    permissions: {
      memberTiers: [{
        id: 'basic',
        name: 'Basic Member',
        permissions: ['view', 'comment']
      }, {
        id: 'contributor',
        name: 'Contributor',
        permissions: ['view', 'comment', 'post', 'create-events']
      }],
      moderators: ['user1', 'user3'],
      approvalWorkflow: 'moderator',
      contributionGuidelines: 'Please be respectful and constructive in all discussions. Focus on jazz-related topics and avoid self-promotion without permission.'
    },
    monetization: {
      membershipTiers: [{
        id: 'premium',
        name: 'Premium Member',
        price: 9.99,
        billingPeriod: 'monthly',
        benefits: ['Access to exclusive content', 'Early access to event tickets', 'Member-only discussions']
      }],
      sponsorSlots: [{
        id: 'sidebar',
        name: 'Sidebar Ad',
        price: 99,
        position: 'sidebar',
        enabled: true
      }, {
        id: 'featured',
        name: 'Featured Banner',
        price: 199,
        position: 'top',
        enabled: true
      }],
      affiliateEnabled: true,
      affiliateCommission: 10
    }
  };
};
export default function HubEditPage() {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const {
    navigateTo
  } = useNavigationContext();
  const [isLoading, setIsLoading] = useState(true);
  const [hubData, setHubData] = useState<HubData | null>(null);
  const [activeStep, setActiveStep] = useState<BuilderStep>('setup');
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [saveStatus, setSaveStatus] = useState<'unsaved' | 'saving' | 'saved' | 'error'>('unsaved');
  // Fetch hub data on mount
  useEffect(() => {
    const loadHubData = async () => {
      try {
        if (!id) return;
        const data = await fetchHubData(id);
        setHubData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading hub data:', error);
        setIsLoading(false);
      }
    };
    loadHubData();
  }, [id]);
  // Update hub data
  const updateHubData = (field: string, value: any) => {
    if (!hubData) return;
    setHubData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value
      };
    });
    setSaveStatus('unsaved');
  };
  // Update nested hub data
  const updateNestedHubData = (section: string, field: string, value: any) => {
    if (!hubData) return;
    setHubData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: {
          ...prev[section as keyof HubData],
          [field]: value
        }
      };
    });
    setSaveStatus('unsaved');
  };
  // Save hub data
  const saveHubData = async () => {
    setSaveStatus('saving');
    try {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Simulate successful save
      setSaveStatus('saved');
      // Reset to unsaved after 3 seconds
      setTimeout(() => {
        setSaveStatus('unsaved');
      }, 3000);
    } catch (error) {
      setSaveStatus('error');
    }
  };
  // Validate current step
  const validateStep = (step: BuilderStep): boolean => {
    const errors: Record<string, string[]> = {};
    if (!hubData) return false;
    switch (step) {
      case 'setup':
        if (!hubData.name) errors.name = ['Hub name is required'];
        if (!hubData.slug) errors.slug = ['URL slug is required'];
        if (!hubData.category) errors.category = ['Category is required'];
        break;
      case 'design':
        if (!hubData.design.headerImage) errors.headerImage = ['Header image is required'];
        break;
      // Add validation for other steps as needed
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  // Navigate to next step
  const goToNextStep = () => {
    if (!validateStep(activeStep)) return;
    const steps: BuilderStep[] = ['setup', 'design', 'sections', 'permissions', 'monetization', 'preview'];
    const currentIndex = steps.indexOf(activeStep);
    if (currentIndex < steps.length - 1) {
      setActiveStep(steps[currentIndex + 1]);
    }
  };
  // Navigate to previous step
  const goToPrevStep = () => {
    const steps: BuilderStep[] = ['setup', 'design', 'sections', 'permissions', 'monetization', 'preview'];
    const currentIndex = steps.indexOf(activeStep);
    if (currentIndex > 0) {
      setActiveStep(steps[currentIndex - 1]);
    }
  };
  // Update hub
  const updateHub = async () => {
    // Validate all steps
    const steps: BuilderStep[] = ['setup', 'design', 'sections', 'permissions', 'monetization'];
    let isValid = true;
    for (const step of steps) {
      if (!validateStep(step)) {
        isValid = false;
        setActiveStep(step);
        break;
      }
    }
    if (!isValid) return;
    setIsLoading(true);
    try {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Navigate to the hub
      navigateTo(`/hub/${hubData?.slug}`);
    } catch (error) {
      setIsLoading(false);
      setSaveStatus('error');
    }
  };
  // Render step content based on active step
  const renderStepContent = () => {
    if (!hubData) return null;
    switch (activeStep) {
      case 'setup':
        return <SetupWizard hubData={hubData} updateHubData={updateHubData} errors={validationErrors} />;
      case 'design':
        return <DesignCustomizer hubData={hubData} updateHubData={updateNestedHubData} errors={validationErrors} />;
      case 'sections':
        return <SectionManager hubData={hubData} updateHubData={setHubData} />;
      case 'permissions':
        return <PermissionsRoles hubData={hubData} updateHubData={updateNestedHubData} />;
      case 'monetization':
        return <MonetizationSetup hubData={hubData} updateHubData={updateNestedHubData} />;
      case 'preview':
        return <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Hub Preview</h2>
            <p className="text-gray-600 mb-6">
              Review your hub before updating. You can go back to any section to
              make changes.
            </p>
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <HubPreview hubData={hubData} />
            </div>
            <div className="mt-8">
              <button onClick={updateHub} disabled={isLoading} className="px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? 'Updating...' : 'Update Hub'}
              </button>
              <p className="mt-2 text-sm text-gray-500">
                Your changes will be applied immediately.
              </p>
            </div>
          </div>;
      default:
        return null;
    }
  };
  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>;
  }
  if (!hubData) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Hub Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The hub you're looking for doesn't exist or you don't have
            permission to edit it.
          </p>
          <button onClick={() => navigateTo('/hubs')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Back to Hubs
          </button>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button onClick={() => navigateTo(`/hub/${hubData.slug}`)} className="text-gray-500 hover:text-gray-700 flex items-center">
                <ChevronLeftIcon className="h-5 w-5 mr-1" />
                Back to Hub
              </button>
              <h1 className="ml-6 text-xl font-bold text-gray-900">
                Edit Hub: {hubData.name}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={() => setShowPreview(!showPreview)} className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <EyeIcon className="h-4 w-4 mr-1" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              <button onClick={saveHubData} disabled={saveStatus === 'saving' || saveStatus === 'saved'} className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                {saveStatus === 'saving' ? <>Saving...</> : saveStatus === 'saved' ? <>
                    <CheckIcon className="h-4 w-4 mr-1" />
                    Saved
                  </> : saveStatus === 'error' ? <>
                    <AlertCircleIcon className="h-4 w-4 mr-1" />
                    Error
                  </> : <>
                    <SaveIcon className="h-4 w-4 mr-1" />
                    Save Changes
                  </>}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <HubBuilderNav activeStep={activeStep} setActiveStep={setActiveStep} />
          </div>
          {/* Main Content Area */}
          <div className="flex-1">
            {renderStepContent()}
            {/* Navigation Buttons */}
            {activeStep !== 'preview' && <div className="mt-8 flex justify-between">
                <button onClick={goToPrevStep} disabled={activeStep === 'setup'} className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${activeStep === 'setup' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  Previous
                </button>
                <button onClick={goToNextStep} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Next
                </button>
              </div>}
          </div>
          {/* Preview Panel */}
          {showPreview && <div className="w-full lg:w-1/3 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-8">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Preview
                </h3>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <HubPreview hubData={hubData} />
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  This is a simplified preview. Some features may appear
                  different in the final version.
                </p>
              </div>
            </div>}
        </div>
      </div>
    </div>;
}