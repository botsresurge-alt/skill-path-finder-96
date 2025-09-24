import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AuthForm from "@/components/AuthForm";
import UserProfile from "@/components/UserProfile";
import Dashboard from "@/components/Dashboard";

type AppState = "home" | "auth" | "profile" | "dashboard";

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("home");
  const [userProfile, setUserProfile] = useState(null);

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
