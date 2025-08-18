import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PenTool, Wind, Brain, Target, MessageSquare, RotateCcw } from 'lucide-react';
import { ToolsEngine } from '../tools/ToolsEngine';

const tools = [
  {
    id: 'journaling',
    title: 'Journaling Prompts',
    description: 'Guided writing exercises for self-reflection',
    icon: PenTool,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    id: 'breathwork',
    title: 'Breathwork & Grounding',
    description: 'Calming exercises to center yourself',
    icon: Wind,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 'reframe',
    title: 'Reframe Exercises',
    description: 'Change negative thought patterns',
    icon: Brain,
    color: 'bg-green-100 text-green-600'
  },
  {
    id: 'planning',
    title: 'Planning & Goal Setting',
    description: 'Structure your path forward',
    icon: Target,
    color: 'bg-orange-100 text-orange-600'
  }
];

export const ToolsSection = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [completedTools, setCompletedTools] = useState<any[]>([]);

  const handleToolSelect = (toolId: string) => {
    // Open example.com in a new tab
    window.open('https://example.com', '_blank');
  };

  const handleToolComplete = (data: any) => {
    setCompletedTools(prev => [...prev, { ...data, timestamp: new Date() }]);
    setSelectedTool(null);
  };

  const handleBack = () => {
    setSelectedTool(null);
  };

  if (selectedTool) {
    return (
      <div className="space-y-6">
        <ToolsEngine 
          selectedTool={selectedTool}
          onToolComplete={handleToolComplete}
          onBack={handleBack}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-indigo-900 mb-2">Tools</h1>
        <p className="text-gray-600">Self-guided support tools available anytime you need them.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card key={tool.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center mb-3`}>
                  <Icon size={24} />
                </div>
                <CardTitle className="text-lg">{tool.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                <Button 
                  onClick={() => handleToolSelect(tool.id)}
                  className="w-full group-hover:bg-indigo-700 transition-colors"
                >
                  Start Tool
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-0">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">Need Something Specific?</h3>
            <p className="text-gray-600 mb-4">
              Can't find the right tool? Let your helper know what you're looking for, 
              and they can guide you to the perfect exercise.
            </p>
            <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
              Ask Your Helper
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recently Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedTools.slice(-2).map((tool, index) => {
                const toolConfig = tools.find(t => t.id === tool.type);
                const Icon = toolConfig?.icon || MessageSquare;
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className="text-indigo-600" size={20} />
                      <span className="text-sm font-medium">{toolConfig?.title || 'Tool'}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {tool.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                );
              })}
              {completedTools.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No tools used yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recommended for You</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Brain className="text-green-600" size={20} />
                  <span className="text-sm font-medium">Thought Reframing</span>
                </div>
                <p className="text-xs text-gray-600">Based on your recent conversations about work stress</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="text-orange-600" size={20} />
                  <span className="text-sm font-medium">Goal Setting</span>
                </div>
                <p className="text-xs text-gray-600">Help organize your thoughts and create actionable plans</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};