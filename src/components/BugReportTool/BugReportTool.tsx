import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { FiAlertCircle, FiX, FiSend } from 'react-icons/fi';
import { bugReportService } from '../../firebase/services';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

/**
 * BugReportTool Component
 * 
 * Visual Feedback Tool for testers and admins.
 * Allows clicking on any element to report a bug.
 * 
 * CRITICAL PERFORMANCE:
 * - This component is LAZY LOADED only for users with role 'admin' or 'tester'
 * - Regular users never download this code bundle
 * - Zero impact on customer load time
 */

// Floating Trigger Button
const FloatingButton = styled.button<{ $active: boolean }>`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, #e74c3c, #c0392b)' 
    : 'linear-gradient(135deg, #26c6da, #00acc1)'};
  color: white;
  border: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: all 0.3s ease;
  pointer-events: auto;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
    font-size: 20px;
    bottom: 16px;
    right: 16px;
  }
`;

// Overlay for feedback mode
const FeedbackOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 172, 193, 0.1);
  z-index: 9998;
  cursor: crosshair;
  pointer-events: auto;
`;

// Modal for bug report form
const Modal = styled.div<{ $x: number; $y: number }>`
  position: fixed;
  left: ${props => props.$x}px;
  top: ${props => props.$y}px;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  padding: 24px;
  min-width: 320px;
  max-width: 480px;
  z-index: 10000;
  pointer-events: auto;

  @media (max-width: 768px) {
    left: 50%;
    top: 50%;
    min-width: 280px;
    max-width: calc(100vw - 32px);
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 20px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: #2c3e50;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #00acc1;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const InfoText = styled.div`
  font-size: 12px;
  color: #6c757d;
  margin-top: 8px;
  margin-bottom: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;

  ${props => props.$variant === 'primary' ? `
    background: linear-gradient(135deg, #26c6da, #00acc1);
    color: white;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 172, 193, 0.3);
    }
  ` : `
    background: #f8f9fa;
    color: #495057;
    
    &:hover:not(:disabled) {
      background: #e9ecef;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const ModeIndicator = styled.div`
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #26c6da, #00acc1);
  color: white;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  pointer-events: none;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 8px 16px;
  }
`;

interface BugReportToolProps {
  // No props needed - component is self-contained
}

const BugReportTool: React.FC<BugReportToolProps> = () => {
  const { user } = useAuth();
  const [feedbackMode, setFeedbackMode] = useState(false);
  const [modalData, setModalData] = useState<{
    x: number;
    y: number;
    xPercent: number;
    yPercent: number;
    element?: HTMLElement;
  } | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Toggle feedback mode
  const toggleFeedbackMode = useCallback(() => {
    setFeedbackMode(prev => !prev);
    setModalData(null);
    setComment('');
  }, []);

  // Handle click on any element in feedback mode
  const handleElementClick = useCallback((e: MouseEvent) => {
    // Check if click is on the floating button itself
    const target = e.target as HTMLElement;
    if (target.closest('button[title*="режим"]')) {
      // This is a click on toggle button, don't intercept
      return;
    }

    // Prevent default action and stop propagation
    e.preventDefault();
    e.stopPropagation();

    // Get click coordinates
    const x = e.clientX;
    const y = e.clientY;
    const xPercent = (x / window.innerWidth) * 100;
    const yPercent = (y / window.innerHeight) * 100;

    // Store element reference for metadata
    const element = e.target as HTMLElement;

    // Open modal at click position
    setModalData({ x, y, xPercent, yPercent, element });
  }, []);

  // Set up global click interceptor when feedback mode is active
  useEffect(() => {
    if (feedbackMode && !modalData) {
      // Add event listener in capture phase to intercept all clicks
      document.addEventListener('click', handleElementClick, true);

      return () => {
        document.removeEventListener('click', handleElementClick, true);
      };
    }
  }, [feedbackMode, modalData, handleElementClick]);

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setModalData(null);
    setComment('');
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!modalData || !user) return;
    if (!comment.trim()) {
      toast.error('Будь ласка, введіть коментар');
      return;
    }

    setSubmitting(true);

    try {
      // Extract element metadata
      const elementInfo = modalData.element ? {
        tagName: modalData.element.tagName,
        className: modalData.element.className,
        id: modalData.element.id,
        innerText: modalData.element.innerText?.substring(0, 100) || ''
      } : undefined;

      console.log('📝 Submitting bug report:', {
        url: window.location.href,
        xPos: modalData.xPercent,
        yPos: modalData.yPercent,
        userId: user.id,
        userEmail: user.email
      });

      // Submit bug report
      const bugId = await bugReportService.create({
        url: window.location.href,
        xPos: modalData.xPercent,
        yPos: modalData.yPercent,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        comment: comment.trim(),
        userId: user.id,
        userEmail: user.email,
        userName: `${user.name} ${user.lastName || ''}`.trim(),
        userAgent: navigator.userAgent,
        elementInfo
      });

      console.log('✅ Bug report created with ID:', bugId);
      toast.success('Звіт про баг відправлено!');
      
      // Close modal and exit feedback mode
      handleCloseModal();
      setFeedbackMode(false);
    } catch (error) {
      console.error('❌ Error submitting bug report:', error);
      
      // Детальна діагностика помилки
      const errorDetails = {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code,
        name: error instanceof Error ? error.name : undefined,
        stack: error instanceof Error ? error.stack : undefined,
        fullError: error
      };
      
      console.error('Error details:', errorDetails);
      
      // Специфічна обробка для помилок Firestore
      let errorMessage = 'Невідома помилка';
      if (error instanceof Error) {
        if (error.message.includes('INTERNAL ASSERTION')) {
          errorMessage = 'Помилка синхронізації з сервером. Спробуйте закрити інші вкладки сайту і повторити.';
        } else if (error.message.includes('Missing or insufficient permissions')) {
          errorMessage = 'Недостатньо прав доступу. Зверніться до адміністратора.';
        } else if (error.message.includes('offline')) {
          errorMessage = 'Немає з\'єднання з інтернетом. Перевірте підключення.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(`Помилка відправки звіту: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  }, [modalData, comment, user, handleCloseModal]);

  // Don't render if user is not logged in (safety check)
  if (!user) return null;

  return (
    <>
      {/* Floating Trigger Button */}
      <FloatingButton
        $active={feedbackMode}
        onClick={toggleFeedbackMode}
        title={feedbackMode ? 'Вимкнути режим звітування' : 'Повідомити про баг'}
      >
        {feedbackMode ? <FiX /> : <FiAlertCircle />}
      </FloatingButton>

      {/* Feedback Mode Indicator */}
      {feedbackMode && !modalData && (
        <ModeIndicator>
          <FiAlertCircle />
          Натисніть на елемент для звіту про баг
        </ModeIndicator>
      )}

      {/* Feedback Overlay */}
      {feedbackMode && !modalData && <FeedbackOverlay />}

      {/* Bug Report Modal */}
      {modalData && (
        <>
          <FeedbackOverlay onClick={handleCloseModal} />
          <Modal $x={modalData.x} $y={modalData.y}>
            <ModalHeader>
              <ModalTitle>
                <FiAlertCircle />
                Звіт про баг
              </ModalTitle>
              <CloseButton onClick={handleCloseModal}>
                <FiX />
              </CloseButton>
            </ModalHeader>

            <TextArea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Опишіть проблему або баг..."
              autoFocus
            />

            <InfoText>
              Позиція: {modalData.xPercent.toFixed(1)}%, {modalData.yPercent.toFixed(1)}%
              {modalData.element && ` • ${modalData.element.tagName.toLowerCase()}`}
            </InfoText>

            <ButtonGroup>
              <Button $variant="secondary" onClick={handleCloseModal} disabled={submitting}>
                Скасувати
              </Button>
              <Button $variant="primary" onClick={handleSubmit} disabled={submitting}>
                <FiSend />
                {submitting ? 'Відправка...' : 'Відправити'}
              </Button>
            </ButtonGroup>
          </Modal>
        </>
      )}
    </>
  );
};

export default BugReportTool;
