import './App.css';
import Auth from './pages/auth';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/dashboard';
import { ThemeProvider, createTheme } from "@material-ui/core";
import Store from './store';
import NovaProgressao from './pages/nova-progressao';
import VisualizarPerfil from './pages/visualizarPerfil';
import Header from './components/Header';
import RelatorioAtividades from './pages/relatorio-atividades';
import axios from 'axios';
import moment from 'moment';
import GerarRelatorio from "./pages/gerarRelatorio";


moment.locale();

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    config.headers["x-access-token"] = token;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
)

const theme = createTheme({
  palette: {
    primary: {
      main: '#086972',
    }
  },
  spacing: 8,
  typography: {
    fontFamily: "'Poppins', sans-serif'",
    allVariants: {
      fontFamily: "'Poppins', sans-serif'"
    }
  }
})

function App() {
  return (
    <Store>
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>

            <Route path="/login" component={Auth} />
            <Route path="/cadastro" component={Auth} />
            <Route path="/forgotPassword" component={Auth} />
            <Route path="/resetPassword/:userId" component={Auth} />

            <PrivateRoute path="/relatorio-de-atividades/:formularyId/relatorio">
              <GerarRelatorio />
            </PrivateRoute>

            <div>
              <Header />

              <PrivateRoute exact path="/">
                <Dashboard />
              </PrivateRoute>

              <PrivateRoute path="/nova-solicitacao">
                <NovaProgressao />
              </PrivateRoute>

              <PrivateRoute path="/minha-conta">
                <VisualizarPerfil />
              </PrivateRoute>

              <PrivateRoute path="/relatorio-de-atividades/:formularyId">
                <RelatorioAtividades />
              </PrivateRoute>
            </div>
                        
          </Switch>
        </Router>
      </ThemeProvider>
    </Store>
  );
}

export default App;
