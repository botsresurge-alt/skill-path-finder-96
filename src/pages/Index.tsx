import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AuthForm from "@/components/AuthForm";
import UserProfile from "@/components/UserProfile";
import Dashboard from "@/components/Dashboard";
import { supabase } from "@/integrations/supabase/client";

type AppState = "home" | "auth" | "profile" | "dashboard";

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("home");
  const [userProfile, setUserProfile] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        
        // Check if user has a profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (profile) {
          setUserProfile(profile);
          setCurrentState("dashboard");
        } else {
          setCurrentState("profile");
        }
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
          
          // Check if user has a profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (profile) {
            setUserProfile(profile);
            setCurrentState("dashboard");
          } else {
            setCurrentState("profile");
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserProfile(null);
          setCurrentState("home");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleGetStarted = () => {
    setCurrentState("auth");
  };

  const handleAuthSuccess = () => {
    setCurrentState("profile");
  };

  const handleProfileComplete = (profile: any) => {
    setUserProfile(profile);
    setCurrentState("dashboard");
  };

  if (currentState === "auth") {
    return (
      <>
        <Header showAuth={false} />
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      </>
    );
  }

  if (currentState === "profile") {
    return (
      <>
        <Header showAuth={false} />
        <UserProfile onComplete={handleProfileComplete} />
      </>
    );
  }

  if (currentState === "dashboard") {
    return (
      <>
        <Header showAuth={false} />
        <Dashboard userProfile={userProfile} />
      </>
    );
  }

  return (
    <>
      <Header onGetStarted={handleGetStarted} />
      <HeroSection onGetStarted={handleGetStarted} />
    </>
  );
};

export default Index;
