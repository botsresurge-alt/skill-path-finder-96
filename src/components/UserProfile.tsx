import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, GraduationCap, Code, Heart, Upload, X, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserProfileProps {
  onComplete: (profile: any) => void;
}

const UserProfile = ({ onComplete }: UserProfileProps) => {
  const [profile, setProfile] = useState({
    name: "",
    education: "",
    specialization: "",
    skills: [] as string[],
    interests: [] as string[],
    resume: null as File | null,
  });
  
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to continue",
          variant: "destructive",
        });
        return;
      }
    };
    checkUser();
  }, [toast]);

  const handleSkillAdd = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const handleInterestAdd = () => {
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      setProfile(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest("");
    }
  };

  const removeSkill = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const removeInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      // Save profile to database
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: session.user.id,
          name: profile.name,
          education: profile.education,
          specialization: profile.specialization,
          skills: profile.skills,
          interests: profile.interests,
        });

      if (profileError) throw profileError;

      // Get AI job suggestions
      const { error: aiError } = await supabase.functions.invoke('suggest-jobs', {
        body: { profile }
      });

      if (aiError) {
        console.error('AI suggestions error:', aiError);
        // Continue even if AI fails
      }

      toast({
        title: "Profile saved!",
        description: "Getting your personalized job suggestions...",
      });

      onComplete(profile);
    } catch (error: any) {
      console.error('Profile save error:', error);
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile(prev => ({ ...prev, resume: file }));
    }
  };

  return (
    <div className="min-h-screen p-4 pt-20">
      <div className="container mx-auto max-w-2xl">
        <Card className="gradient-card shadow-elevated border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gradient flex items-center justify-center gap-2">
              <User className="h-6 w-6" />
              Build Your Profile
            </CardTitle>
            <p className="text-muted-foreground">
              Help us understand your background to provide better job matches
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="education">Education Level</Label>
                    <Select 
                      value={profile.education} 
                      onValueChange={(value) => setProfile(prev => ({ ...prev, education: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high-school">High School</SelectItem>
                        <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                        <SelectItem value="masters">Master's Degree</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                        <SelectItem value="bootcamp">Bootcamp/Certification</SelectItem>
                        <SelectItem value="self-taught">Self-taught</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      value={profile.specialization}
                      onChange={(e) => setProfile(prev => ({ ...prev, specialization: e.target.value }))}
                      placeholder="e.g., Computer Science, Marketing"
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  <Label>Skills</Label>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSkillAdd())}
                  />
                  <Button type="button" onClick={handleSkillAdd} variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive" 
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-secondary" />
                  <Label>Interests</Label>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add an interest..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleInterestAdd())}
                  />
                  <Button type="button" onClick={handleInterestAdd} variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <Badge key={interest} variant="outline" className="flex items-center gap-1">
                      {interest}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive" 
                        onClick={() => removeInterest(interest)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Resume Upload */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-accent" />
                  <Label>Resume (Optional)</Label>
                </div>
                
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Label 
                    htmlFor="resume" 
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm">
                      {profile.resume ? profile.resume.name : "Click to upload your resume"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      PDF, DOC, or DOCX (Max 10MB)
                    </span>
                  </Label>
                </div>
              </div>

              <Button 
                type="submit" 
                variant="hero" 
                className="w-full"
                disabled={!profile.name || !profile.education || profile.skills.length === 0 || isLoading}
              >
                {isLoading ? "Generating AI Suggestions..." : "Complete Profile & Get Job Suggestions"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;