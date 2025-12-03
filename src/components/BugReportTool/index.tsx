import React, { lazy, Suspense } from 'react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * BugReportToolWrapper Component
 * 
 * CRITICAL PERFORMANCE FEATURE:
 * This wrapper implements LAZY LOADING for the BugReportTool.
 * The tool's JavaScript bundle is ONLY downloaded if:
 * - User is authenticated
 * - User has isAdmin === true (or isTester === true in future)
 * 
 * Regular customers NEVER download this code.
 * Zero impact on customer load time.
 */

// Lazy load the BugReportTool component
// This creates a separate bundle that is only fetched when needed
const BugReportTool = lazy(() => import('./BugReportTool'));

const BugReportToolWrapper: React.FC = () => {
  const { user } = useAuth();

  // Only load the tool for admins/testers
  const shouldLoadTool = user?.isAdmin === true || user?.isTester === true;

  if (!shouldLoadTool) {
    return null; // Regular users see nothing, download nothing
  }

  return (
    <Suspense fallback={null}>
      <BugReportTool />
    </Suspense>
  );
};

export default BugReportToolWrapper;
