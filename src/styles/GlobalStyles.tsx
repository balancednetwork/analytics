import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'TeX Gyre Adventor';
    src: url('/fonts/tex-gyre-adventor-regular/tex-gyre-adventor-regular.woff2') format('woff2'),
         url('/fonts/tex-gyre-adventor-regular/tex-gyre-adventor-regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'TeX Gyre Adventor';
    src: url('/fonts/tex-gyre-adventor-bold/tex-gyre-adventor-bold.woff2') format('woff2'),
         url('/fonts/tex-gyre-adventor-bold/tex-gyre-adventor-bold.woff') format('woff');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
  }

  body {
    font-family: 'TeX Gyre Adventor', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: ${theme.colors.background.primary};
    color: ${theme.colors.text.primary};
    line-height: ${theme.typography.lineHeight.normal};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  main {
    max-width: 1280px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 40px;
    padding-right: 40px;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: ${theme.typography.lineHeight.tight};
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.md};
  }

  h1 {
    margin-top: ${theme.spacing.xl};
    margin-bottom: ${theme.spacing.xl};
    font-size: ${theme.typography.fontSize.h1};

    @media (max-width: ${theme.breakpoints.tablet}) {
    margin-top: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.md};
      font-size: 30px;
    }
  }

  h2 {
    font-size: ${theme.typography.fontSize.h2};
  }

  h3 {
    font-size: ${theme.typography.fontSize.h3};
  }

  p {
    margin-bottom: ${theme.spacing.md};
    color: ${theme.colors.text.secondary};
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: color ${theme.transitions.fast};
    
    &:hover {
      color: ${theme.colors.text.primary};
    }
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    transition: all ${theme.transitions.normal};
  }
`; 