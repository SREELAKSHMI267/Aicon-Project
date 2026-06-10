
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Bot, ThumbsUp, AlertTriangle } from 'lucide-react';
import type { ImproveGrammarAndStyleOutput } from '@/ai/flows/improve-grammar-style';
import type { CheckPaperForPlagiarismOutput } from '@/ai/flows/check-plagiarism';
import type { AiPoweredReviewOutput } from '@/ai/flows/ai-powered-review';
import type { CheckAiContentOutput } from '@/ai/flows/check-ai-content';
import { Separator } from './ui/separator';

type AnalysisType = 'plagiarism' | 'grammar' | 'review' | 'ai-content';

interface AnalysisResultProps {
  type: AnalysisType;
  result: any; // The result can be one of the three output types
}

const AnalysisResult = ({ type, result }: AnalysisResultProps) => {
  const renderContent = () => {
    switch (type) {
      case 'plagiarism':
        return <PlagiarismResult data={result as CheckPaperForPlagiarismOutput} />;
      case 'grammar':
        return <GrammarResult data={result as ImproveGrammarAndStyleOutput} />;
      case 'review':
        return <AiReviewResult data={result as AiPoweredReviewOutput} />;
      case 'ai-content':
        return <AiContentResult data={result as CheckAiContentOutput} />;
      default:
        return <p>Unknown analysis type.</p>;
    }
  };
  
  const getSubTitle = () => {
    return "Review the AI-generated feedback below.";
  }

  return (
     <Card className="shadow-lg animate-in fade-in-50">
        <CardHeader>
            <CardTitle>Analysis Results: {getFriendlyTitle(type)}</CardTitle>
            <CardDescription>{getSubTitle()}</CardDescription>
        </CardHeader>
        <CardContent>
            {renderContent()}
        </CardContent>
     </Card>
  )
};

const getFriendlyTitle = (type: AnalysisType) => {
    switch (type) {
        case 'plagiarism': return 'Plagiarism Check';
        case 'grammar': return 'Grammar & Style';
        case 'review': return 'AI-Powered Review';
        case 'ai-content': return 'AI Content Detection';
    }
}


const PlagiarismResult = ({ data }: { data: CheckPaperForPlagiarismOutput }) => {
  const score = data?.similarityScore ?? 0;
  const scoreColor = score > 20 ? 'text-red-500' : score > 5 ? 'text-yellow-500' : 'text-green-500';
  const flaggedSections = data?.flaggedSections ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Similarity Score</h3>
        <div className="flex items-center gap-4">
            <span className={`text-4xl font-bold ${scoreColor}`}>{score.toFixed(2)}%</span>
            <Progress value={score} className="w-full" />
        </div>
        <p className="text-sm text-muted-foreground mt-2">{data?.summary || 'No summary available.'}</p>
      </div>

      {flaggedSections && flaggedSections.length > 0 && (
        <>
        <Separator />
        <div>
          <h3 className="text-lg font-semibold mb-2">Flagged Sections</h3>
          <div className="space-y-4">
            {flaggedSections.map((section, index) => (
              <blockquote key={index} className="border-l-4 border-primary pl-4 py-2 bg-muted/50 rounded-r-md">
                <p className="italic">"{section}"</p>
                {data.sources?.[index] && (
                    <footer className="text-xs text-muted-foreground mt-2">Source: {data.sources[index]}</footer>
                )}
              </blockquote>
            ))}
          </div>
        </div>
        </>
      )}
       {flaggedSections?.length === 0 && (
          <div className="text-center py-8 bg-green-50/50 rounded-lg border border-dashed border-green-200">
             <ThumbsUp className="mx-auto h-12 w-12 text-green-500 mb-4" />
             <h4 className="text-lg font-semibold text-green-700">No Significant Plagiarism Detected</h4>
             <p className="text-sm text-muted-foreground mt-1">Great! The paper appears to be original.</p>
          </div>
       )}
    </div>
  );
};

const GrammarResult = ({ data }: { data: ImproveGrammarAndStyleOutput }) => {
  const changes = data?.changes ?? [];

  return (
    <div className="space-y-6">
       <div>
        <h3 className="text-lg font-semibold mb-2">Suggested Changes</h3>
        <p className="text-sm text-muted-foreground mb-4">
            The AI has identified the following areas for improvement to enhance clarity, conciseness, and academic tone.
        </p>
        <div className="space-y-4 max-h-[400px] overflow-y-auto p-2 rounded-md bg-muted/30">
            {changes.length > 0 ? (
              changes.map((change, index) => (
                <Card key={index}>
                    <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                        <div>
                            <p className="text-xs font-semibold text-red-600 uppercase mb-1">Original</p>
                            <p className="text-sm text-muted-foreground line-through">{change.original}</p>
                        </div>
                         <div>
                            <p className="text-xs font-semibold text-green-600 uppercase mb-1">Suggestion</p>
                            <p className="text-sm">{change.suggestion}</p>
                        </div>
                        <div className="md:col-span-2 mt-2">
                             <Badge variant="outline">{change.explanation}</Badge>
                        </div>
                    </CardContent>
                </Card>
              ))
            ) : (
              <div className="p-4 rounded-md bg-yellow-50 border border-yellow-200 text-sm text-muted-foreground">
                No suggested changes were returned by the grammar checker. Try rerunning the analysis or review the report text below.
              </div>
            )}
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="text-lg font-semibold mb-2">Revised Paper Text</h3>
        <div className="p-4 border rounded-md bg-muted/30 max-h-[400px] overflow-y-auto">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{data.improvedPaperText || 'No revised paper text is available.'}</p>
        </div>
      </div>
    </div>
  );
};

const AiReviewResult = ({ data }: { data: AiPoweredReviewOutput }) => {
  const feedback = data?.feedback ?? [];

  return (
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Bot className="h-5 w-5" /> Overall Summary</h3>
             <div className="p-4 border rounded-md bg-muted/50">
                <p className="text-sm leading-relaxed">{data?.summary || 'No summary available.'}</p>
            </div>
        </div>
        <Separator />
        <div>
            <h3 className="text-lg font-semibold mb-2">Actionable Feedback</h3>
            {feedback.length > 0 ? (
              <ul className="space-y-3">
                {feedback.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary font-bold text-lg mr-3">{index + 1}.</span>
                    <p className="text-sm text-muted-foreground leading-relaxed pt-1">{item}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No detailed feedback is available for this review.</p>
            )}
        </div>
    </div>
  );
};

const AiContentResult = ({ data }: { data: CheckAiContentOutput }) => {
  const aiContentScore = data?.aiContentScore ?? 0;
  const riskLevel = data?.riskLevel ?? 'Low';
  const summary = data?.summary ?? 'Analysis completed successfully.';
  const flaggedSections = data?.flaggedSections ?? [];

  const riskColor = riskLevel === 'High' ? 'text-red-600' : riskLevel === 'Medium' ? 'text-yellow-600' : 'text-green-600';
  const backgroundColor = riskLevel === 'High' ? 'bg-red-50' : riskLevel === 'Medium' ? 'bg-yellow-50' : 'bg-green-50';
  const borderColor = riskLevel === 'High' ? 'border-red-200' : riskLevel === 'Medium' ? 'border-yellow-200' : 'border-green-200';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">AI Content Score</h3>
        <div className="flex items-center gap-4 mb-4">
          <span className={`text-4xl font-bold ${riskColor}`}>{aiContentScore.toFixed(1)}%</span>
          <Progress value={aiContentScore} className="w-full" />
        </div>
        <div className={`p-4 rounded-lg border ${backgroundColor} ${borderColor}`}>
          <div className="flex items-start gap-3">
            <AlertTriangle className={`h-5 w-5 ${riskColor} mt-0.5 flex-shrink-0`} />
            <div>
              <p className="font-semibold mb-1">Risk Level: <span className={riskColor}>{riskLevel}</span></p>
              <p className="text-sm">{summary}</p>
            </div>
          </div>
        </div>
      </div>

      {flaggedSections.length > 0 && (
        <>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-2">Suspicious Sections</h3>
            <div className="space-y-4">
              {flaggedSections.map((section, index) => (
                <blockquote key={index} className="border-l-4 border-orange-400 pl-4 py-2 bg-orange-50/50 rounded-r-md">
                  <p className="italic text-sm">"{section}"</p>
                </blockquote>
              ))}
            </div>
          </div>
        </>
      )}

      {flaggedSections.length === 0 && (
        <div className="text-center py-8 bg-green-50/50 rounded-lg border border-dashed border-green-200">
          <ThumbsUp className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h4 className="text-lg font-semibold text-green-700">No AI Content Detected</h4>
          <p className="text-sm text-muted-foreground mt-1">The paper appears to be human-written with authentic voice.</p>
        </div>
      )}
    </div>
  );
};


export default AnalysisResult;
