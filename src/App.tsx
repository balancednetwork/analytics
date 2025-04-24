import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { Header } from './components/Header';
function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <main>
        <Header />
        <h1>Chain statistics</h1>
        <AnalyticsDashboard 
          siteId={import.meta.env.VITE_PLAUSIBLE_SITE_ID}
          apiKey={import.meta.env.VITE_PLAUSIBLE_API_KEY}
        />
      </main>
    </ThemeProvider>
  );
}

export default App;
