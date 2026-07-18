import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-ink-50 text-center px-4">
    <FileQuestion className="w-10 h-10 text-ink-400 mb-4" strokeWidth={1.5} />
    <h1 className="text-2xl font-display font-semibold text-ink-900 mb-1">Page not found</h1>
    <p className="text-sm text-ink-400 mb-6">The page you're looking for doesn't exist.</p>
    <Link to="/dashboard" className="btn-primary">
      Back to dashboard
    </Link>
  </div>
);

export default NotFoundPage;
