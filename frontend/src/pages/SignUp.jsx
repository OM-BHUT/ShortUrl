import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {GoogleButton} from "@/components/GoogleButton.jsx";
import {useDispatch} from "react-redux";
import {addUser} from "@/redux/slice/userSlice.js";
import {LoadingBar} from "@/pages/LoadingBar.jsx";

export function SignUp() {
    const navigate = useNavigate();
    const [data,setData] = useState({
        email:'',
        password:'',
        name:''
    });
    const [error,setError] = useState('');
    const [checkEmail,setCheckEmail] = useState(false);
    const [userName,setUserName] = useState(false);
    const [passCheck,setPassCheck] = useState(false);
    const [confirmPass,setConfirmPass] = useState('');
    const isDisabled = ! (checkEmail && passCheck && confirmPass==data.password && userName);
    const dispatch = useDispatch();
    const [isLoading,setIsLoading] = useState(false);

    function handleSubmit(e){
        e.preventDefault();
        setIsLoading(true);
        axios.post('/api/users',data)
            .then(res=>{

                dispatch(addUser(res.data))
                navigate('/verifyOtp');
            })
            .catch((error)=>{
                if (error.response && error.response.data){
                    setError(error.response.data.message || 'An Error occurred');
                }else{
                    setError('Network error please try again later');
                }
            })
            .finally(()=>{
                setIsLoading(false);
            })
    }



    return (
        <>
            <section className="bg-gray-50 dark:bg-gray-900 overflow-hidden">
                <div className="flex flex-col items-center justify-center px-6 py-1 mx-auto h-screen lg:py-0">
                    <div
                        className="w-full bg-white rounded-lg shadow dark:border md:mt-0 max-w-screen-lg xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <LoadingBar isLoading={isLoading}/>
                        <div className="p-3 space-y-4  sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Create an account
                            </h1>
                            <form className="space-y-4 md:space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email"
                                           className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Your
                                        userName</label>
                                    <input type="text"
                                           className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                           placeholder="username" required="" onChange={(e) => {
                                        setData({...data, name: e.target.value})
                                        const {value} = e.target;
                                        const pattern = /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/;
                                        const regex = new RegExp(pattern)
                                        setUserName(regex.test(value));
                                    }}/>
                                    {!userName && <p className={'text-red-500 text-xs ms-3 mt-2'}>letters (uppercase and lowercase), digits, underscores, and hyphens, must be 3 to 20 characters long,start with letter</p>}
                                </div>
                                <div>
                                    <label htmlFor="email"
                                           className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Your
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
                                    {!checkEmail && <p className={'text-red-500 ms-3 mt-2'}>Invalid Email</p>}
                                </div>
                                <div>
                                    <label htmlFor="password"
                                           className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Password</label>
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
                                        <p className={'text-red-500 text-sm ms-3 mt-2'}>password should have Minimum 8
                                            characters;at least one uppercase letter, one lowercase letter,one numeric
                                            digit, and one special character</p>}
                                </div>
                                <div>
                                    <label htmlFor="confirm-password"
                                           className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Confirm
                                        password</label>
                                    <input type="confirm-password" name="confirm-password" id="confirm-password"
                                           placeholder="••••••••"
                                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                           required="" onChange={(e) => {
                                        setConfirmPass(e.target.value);
                                    }}/>
                                    {confirmPass !== data.password &&
                                        <p className={'text-red-500'}>Not Same As Original Pass</p>}
                                </div>
                                <button
                                        className={`w-full ${isDisabled||isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'} text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-1.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}
                                        disabled={isDisabled || isLoading}
                                        type={"submit"}
                                >Sign
                                    up
                                </button>
                                {isDisabled && <p className={'text-red-500'}>Enter correct password or email</p>}
                                {error && <div className="text-red-500">{error}</div>}
                                <GoogleButton/>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Already have an account? <Link to="/login"
                                                                   className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login
                                    here</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}