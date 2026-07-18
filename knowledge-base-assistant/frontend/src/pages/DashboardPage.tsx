import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FileStack, MessageSquare, AlertCircle, Upload } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import StatCard from '../components/dashboard/StatCard';
import FileTypeStamp from '../components/common/FileTypeStamp';
import Loader from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import * as dashboardService from '../services/dashboardService';
import { getErrorMessage } from '../services/api';
import type { DashboardStats } from '../types';
import { formatDate } from '../utils/format';

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data } = await dashboardService.getDashboardStats();
      setStats(data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-semibold text-ink-900">AI Knowledge Base Dashboard</h1>
        <p className="text-sm text-ink-400 mt-1">An overview of your knowledge base</p>
      </div>

      {isLoading && <Loader label="Loading dashboard…" />}
      {!isLoading && error && <ErrorState message={error} onRetry={fetchStats} />}

      {!isLoading && !error && stats && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard label="Documents" value={stats.totalDocuments} icon={FileStack} />
            <StatCard label="Questions asked" value={stats.totalQuestions} icon={MessageSquare} />
            <StatCard
              label="Failed extractions"
              value={stats.failedExtractions}
              icon={AlertCircle}
              tone={stats.failedExtractions > 0 ? 'warning' : 'default'}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="card p-5">
              <h2 className="font-display font-semibold text-ink-900 mb-4">Recent uploads</h2>
              {stats.recentUploads.length === 0 ? (
                <EmptyState
                  icon={Upload}
                  title="No documents yet"
                  description="Upload your first document to get started."
                  action={
                    <Link to="/documents" className="btn-primary">
                      Upload a document
                    </Link>
                  }
                />
              ) : (
                <ul className="space-y-3">
                  {stats.recentUploads.map((doc) => (
                    <li key={doc._id} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink-800 truncate">{doc.name}</p>
                        <p className="text-xs text-ink-400 font-mono">{formatDate(doc.createdAt)}</p>
                      </div>
                      <FileTypeStamp fileType={doc.fileType} />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="card p-5">
              <h2 className="font-display font-semibold text-ink-900 mb-4">Recent questions</h2>
              {stats.recentConversations.length === 0 ? (
                <EmptyState
                  icon={MessageSquare}
                  title="No questions yet"
                  description="Ask your first question once you've uploaded a document."
                />
              ) : (
                <ul className="space-y-3">
                  {stats.recentConversations.map((conv) => (
                    <li key={conv._id}>
                      <p className="text-sm font-medium text-ink-800 truncate">{conv.question}</p>
                      <p className="text-xs text-ink-400 font-mono">{formatDate(conv.createdAt)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default DashboardPage;