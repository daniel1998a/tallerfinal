import {BrowserRouter,Routes,Route} from 'react-router-dom';
import MascotasComponent from './Components/MascotasComponent.js';
import './App.css';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<MascotasComponent></MascotasComponent>}></Route>
    </Routes>
    </BrowserRouter>
   
  );
}

export default App;
