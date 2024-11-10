import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {GoogleButton} from "@/components/GoogleButton.jsx";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {addUser} from "@/redux/slice/userSlice.js";
import {LoadingBar} from "@/pages/LoadingBar.jsx";

export function Login() {
    const [data,setData] = useState({
        email:'',
        password:''
    });
    const [checkEmail,setCheckEmail] = useState(false);
    const [passCheck,setPassCheck] = useState(false);
    const [error,setError] = useState('');
    const isDisabled = ! (checkEmail && passCheck);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading,setIsLoading] = useState(false);
    const API_URL = import.meta.env.VITE_BACKENDURL;

    useEffect(()=>{
        const fetchUser = async ()=>{
            try {
                const userDetails = await axios.get(`${API_URL}/api/users/giveTokenInfo`, { withCredentials: true });
                const type = userDetails.data.userType === 'google' ? '/google' : '';
                const response = await axios.get(`${API_URL}/api/users/isVerified`+type, { withCredentials: true });
                if (response.status===200){
                    const host = (await axios.get(`${API_URL}/api/users/hostAddress`, { withCredentials: true })).data;
                    dispatch(addUser({...response.data,host}));
                    navigate('/home');
                }
            }catch (e) {
                console.log('error ',e);
            }
        }
        fetchUser();
    },[]);


    async function handleLogin(e) {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post(`${API_URL}/api/users/login`, data, { withCredentials: true });
            if (res.status === 200) {
                const host = (await axios.get(`${API_URL}/api/users/hostAddress`, { withCredentials: true })).data;
                dispatch(addUser({...res.data,host}));
                // You can navigate here if needed
                navigate('/home');
            }
        } catch (err) {
            console.log(err);
            if (err.response) {
                const message = err.response.data.message;
                setError(message);
            } else {
                setError('Login Failed ' + err);
            }
        }
        finally {
            setIsLoading(false);
        }
    }


    return (
        <>
            <section className="bg-gray-50  dark:bg-gray-900 overflow-hidden">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
                    <LoadingBar isLoading={isLoading}/>
                    <div className="flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
                        <img className="w-24 h-auto mr-2 font-normal"
                             src={`${API_URL}/api/static/url-shortener-logo.png`} alt="logo"/>
                        Url Shortener
                    </div>
                    <div
                        className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-2 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Sign in to your account
                            </h1>
                            <form className="space-y-4" onSubmit={handleLogin}>
                                <div>
                                    <label htmlFor="email"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                                        email</label>
                                    <input type="email" name="email" id="email"
                                           className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                           placeholder="name@company.com" required="" onChange={(e) => {
                                        setData({...data, email: e.target.value})
                                        const {value} = e.target;
                                        const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                                        const regex = new RegExp(pattern)
                                        setCheckEmail(regex.test(value));
                                    }}/>
                                    {!checkEmail && <p className={'text-red-500 ms-3 mt-4'}>Invalid Email</p>}
                                </div>
                                <div>
                                    <label htmlFor="password"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input type="password" name="password" id="password" placeholder="••••••••"
                                           className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                           required="" onChange={(e) => {
                                        setData({...data, password: e.target.value})
                                        const {value} = e.target;
                                        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>\/?~-]).{8,}$/;
                                        const regex = new RegExp(pattern)
                                        setPassCheck(regex.test(value));
                                    }}/>
                                    {!passCheck &&
                                        <p className={'text-red-500 text-sm ms-3 mt-4'}>password should have Minimum 8
                                            characters;at least one uppercase letter, one lowercase letter,one numeric
                                            digit, and one special character</p>}
                                </div>
                                <div className="flex items-center justify-between">
                                    <Link to="/forget"
                                       className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot
                                        password?</Link>
                                </div>
                                <button type="submit"
                                        className={`w-full ${isDisabled||isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'} text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}
                                        disabled={isDisabled || isLoading}>Sign
                                    in
                                </button>
                                {isDisabled && <p className={'text-red-500'}>Enter correct password or email</p>}
                                {error && <p className={'text-red-500'}>Error: {error}</p>}
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Don’t have an account yet? <Link to="/signUp"
                                                                     className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign
                                    up</Link>
                                </p>
                                <GoogleButton />
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}