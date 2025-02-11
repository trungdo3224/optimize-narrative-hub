import React from 'react';
import { Link } from 'react-router-dom';
import Button from "@/components/Button";
import { supabase } from '@/integrations/supabase/client';
import UserMenu from "@/components/UserMenu";

const Header: React.FC = () => {
  const [session, setSession] = React.useState<any>(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <header className="sticky top-0 bg-background border-b z-50">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-bold text-xl">
          Optimize Narrative Hub
        </Link>
        <nav className="flex items-center space-x-4">
          {session ? (
            <UserMenu />
          ) : (
            <>
              <Link to="/auth/sign-in">
                <Button variant="secondary" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth/sign-up">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
