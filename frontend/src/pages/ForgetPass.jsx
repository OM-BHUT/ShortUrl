import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {useDispatch} from "react-redux";
import {addUser} from "@/redux/slice/userSlice.js";
import {LoadingBar} from "@/pages/LoadingBar.jsx";

export function ForgetPass() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [checkEmail, setCheckEmail] = useState(false);
    const [passCheck, setPassCheck] = useState(false);
    const [confirmPass, setConfirmPass] = useState('');
    const isDisabled = !(checkEmail && passCheck && confirmPass === data.password);
    const dispatch = useDispatch();
    const [isLoading,setIsLoading] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        axios.patch('/api/users/forgetPass',data)
            .then(res=>{
                if (res.status===200) {
                    dispatch(addUser({email:data.email}));
                    navigate('/verifyOtp');
                }
            })
            .catch(err=>{
                if (err.response.data){
                    setError(err.response.data.message);
                }
            })
            .finally(()=>{
                setIsLoading(false);
            })
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <LoadingBar isLoading={isLoading}/>
                <a className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <img className="w-16 h-12" src={"/api/static/url-shortener-logo.png"} alt="logo" />
                    Url Shortener
                </a>
                <div className="w-full p-6 bg-white rounded-lg shadow dark:border sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
                    <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Change Password
                    </h2>
                    {/*<p className={'text-white'}>{JSON.stringify(data)}</p>*/}
                    <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Your email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="name@company.com"
                                required
                                onChange={(e) => {
                                    setData({ ...data, email: e.target.value });
                                    const { value } = e.target;
                                    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                                    const regex = new RegExp(pattern);
                                    setCheckEmail(regex.test(value));
                                }}
                            />
                            {!checkEmail && <p className="text-red-500 ms-3 mt-2">Invalid Email</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                New Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="••••••••"
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                required
                                onChange={(e) => {
                                    setData({ ...data, password: e.target.value });
                                    const { value } = e.target;
                                    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>\/?~-]).{8,}$/;
                                    const regex = new RegExp(pattern);
                                    setPassCheck(regex.test(value));
                                }}
                            />
                            {!passCheck && (
                                <p className="text-red-500 text-sm ms-3 mt-2">
                                    Password should have at least 8 characters, one uppercase letter, one lowercase letter,
                                    one numeric digit, and one special character
                                </p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirm-password"
                                id="confirm-password"
                                placeholder="••••••••"
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                required
                                onChange={(e) => {
                                    setConfirmPass(e.target.value);
                                }}
                            />
                            {confirmPass !== data.password && <p className="text-red-500">Passwords do not match</p>}
                        </div>
                        <button
                            type="submit"
                            className={`w-full ${
                                isDisabled || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'
                            } text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                            disabled={isDisabled || isLoading}
                        >
                            Reset Password
                        </button>
                        {isDisabled && <p className="text-red-500">Enter a valid email and password</p>}
                        {error && <div className="text-red-500">{error}</div>}
                    </form>
                </div>
            </div>
        </section>
    );
}
