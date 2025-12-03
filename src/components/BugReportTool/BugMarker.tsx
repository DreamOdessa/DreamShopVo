import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiMapPin, FiX } from 'react-icons/fi';
import { bugReportService } from '../../firebase/services';
import { BugReport } from '../../types/bugReport';

/**
 * BugMarker Component
 * 
 * Displays bug markers on the page when viewing a specific bug report.
 * Activated by URL query parameter: ?bug_id=123
 * 
 * Shows the exact position where the bug was reported with:
 * - Visual marker (flag icon)
 * - Comment popup
 * - Reporter info
 */

const MarkerContainer = styled.div<{ $x: number; $y: number }>`
  position: fixed;
  left: ${props => props.$x}%;
  top: ${props => props.$y}%;
  transform: translate(-50%, -50%);
  z-index: 10001;
  pointer-events: none;
`;

const MarkerPin = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(231, 76, 60, 0.4);
  animation: bounce 2s infinite;
  pointer-events: auto;
  cursor: pointer;

  svg {
    transform: rotate(45deg);
    color: white;
    font-size: 20px;
  }

  @keyframes bounce {
    0%, 100% {
      transform: rotate(-45deg) translateY(0);
    }
    50% {
      transform: rotate(-45deg) translateY(-10px);
    }
  }
`;

const CommentPopup = styled.div`
  position: absolute;
  left: 50%;
  top: -160px;
  transform: translateX(-50%);
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  padding: 16px;
  min-width: 250px;
  max-width: 350px;
  pointer-events: auto;

  @media (max-width: 768px) {
    max-width: 280px;
  }
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const PopupTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: #2c3e50;
  }
`;

const CommentText = styled.div`
  font-size: 13px;
  color: #495057;
  line-height: 1.5;
  margin-bottom: 12px;
  white-space: pre-wrap;
  word-break: break-word;
`;

const MetaInfo = styled.div`
  font-size: 11px;
  color: #6c757d;
  border-top: 1px solid #e9ecef;
  padding-top: 8px;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  margin-left: 8px;
  
  ${props => {
    switch (props.$status) {
      case 'new':
        return 'background: #ffeaa7; color: #d63031;';
      case 'in_progress':
        return 'background: #74b9ff; color: #0984e3;';
      case 'resolved':
        return 'background: #55efc4; color: #00b894;';
      case 'rejected':
        return 'background: #dfe6e9; color: #636e72;';
      default:
        return 'background: #dfe6e9; color: #636e72;';
    }
  }}
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 10000;
  pointer-events: auto;
`;

const BugMarker: React.FC = () => {
  const [bugReport, setBugReport] = useState<BugReport | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check URL for bug_id parameter
    const params = new URLSearchParams(window.location.search);
    const bugId = params.get('bug_id');

    if (bugId) {
      // Load bug report data
      loadBugReport(bugId);
      setShowPopup(true); // Auto-show popup when marker loads
    }
  }, []);

  const loadBugReport = async (bugId: string) => {
    try {
      const report = await bugReportService.getById(bugId);
      if (report) {
        setBugReport(report);
      }
    } catch (error) {
      console.error('Error loading bug report:', error);
    }
  };

  const handleClose = () => {
    // Remove bug_id from URL and hide marker
    const url = new URL(window.location.href);
    url.searchParams.delete('bug_id');
    window.history.replaceState({}, '', url.toString());
    setBugReport(null);
  };

  if (!bugReport) return null;

  const statusLabels: Record<string, string> = {
    new: 'Новий',
    in_progress: 'В роботі',
    resolved: 'Вирішено',
    rejected: 'Відхилено'
  };

  return (
    <>
      {showPopup && <Overlay onClick={() => setShowPopup(false)} />}
      
      <MarkerContainer $x={bugReport.xPos} $y={bugReport.yPos}>
        <MarkerPin onClick={() => setShowPopup(!showPopup)}>
          <FiMapPin />
        </MarkerPin>

        {showPopup && (
          <CommentPopup>
            <PopupHeader>
              <PopupTitle>
                Звіт про баг
                <StatusBadge $status={bugReport.status}>
                  {statusLabels[bugReport.status]}
                </StatusBadge>
              </PopupTitle>
              <CloseButton onClick={handleClose}>
                <FiX />
              </CloseButton>
            </PopupHeader>

            <CommentText>{bugReport.comment}</CommentText>

            <MetaInfo>
              <div>Від: {bugReport.userName}</div>
              <div>Дата: {new Date(bugReport.createdAt).toLocaleString('uk-UA')}</div>
              {bugReport.elementInfo && (
                <div>Елемент: {bugReport.elementInfo.tagName.toLowerCase()}</div>
              )}
            </MetaInfo>
          </CommentPopup>
        )}
      </MarkerContainer>
    </>
  );
};

export default BugMarker;
