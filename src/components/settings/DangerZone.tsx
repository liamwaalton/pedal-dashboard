
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';

const DangerZone = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-red-500 mb-2">Danger Zone</h3>
      <p className="text-gray-500 mb-4">These actions are irreversible. Please be certain.</p>
      <div className="flex gap-4">
        <Button variant="outline" className="border-red-300 text-red-500 hover:bg-red-50">
          Delete Account
        </Button>
        <Button 
          className="bg-red-500 hover:bg-red-600"
          onClick={handleLogout}
        >
          <LogOut size={16} className="mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default DangerZone;
