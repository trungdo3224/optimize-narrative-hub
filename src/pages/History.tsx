import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

const History = () => {
  const [history, setHistory] = useState<OptimizationHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('optimization_history')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching history:', error);
        return;
      }

      setHistory(data || []);
      setLoading(false);
    };

    fetchHistory();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <div className="container max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Optimization History
        </h1>
        <div className="grid gap-6">
          {history.map((item) => (
            <Link to={`/history/${item.id}`} key={item.id}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <CardTitle className="text-xl">
                      {item.original_text.substring(0, 100)}...
                    </CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">
                        Original: {getWordCount(item.original_text)} words
                      </Badge>
                      <Badge variant="outline">
                        Optimized: {getWordCount(item.optimized_text)} words
                      </Badge>
                      <Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>SEO Score: {item.seo_score}</span>
                    <span>{format(new Date(item.created_at), 'PPp')}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {history.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400">
              No optimization history found. Start optimizing content to see your history.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
