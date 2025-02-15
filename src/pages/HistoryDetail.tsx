import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface OptimizationHistory {
  id: string;
  created_at: string;
  original_text: string;
  optimized_text: string;
  seo_score: number;
  status: string;
}

const getWordCount = (text: string) => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

const HistoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState<OptimizationHistory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoryDetail = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth/sign-in');
        return;
      }

      const { data, error } = await supabase
        .from('optimization_history')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error('Error fetching history detail:', error);
        navigate('/history');
        return;
      }

      setHistory(data);
      setLoading(false);
    };

    fetchHistoryDetail();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Header />
        <div className="container max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Loading...
          </h1>
        </div>
      </div>
    );
  }

  if (!history) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <div className="container max-w-7xl mx-auto px-4 py-16">
        <div className="mb-8 flex items-center gap-4 flex-wrap">
          <Button
            variant="outline"
            onClick={() => navigate('/history')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to History
          </Button>
          <Badge variant={history.status === 'completed' ? 'default' : 'secondary'}>
            {history.status}
          </Badge>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {format(new Date(history.created_at), 'PPp')}
          </span>
          <Badge variant="secondary">SEO Score: {history.seo_score}</Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Original Content</CardTitle>
                <Badge variant="outline">{getWordCount(history.original_text)} words</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown>{history.original_text}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Optimized Content</CardTitle>
                <Badge variant="outline">{getWordCount(history.optimized_text)} words</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown>{history.optimized_text}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HistoryDetail;
