import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ROUTES } from './consts/router.tsx'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				{ROUTES.map(({ path, element }) => (
					<Route
						key={path}
						path={path}
						element={element}
					/>
				))}
			</Routes>
			<App />
			<ToastContainer
				position='top-right'
				closeOnClick
				theme='dark'
				autoClose={3000}
				pauseOnFocusLoss={false}
			/>
		</BrowserRouter>
	</StrictMode>
)
