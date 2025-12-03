import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiMapPin, FiTrash2, FiExternalLink, FiCheck, FiClock, FiX } from 'react-icons/fi';
import { bugReportService } from '../../firebase/services';
import { BugReport } from '../../types/bugReport';
import toast from 'react-hot-toast';

/**
 * BugReportsPanel Component
 * 
 * Admin panel section for viewing and managing bug reports.
 * Features:
 * - List all bug reports
 * - Update status
 * - Delete reports
 * - "View on Site" - Opens URL with bug marker
 */

const Panel = styled.div`
  background: var(--admin-grey, #f8f9fa);
  border-radius: 16px;
  padding: 1.5rem;
  margin-top: 1.5rem;
`;

const PanelTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--admin-dark, #2c3e50);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: var(--admin-primary, #00acc1);
  }
`;

const ReportsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ReportCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid var(--admin-border, #e9ecef);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 1rem;
`;

const ReportInfo = styled.div`
  flex: 1;
`;

const ReportUrl = styled.a`
  font-size: 0.9rem;
  color: var(--admin-primary, #00acc1);
  text-decoration: none;
  font-weight: 500;
  display: block;
  margin-bottom: 0.25rem;
  word-break: break-all;

  &:hover {
    text-decoration: underline;
  }
`;

const ReportMeta = styled.div`
  font-size: 0.8rem;
  color: var(--admin-dark-grey, #6c757d);
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  
  ${props => {
    switch (props.$status) {
      case 'new':
        return `
          background: #ffeaa7;
          color: #d63031;
        `;
      case 'in_progress':
        return `
          background: #74b9ff;
          color: #0984e3;
        `;
      case 'resolved':
        return `
          background: #55efc4;
          color: #00b894;
        `;
      case 'rejected':
        return `
          background: #dfe6e9;
          color: #636e72;
        `;
      default:
        return `
          background: #dfe6e9;
          color: #636e72;
        `;
    }
  }}
`;

const ReportComment = styled.div`
  font-size: 0.9rem;
  color: var(--admin-dark, #2c3e50);
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  background: var(--admin-grey, #f8f9fa);
  border-radius: 8px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
`;

const ReportDetails = styled.div`
  font-size: 0.75rem;
  color: var(--admin-dark-grey, #6c757d);
  margin-bottom: 0.75rem;
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'danger' | 'success' }>`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: none;

  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #26c6da, #00acc1);
          color: white;
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 172, 193, 0.3);
          }
        `;
      case 'danger':
        return `
          background: linear-gradient(135deg, #dc3545, #c82333);
          color: white;
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
          }
        `;
      case 'success':
        return `
          background: linear-gradient(135deg, #28a745, #218838);
          color: white;
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
          }
        `;
      default:
        return `
          background: #f8f9fa;
          color: #495057;
          
          &:hover:not(:disabled) {
            background: #e9ecef;
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--admin-dark-grey, #6c757d);
  font-size: 0.95rem;
`;

const LoadingState = styled(EmptyState)`
  color: var(--admin-primary, #00acc1);
`;

const BugReportsPanel: React.FC = () => {
  const [reports, setReports] = useState<BugReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await bugReportService.getAll();
      setReports(data);
    } catch (error) {
      console.error('Error loading bug reports:', error);
      toast.error('Помилка завантаження звітів');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOnSite = (report: BugReport) => {
    const url = new URL(report.url);
    url.searchParams.set('bug_id', report.id);
    window.open(url.toString(), '_blank');
  };

  const handleUpdateStatus = async (id: string, status: BugReport['status']) => {
    try {
      await bugReportService.updateStatus(id, status);
      toast.success('Статус оновлено');
      loadReports(); // Reload to show updated data
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Помилка оновлення статусу');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Видалити цей звіт?')) return;

    try {
      await bugReportService.delete(id);
      toast.success('Звіт видалено');
      loadReports(); // Reload to show updated list
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Помилка видалення');
    }
  };

  const statusLabels: Record<string, string> = {
    new: 'Новий',
    in_progress: 'В роботі',
    resolved: 'Вирішено',
    rejected: 'Відхилено'
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <FiMapPin />;
      case 'in_progress':
        return <FiClock />;
      case 'resolved':
        return <FiCheck />;
      case 'rejected':
        return <FiX />;
      default:
        return null;
    }
  };

  return (
    <Panel>
      <PanelTitle>
        <FiMapPin />
        Звіти про баги ({reports.length})
      </PanelTitle>

      {loading ? (
        <LoadingState>Завантаження звітів...</LoadingState>
      ) : reports.length === 0 ? (
        <EmptyState>Звітів поки немає</EmptyState>
      ) : (
        <ReportsList>
          {reports.map(report => (
            <ReportCard key={report.id}>
              <ReportHeader>
                <ReportInfo>
                  <ReportUrl href={report.url} target="_blank" rel="noopener noreferrer">
                    {report.url}
                  </ReportUrl>
                  <ReportMeta>
                    {report.userName} • {new Date(report.createdAt).toLocaleString('uk-UA')}
                  </ReportMeta>
                </ReportInfo>
                <StatusBadge $status={report.status}>
                  {getStatusIcon(report.status)}
                  {statusLabels[report.status]}
                </StatusBadge>
              </ReportHeader>

              <ReportComment>{report.comment}</ReportComment>

              <ReportDetails>
                Позиція: {report.xPos.toFixed(1)}%, {report.yPos.toFixed(1)}%
                {report.elementInfo && ` • Елемент: ${report.elementInfo.tagName.toLowerCase()}`}
                {report.windowWidth && ` • Розмір: ${report.windowWidth}x${report.windowHeight}`}
              </ReportDetails>

              <ActionsRow>
                <ActionButton $variant="primary" onClick={() => handleViewOnSite(report)}>
                  <FiExternalLink />
                  Переглянути на сайті
                </ActionButton>

                {report.status === 'new' && (
                  <ActionButton onClick={() => handleUpdateStatus(report.id, 'in_progress')}>
                    <FiClock />
                    В роботу
                  </ActionButton>
                )}

                {(report.status === 'new' || report.status === 'in_progress') && (
                  <ActionButton $variant="success" onClick={() => handleUpdateStatus(report.id, 'resolved')}>
                    <FiCheck />
                    Вирішено
                  </ActionButton>
                )}

                {report.status !== 'rejected' && (
                  <ActionButton onClick={() => handleUpdateStatus(report.id, 'rejected')}>
                    <FiX />
                    Відхилити
                  </ActionButton>
                )}

                <ActionButton $variant="danger" onClick={() => handleDelete(report.id)}>
                  <FiTrash2 />
                  Видалити
                </ActionButton>
              </ActionsRow>
            </ReportCard>
          ))}
        </ReportsList>
      )}
    </Panel>
  );
};

export default BugReportsPanel;
