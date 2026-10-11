import ProfilePanel from '../components/Profile.jsx';
import { PageHead } from '../components/ui.jsx';

export default function ProfilePage() {
  return (
    <div className="page narrow"><PageHead title="Profile" /><ProfilePanel /></div>
  );
}
