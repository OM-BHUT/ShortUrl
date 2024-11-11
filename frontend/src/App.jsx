import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {FirstPage} from "./pages/FirstPage.jsx";
import {Login} from "./pages/Login.jsx";
import {SignUp} from "./pages/SignUp.jsx";
import {VerifyOtp} from "./pages/VerifyOtp.jsx";
import {Home} from "./pages/Home.jsx";
import {ShortUrls} from "@/components/homePageComponents/ShortUrls.jsx";
import {TestingRedirect} from "@/pages/TestingRedirect.jsx";
import {DetailsPage} from "@/pages/DetailsPage.jsx";
import {Contact} from "@/pages/Contact.jsx";
import {ForgetPass} from "@/pages/ForgetPass.jsx";
import {EditPage} from "@/pages/EditPage.jsx";
import {Admin} from "@/components/homePageComponents/Admin.jsx";

function App() {
    
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path={'/'} element={<FirstPage/>}/>
                    <Route path={'login'} element={<Login />} />
                        <Route path={'forget'} element={<ForgetPass />} />
                    <Route path={'signUp'} element={<SignUp />} />
                    <Route path={'verifyOtp'} element={<VerifyOtp/>}/>
                        <Route path={'home'} element={<Home />}>
                            <Route index element={<ShortUrls />} />
                            <Route path={'details'} element={<DetailsPage />} >
                            </Route>
                            <Route path={'contact'} element={<Contact />} />
                            <Route path={'edit'} element={<EditPage />} />
                            <Route path={'admin'} element={<Admin />} />
                        </Route>
                    <Route path={'testing'} element={<TestingRedirect />} />
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
