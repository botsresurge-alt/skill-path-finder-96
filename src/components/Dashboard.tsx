import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Briefcase, 
  Target, 
  BookOpen, 
  User, 
  TrendingUp, 
  Star,
  Filter,
  Search
} from "lucide-react";
import JobCard from "./JobCard";
import LearningPath from "./LearningPath";

interface DashboardProps {
  userProfile: any;
}

const Dashboard = ({ userProfile }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("jobs");
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  // Mock job suggestions based on user profile
  const jobSuggestions = [
    {
      id: "1",
      title: "Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      salary: "$80k - $120k",
      type: "Full-time",
      matchPercentage: 95,
      reason: "Perfect match for your React and JavaScript skills. Your portfolio demonstrates strong frontend expertise.",
      requiredSkills: ["React", "JavaScript", "TypeScript", "CSS", "HTML"],
      description: "We're looking for a passionate Frontend Developer to join our team and build amazing user experiences. You'll work with React, TypeScript, and modern web technologies.",
      posted: "2 days ago"
    },
    {
      id: "2",
      title: "Full Stack Engineer",
      company: "StartupXYZ",
      location: "Remote",
      salary: "$90k - $140k",
      type: "Full-time",
      matchPercentage: 88,
      reason: "Your diverse skill set in both frontend and backend makes you ideal for this full-stack role.",
      requiredSkills: ["React", "Node.js", "Python", "MongoDB", "AWS"],
      description: "Join our fast-growing startup as a Full Stack Engineer. Build scalable applications from frontend to backend.",
      posted: "1 week ago"
    },
    {
      id: "3",
      title: "UI/UX Designer",
      company: "Design Studio",
      location: "New York, NY",
      salary: "$70k - $100k",
      type: "Full-time",
      matchPercentage: 72,
      reason: "Your design interests and creative background align well with this role, though some design tool experience would be beneficial.",
      requiredSkills: ["Figma", "Sketch", "Adobe Creative Suite", "Prototyping", "User Research"],
      description: "Create beautiful and intuitive user experiences for our clients. Work on diverse projects from mobile apps to web platforms.",
      posted: "3 days ago"
    },
    {
      id: "4",
      title: "Data Scientist",
      company: "AI Innovations",
      location: "Austin, TX",
      salary: "$100k - $160k",
      type: "Full-time",
      matchPercentage: 65,
      reason: "Your programming skills provide a good foundation, but you'd need to develop expertise in data science and machine learning.",
      requiredSkills: ["Python", "Machine Learning", "SQL", "Statistics", "TensorFlow"],
      description: "Analyze complex datasets and build machine learning models to drive business insights and decisions.",
      posted: "5 days ago"
    }
  ];

  const handleSaveJob = (jobId: string) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleViewJobDetails = (jobId: string) => {
    // In a real app, this would navigate to job details page
    console.log("Viewing job details for:", jobId);
  };

  const handleGetLearning = (skills: string[]) => {
    setActiveTab("learning");
  };

  const stats = [
    {
      title: "Profile Completeness",
      value: "85%",
      description: "Great! Your profile is almost complete",
      icon: User,
      color: "text-success"
    },
    {
      title: "Job Matches",
      value: jobSuggestions.length,
      description: "AI-powered recommendations",
      icon: Target,
      color: "text-primary"
    },
    {
      title: "Avg. Match Rate",
      value: "78%",
      description: "Higher than average",
      icon: TrendingUp,
      color: "text-accent"
    },
    {
      title: "Saved Jobs",
      value: savedJobs.length,
      description: "Jobs in your wishlist",
      icon: Star,
      color: "text-secondary"
    }
  ];

  return (
    <div className="min-h-screen p-4 pt-20">
      <div className="container mx-auto max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Welcome back, {userProfile?.name || "User"}!
          </h1>
          <p className="text-muted-foreground">
            Here are your personalized job recommendations and learning paths
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="gradient-card shadow-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Job Matches
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Learning Paths
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            {/* Filter Bar */}
            <div className="flex gap-4 items-center">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <div className="flex gap-2 ml-auto">
                <Badge variant="secondary">All ({jobSuggestions.length})</Badge>
                <Badge variant="outline">High Match (2)</Badge>
                <Badge variant="outline">Remote (1)</Badge>
              </div>
            </div>

            {/* Job Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobSuggestions.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onSave={handleSaveJob}
                  onViewDetails={handleViewJobDetails}
                  onGetLearning={handleGetLearning}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="learning">
            <LearningPath userProfile={userProfile} />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="gradient-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Education</h4>
                  <p className="text-muted-foreground">
                    {userProfile?.education} in {userProfile?.specialization}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {userProfile?.skills?.map((skill: string) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {userProfile?.interests?.map((interest: string) => (
                      <Badge key={interest} variant="outline">{interest}</Badge>
                    ))}
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;