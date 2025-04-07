import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/use-toast';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const [showDialog, setShowDialog] = React.useState(true);
  const { isLoggedIn, login } = useAuth();
  const { toast } = useToast();

  // Always render the children, but show the dialog if not logged in
  return (
    <>
      {/* Always render the children */}
      <div className={isLoggedIn ? '' : 'pointer-events-none filter blur-sm'}>
        {children}
      </div>
      
      {/* Only show the dialog if not logged in */}
      {!isLoggedIn && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Authentication Required</DialogTitle>
              <DialogDescription>
                Please sign in via Strava to view this page.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center py-4">
              <svg viewBox="0 0 40 40" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#FC4C02" />
                <path d="M23.5,19.3l-3-6.6l-3,6.6h6.1M25.7,24.4l-3-6.6h-7.5l-3,6.6h4.2l1.7-3.8h6.1l1.7,3.8h4.2" fill="white" />
              </svg>
            </div>
            <DialogFooter className="sm:justify-center">
              <Button 
                onClick={login}
                className="bg-[#FC4C02] hover:bg-[#e64500] text-white rounded-full gap-2 w-full md:w-auto"
              >
                <LogIn size={18} />
                Login with Strava
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default RequireAuth;
