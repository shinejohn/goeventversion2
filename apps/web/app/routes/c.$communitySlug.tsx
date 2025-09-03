import { useParams } from 'react-router';

// Use the existing Magic Patterns hub community page with mock data
import HubCommunityPage from '~/components/magic-patterns/pages/hub/[slug]/community';

export default function CommunityCalendarPage() {
  return <HubCommunityPage />;
}