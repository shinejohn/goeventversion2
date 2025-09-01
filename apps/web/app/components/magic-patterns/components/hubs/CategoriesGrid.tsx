import React from 'react';
import { MusicIcon, GlobeIcon, CoffeeIcon, BriefcaseIcon, ScissorsIcon, BookIcon, HeartIcon, CameraIcon, CodeIcon, UtensilsIcon, PlaneIcon, DollarSignIcon } from 'lucide-react';
type CategoryGridProps = {
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
};
export const CategoriesGrid = ({
  activeCategory,
  setActiveCategory
}: CategoryGridProps) => {
  const categories = [{
    id: 'music',
    name: 'Music',
    icon: <MusicIcon className="h-5 w-5" />,
    color: 'bg-purple-100 text-purple-700'
  }, {
    id: 'sports',
    name: 'Sports',
    icon: <DumbbellIcon className="h-5 w-5" />,
    color: 'bg-blue-100 text-blue-700'
  }, {
    id: 'arts',
    name: 'Arts',
    icon: <PaletteIcon className="h-5 w-5" />,
    color: 'bg-pink-100 text-pink-700'
  }, {
    id: 'culture',
    name: 'Culture',
    icon: <GlobeIcon className="h-5 w-5" />,
    color: 'bg-green-100 text-green-700'
  }, {
    id: 'lifestyle',
    name: 'Lifestyle',
    icon: <CoffeeIcon className="h-5 w-5" />,
    color: 'bg-yellow-100 text-yellow-700'
  }, {
    id: 'professional',
    name: 'Professional',
    icon: <BriefcaseIcon className="h-5 w-5" />,
    color: 'bg-gray-100 text-gray-700'
  }, {
    id: 'hobbies',
    name: 'Hobbies',
    icon: <ScissorsIcon className="h-5 w-5" />,
    color: 'bg-red-100 text-red-700'
  }, {
    id: 'technology',
    name: 'Technology',
    icon: <CodeIcon className="h-5 w-5" />,
    color: 'bg-indigo-100 text-indigo-700'
  }];
  const handleCategoryClick = (categoryId: string) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null); // Deselect if already selected
    } else {
      setActiveCategory(categoryId);
    }
  };
  return <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Browse by Category
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
        {categories.map(category => <button key={category.id} onClick={() => handleCategoryClick(category.id)} className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all ${activeCategory === category.id ? `${category.color} border-2 border-current shadow-sm` : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}>
            <div className={`p-2 rounded-full ${activeCategory === category.id ? 'bg-white/50' : category.color}`}>
              {category.icon}
            </div>
            <span className="mt-2 text-sm font-medium">{category.name}</span>
          </button>)}
      </div>
    </div>;
};
function DumbbellIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m6.5 6.5 11 11" />
      <path d="m21 21-1-1" />
      <path d="m3 3 1 1" />
      <path d="m18 22 4-4" />
      <path d="m2 6 4-4" />
      <path d="m3 10 7-7" />
      <path d="m14 21 7-7" />
    </svg>;
}
function PaletteIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="13.5" cy="6.5" r=".5" />
      <circle cx="17.5" cy="10.5" r=".5" />
      <circle cx="8.5" cy="7.5" r=".5" />
      <circle cx="6.5" cy="12.5" r=".5" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>;
}