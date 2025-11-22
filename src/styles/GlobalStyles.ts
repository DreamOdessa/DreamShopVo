import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    /* Admin Panel Colors - Light Mode */
    --admin-primary: #00acc1;
    --admin-primary-dark: #00838f;
    --admin-secondary: #26c6da;
    --admin-blue: #00acc1;
    --admin-yellow: #ffc107;
    --admin-orange: #ff9800;
    --admin-red: #dc3545;
    --admin-green: #4caf50;
    --admin-dark: #2c3e50;
    --admin-light: #ffffff;
    --admin-grey: #f8f9fa;
    --admin-dark-grey: #6c757d;
    --admin-border: #e9ecef;
    
    /* Admin Panel Light Colors */
    --admin-light-blue: #e0f7fa;
    --admin-light-yellow: #fff9c4;
    --admin-light-orange: #ffe0b2;
    --admin-light-green: #c8e6c9;
    
    /* Admin Panel Background */
    --admin-sidebar-bg: #ffffff;
    --admin-content-bg: #f8f9fa;
  }

  body.admin-dark-mode {
    /* Admin Panel Colors - Dark Mode */
    --admin-light: #0c0c1e;
    --admin-grey: #1a1a2e;
    --admin-dark: #fbfbfb;
    --admin-sidebar-bg: #1a1a2e;
    --admin-content-bg: #0c0c1e;
    --admin-border: #2a2a3e;
    
    /* Admin Panel Light Colors - Dark Mode */
    --admin-light-blue: rgba(0, 172, 193, 0.1);
    --admin-light-yellow: rgba(255, 193, 7, 0.1);
    --admin-light-orange: rgba(255, 152, 0, 0.1);
    --admin-light-green: rgba(76, 175, 80, 0.1);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    overflow-x: hidden;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: linear-gradient(135deg, #e0f7fa 0%, #f0fdfa 100%);
    color: #2c3e50;
    line-height: 1.6;
    overflow-x: hidden;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  body.admin-dark-mode {
    background: var(--admin-content-bg);
    color: var(--admin-dark);
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
  }

  input, textarea, select {
    font-family: inherit;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  .container {
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    padding: 0 clamp(1rem, 2.5vw, 2rem);
  }
`;

