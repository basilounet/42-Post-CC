import  { createRoot } from 'react-dom/client'
import  './index.css'
import  App from './components/App/App.jsx'
import  { BrowserRouter } from "react-router-dom";
import  {SocketProvider} from "./hooks/socket/useSocket.jsx";

createRoot(document.getElementById('root')).render(
	<SocketProvider>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</SocketProvider>
)
