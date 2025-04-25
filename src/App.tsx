import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { theme } from './styles/theme';
import { Header } from './components/Header';
import { GlobalStyles } from './styles/GlobalStyles';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <main>
          <Header />
          <h1>Transaction analytics</h1>
        <AnalyticsDashboard />
        </main>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
