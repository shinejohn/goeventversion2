import { render } from '@testing-library/react';
import { CalendarComponent } from '~/components/magic-patterns/calendar';
import mockData from '~/components/magic-patterns/mock-data/events.json';
import { createDataService } from '~/lib/services/data-service';

describe('UI Integrity Tests', () => {
  it('preserves all Magic Patterns classes when switching data sources', async () => {
    // Render with mock data
    const { container: mockContainer } = render(
      <CalendarComponent events={mockData} />
    );
    
    // Extract all classes
    const mockClasses = Array.from(
      mockContainer.querySelectorAll('[class]')
    ).map(el => el.className);
    
    // Get real data
    const dataService = createDataService(supabaseClient);
    const realEvents = await dataService.getEvents('clearwater');
    
    // Render with real data
    const { container: realContainer } = render(
      <CalendarComponent events={realEvents} />
    );
    
    const realClasses = Array.from(
      realContainer.querySelectorAll('[class]')
    ).map(el => el.className);
    
    // Classes should be identical
    expect(realClasses).toEqual(mockClasses);
  });
  
  it('maintains responsive breakpoints', () => {
    const { container } = render(<CalendarComponent events={mockData} />);
    
    // Check for Tailwind responsive classes
    const responsiveClasses = [
      'sm:grid-cols-2',
      'md:grid-cols-3',
      'lg:grid-cols-4',
      'xl:px-8'
    ];
    
    responsiveClasses.forEach(className => {
      const elements = container.querySelectorAll(`.${className}`);
      expect(elements.length).toBeGreaterThan(0);
    });
  });
});