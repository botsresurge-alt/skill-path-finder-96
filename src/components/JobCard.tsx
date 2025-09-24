import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MapPin, DollarSign, Clock, Building, ExternalLink, Heart, BookOpen } from "lucide-react";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    type: string;
    matchPercentage: number;
    reason: string;
    requiredSkills: string[];
    description: string;
    posted: string;
  };
  onSave?: (jobId: string) => void;
  onViewDetails?: (jobId: string) => void;
  onGetLearning?: (skills: string[]) => void;
}

const JobCard = ({ job, onSave, onViewDetails, onGetLearning }: JobCardProps) => {
  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return "text-success";
    if (percentage >= 70) return "text-primary";
    if (percentage >= 50) return "text-warning";
    return "text-muted-foreground";
  };

  const getMatchBgColor = (percentage: number) => {
    if (percentage >= 90) return "bg-success/10";
    if (percentage >= 70) return "bg-primary/10";
    if (percentage >= 50) return "bg-warning/10";
    return "bg-muted";
  };

  return (
    <Card className="gradient-card shadow-card border-0 hover:shadow-elevated transition-smooth">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl text-foreground">{job.title}</CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                {job.company}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.location}
              </div>
            </div>
          </div>
          
          <div className={`text-right ${getMatchBgColor(job.matchPercentage)} rounded-lg p-3`}>
            <div className={`text-2xl font-bold ${getMatchColor(job.matchPercentage)}`}>
              {job.matchPercentage}%
            </div>
            <div className="text-xs text-muted-foreground">Match</div>
          </div>
        </div>

        {/* Match Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Skill Match</span>
            <span className={getMatchColor(job.matchPercentage)}>{job.matchPercentage}%</span>
          </div>
          <Progress value={job.matchPercentage} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Job Details */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            {job.salary}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            {job.type}
          </div>
          <div className="text-muted-foreground">
            Posted {job.posted}
          </div>
        </div>

        {/* Why This Matches */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-foreground">Why this matches you:</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{job.reason}</p>
        </div>

        {/* Required Skills */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-foreground">Required Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {job.requiredSkills.map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-foreground">Description:</h4>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {job.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button 
            variant="hero" 
            className="flex-1" 
            onClick={() => onViewDetails?.(job.id)}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onSave?.(job.id)}
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => onGetLearning?.(job.requiredSkills)}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Learn
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;