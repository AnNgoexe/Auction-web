import {BrowserRouter} from "react-router";
import {UserProvider} from "@/contexts/UserContext.jsx";
import {NotificationProvider} from "@/contexts/NotificationContext.jsx";
import {Route, Routes} from "react-router-dom";
import HomeScreen from "@/screens/Home.jsx";
import AuthRouter from "@/routers/AuthRouter.jsx";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <NotificationProvider>
          <Toaster />
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/auth/*" element={<AuthRouter />}/>
          </Routes>
        </NotificationProvider>
      </UserProvider>
    </BrowserRouter>
  )
}

export default App
