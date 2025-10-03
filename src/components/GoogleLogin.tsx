import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const LoginButton = styled.button`
  background: white;
  color: #00acc1;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #f8f9fa;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const GoogleIcon = styled.div`
  width: 20px;
  height: 20px;
  background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIyLjU2IDEyLjI1QzIyLjU2IDExLjQ3IDIyLjQ5IDEwLjcyIDIyLjM2IDEwSDEyVjE0LjI1SDE3Ljk2QzE3LjY2IDE1LjYzIDE2Ljk4IDE2Ljc5IDE1Ljg0IDE3LjU3VjIwLjE0SDE5LjUyQzIxLjQ0IDE4LjM0IDIyLjU2IDE1LjU0IDIyLjU2IDEyLjI1WiIgZmlsbD0iIzQyODVGNCIvPgo8cGF0aCBkPSJNMTIgMjNDMTQuOTcgMjMgMTcuNDYgMjIuMTIgMTkuNTIgMjAuMTRMMTUuODQgMTcuNTdDMTQuODMgMTguMjQgMTMuNDcgMTguNjcgMTIgMTguNjdDMTUuMTMgMTguNjcgMTcuODggMTYuNzIgMTguNzYgMTQuMkgxMlYxMC43NUgxOC43NkMxOC45IDEwLjE3IDE5IDE5LjU4IDE5IDlDMTkgNy4xNCAxOC42OSA1LjM0IDE4LjA3IDMuNzVIMTJWN0gxOC4wN0MxNy4zOCA1LjE5IDE2LjI0IDMuNzcgMTQuNzYgMi43NUgxMlYtMUgxMkM5LjM5IC0xIDcuMDcgMC4yNCA1LjI2IDEuNzVMMi4xIDQuODlDMC4zOSA2LjY5IC0xIDkuMDEgLTEgMTJDLTEgMTQuOTkgMC4zOSAxNy4zMSAyLjEgMTkuMTFMNS4yNiAyMi4yNUM3LjA3IDIzLjc2IDkuMzkgMjUgMTIgMjVaIiBmaWxsPSIjRUE0MzM1Ii8+CjxwYXRoIGQ9Ik0xMiAyM0MxNC45NyAyMyAxNy40NiAyMi4xMiAxOS41MiAyMC4xNEwxNS44NCAxNy41N0MxNC44MyAxOC4yNCAxMy40NyAxOC42NyAxMiAxOC42N0M5LjEzIDE4LjY3IDYuMzggMTYuNzIgNS4yNCAxNC4ySDEyVjEwLjc1SDUuMjRDNC45IDEwLjE3IDQuNzUgOS41OCA0Ljc1IDlDNC43NSA3LjE0IDUuMDYgNS4zNCA1LjY4IDMuNzVIMTJWN0g1LjkzQzUuMjQgNS4xOSA0LjEgMy43NyAyLjYyIDIuNzVIMTJWLTEgMTJDOS4zOSAtMSA3LjA3IDAuMjQgNS4yNiAxLjc1TDIuMSA0Ljg5QzAuMzkgNi42OSAtMSA5LjAxIC0xIDEyQy0xIDE0Ljk5IDAuMzkgMTcuMzEgMi4xIDE5LjExTDUuMjYgMjIuMjVDNy4wNyAyMy43NiA5LjM5IDI1IDEyIDI1WiIgZmlsbD0iI0ZCQkMwNSIvPgo8cGF0aCBkPSJNMTIgMjNDMTQuOTcgMjMgMTcuNDYgMjIuMTIgMTkuNTIgMjAuMTRMMTUuODQgMTcuNTdDMTQuODMgMTguMjQgMTMuNDcgMTguNjcgMTIgMTguNjdDMTUuMTMgMTguNjcgMTcuODggMTYuNzIgMTguNzYgMTQuMkgxMlYxMC43NUgxOC43NkMxOC45IDEwLjE3IDE5IDE5LjU4IDE5IDlDMTkgNy4xNCAxOC42OSA1LjM0IDE4LjA3IDMuNzVIMTJWN0gxOC4wN0MxNy4zOCA1LjE5IDE2LjI0IDMuNzcgMTQuNzYgMi43NUgxMlYtMUgxMkM5LjM5IC0xIDcuMDcgMC4yNCA1LjI2IDEuNzVMMi4xIDQuODlDMC4zOSA2LjY5IC0xIDkuMDEgLTEgMTJDLTEgMTQuOTkgMC4zOSAxNy4zMSAyLjEgMTkuMTFMNS4yNiAyMi4yNUM3LjA3IDIzLjc2IDkuMzkgMjUgMTIgMjVaIiBmaWxsPSIjMzRBNTUzIi8+Cjwvc3ZnPgo=') no-repeat center;
  background-size: contain;
`;

const GoogleLogin: React.FC = () => {
  const { login, loading } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await login();
      toast.success('Ласкаво просимо до DreamShop!');
    } catch (error) {
      toast.error('Помилка входу через Google');
    }
  };

  return (
    <LoginButton onClick={handleGoogleLogin} disabled={loading}>
      <GoogleIcon />
      {loading ? 'Вхід...' : 'Увійти через Google'}
    </LoginButton>
  );
};

export default GoogleLogin;
