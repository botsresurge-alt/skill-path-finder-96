import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Clock, 
  Star, 
  ExternalLink, 
  CheckCircle, 
  Play,
  Award,
  TrendingUp
} from "lucide-react";

interface LearningPathProps {
  userProfile: any;
}

const LearningPath = ({ userProfile }: LearningPathProps) => {
  const learningRecommendations = [
    {
      id: "1",
      title: "Advanced React Development",
      provider: "Tech Academy",
      duration: "8 weeks",
      difficulty: "Intermediate",
      rating: 4.8,
      students: "12,450",
      price: "Free",
      description: "Master advanced React concepts including hooks, context, and performance optimization.",
      skills: ["React Hooks", "State Management", "Performance", "Testing"],
      progress: 0,
      isRecommended: true
    },
    {
      id: "2",
      title: "Full Stack Web Development Bootcamp",
      provider: "CodeCamp Pro",
      duration: "12 weeks",
      difficulty: "Beginner to Advanced",
      rating: 4.9,
      students: "28,340",
      price: "$99",
      description: "Complete full-stack development course covering frontend, backend, and deployment.",
      skills: ["Node.js", "Express", "MongoDB", "React", "AWS"],
      progress: 0,
      isRecommended: true
    },
    {
      id: "3",
      title: "UI/UX Design Fundamentals",
      provider: "Design Institute",
      duration: "6 weeks",
      difficulty: "Beginner",
      rating: 4.6,
      students: "9,120",
      price: "$79",
      description: "Learn the principles of user interface and user experience design.",
      skills: ["Figma", "Design Thinking", "Prototyping", "User Research"],
      progress: 0,
      isRecommended: false
    },
    {
      id: "4",
      title: "Data Science with Python",
      provider: "Data University",
      duration: "10 weeks",
      difficulty: "Intermediate",
      rating: 4.7,
      students: "15,780",
      price: "$149",
      description: "Comprehensive data science course covering machine learning and data analysis.",
      skills: ["Python", "Pandas", "Machine Learning", "Statistics"],
      progress: 0,
      isRecommended: false
    }
  ];

  const skillGaps = [
    {
      skill: "TypeScript",
      currentLevel: 60,
      targetLevel: 90,
      priority: "High",
      courses: 3
    },
    {
      skill: "Node.js",
      currentLevel: 30,
      targetLevel: 80,
      priority: "Medium",
      courses: 5
    },
    {
      skill: "AWS",
      currentLevel: 20,
      targetLevel: 70,
      priority: "Medium",
      courses: 4
    },
    {
      skill: "Testing",
      currentLevel: 40,
      targetLevel: 85,
      priority: "High",
      courses: 2
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "text-success";
      case "Intermediate": return "text-warning";
      case "Advanced": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-destructive";
      case "Medium": return "text-warning";
      case "Low": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gradient mb-2">Your Learning Journey</h2>
        <p className="text-muted-foreground">
          Personalized course recommendations to boost your career prospects
        </p>
      </div>

      {/* Skill Gap Analysis */}
      <Card className="gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Skill Gap Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillGaps.map((gap) => (
              <div key={gap.skill} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{gap.skill}</h4>
                  <Badge 
                    variant="outline" 
                    className={getPriorityColor(gap.priority)}
                  >
                    {gap.priority} Priority
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current</span>
                    <span className="text-muted-foreground">Target</span>
                  </div>
                  <div className="relative">
                    <Progress value={gap.currentLevel} className="h-3" />
                    <div 
                      className="absolute top-0 w-1 h-3 bg-accent rounded"
                      style={{ left: `${gap.targetLevel}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{gap.currentLevel}%</span>
                    <span>{gap.targetLevel}%</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {gap.courses} courses available
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Courses */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Recommended Courses</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {learningRecommendations.map((course) => (
            <Card 
              key={course.id} 
              className={`gradient-card shadow-card border-0 ${
                course.isRecommended ? 'ring-2 ring-primary/20' : ''
              }`}
            >
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      {course.isRecommended && (
                        <Badge variant="secondary" className="text-xs">
                          <Award className="h-3 w-3 mr-1" />
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{course.provider}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{course.price}</div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-current text-warning" />
                      {course.rating}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </div>
                  <div className={getDifficultyColor(course.difficulty)}>
                    {course.difficulty}
                  </div>
                  <div>
                    {course.students} students
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {course.description}
                </p>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Skills you'll learn:</h4>
                  <div className="flex flex-wrap gap-2">
                    {course.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {course.progress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button 
                    variant={course.progress > 0 ? "secondary" : "hero"} 
                    className="flex-1"
                  >
                    {course.progress > 0 ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Continue
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Start Course
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="gradient-card shadow-card border-0">
          <CardContent className="p-6 text-center">
            <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-muted-foreground">Courses Completed</div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card shadow-card border-0">
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">0h</div>
            <div className="text-sm text-muted-foreground">Learning Time</div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card shadow-card border-0">
          <CardContent className="p-6 text-center">
            <Award className="h-8 w-8 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-muted-foreground">Certificates Earned</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LearningPath;