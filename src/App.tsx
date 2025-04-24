import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <div>
        <h1>Welcome to Chain Stats</h1>
      </div>
    </ThemeProvider>
  );
}

export default App;
