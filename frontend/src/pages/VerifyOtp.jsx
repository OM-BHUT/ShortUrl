import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {useSelector} from "react-redux";
import {LoadingBar} from "@/pages/LoadingBar.jsx";

export function VerifyOtp() {
    const [data, setData] = useState({ code: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [boxes, setBoxes] = useState(Array(4).fill(''));
    const isDisabled = !boxes.every(Boolean);
    const [disableResendButton, setDisableResendButton] = useState(false);
    const [showCountDown, setShowCountDown] = useState(false);
    const [countDownValue, setCountDownValue] = useState(60);
    const [timerId, setTimerId] = useState(null);
    const user = useSelector(state => state.user);
    const [isLoading,setIsLoading] = useState(false);
    const API_URL = import.meta.env.VITE_BACKENDURL;

    useEffect(()=>{
        if (user.email==='' || Object.keys(user).length===0){
            navigate('/login');
        }
    },[user]);

    useEffect(() => {
        if (countDownValue <= 0) {
            clearInterval(timerId);
            setDisableResendButton(false);
            setShowCountDown(false);
            setCountDownValue(60);
            return;
        }
        const timer = setInterval(() => {
            setCountDownValue(prevValue => prevValue - 1);
        }, 1000);

        setTimerId(timer);

        return () => clearInterval(timer);
    }, [countDownValue]);

    function handleVerify(e) {
        e.preventDefault();
        setIsLoading(true);
        axios.post(API_URL+'/api/users/verify', data)
            .then(res => {
                navigate('/login');
            })
            .catch((error) => {
                setError('Verification failed. Please try again later');
            })
            .finally(()=>{
                setIsLoading(false);
            });
    }

    function handleResendOtp() {
        setIsLoading(true);
        if (!disableResendButton) {
            setShowCountDown(true);
            setDisableResendButton(true);
            setCountDownValue(60);


            axios.get(API_URL+'/api/users/resendOtp')
                .then(res => {
                    Swal.fire({
                        position: 'bottom-right',
                        icon: 'success',
                        title: 'Otp Sent successfully',
                        background: '#ffffff',
                        showConfirmButton: false,
                        timer: 2000,
                        toast: true,
                        customClass: {
                            popup: 'swal2-right-toast',
                            title: 'swal-title',
                            content: 'swal-content',
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                    // Handle error appropriately
                    if (err.response && err.response.data) {
                        const errorMessage = err.response.data.error || err.response.data.message;
                        setError(errorMessage || 'An Error occurred');
                        if (errorMessage === 'user Not Found please signUp again') {
                            navigate('/signUp');
                        }
                    } else {
                        setError('Network error please try again later');
                    }
                })
                .finally(()=>{
                    setIsLoading(false);
                })
        }
    }

    return (
        <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-900 dark:bg-gray-900 py-12">
            <div className="relative bg-gray-800 px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
                <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
                    <LoadingBar isLoading={isLoading}/>
                    <div className="flex flex-col items-center justify-center text-center space-y-2">
                        <div className="font-semibold text-3xl text-white">
                            <p>Email Verification</p>
                        </div>
                        <div className="flex flex-row text-sm font-medium text-gray-400">
                            <p>We have sent a code to your email</p>
                        </div>
                    </div>

                    <div>
                        <form className="flex flex-col space-y-16" onSubmit={handleVerify}>
                            <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                                {boxes.map((value, index) => (
                                    <div className="w-16 h-16" key={index}>
                                        <input
                                            className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-blue-500 text-lg bg-gray-700 focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 text-white"
                                            type="text"
                                            maxLength={1}
                                            value={value}
                                            onChange={(e) => {
                                                const pattern = /^[0-9]$/;
                                                const inputValue = e.target.value;
                                                if (pattern.test(inputValue) || inputValue === '') {
                                                    const newBoxes = [...boxes];
                                                    newBoxes[index] = inputValue;
                                                    setBoxes(newBoxes);

                                                    const newCode = newBoxes.join('');
                                                    setData({ ...data, code: newCode });
                                                }
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                            {isDisabled && <p className={'text-red-500'}>All Values Should Be Digits</p>}
                            {error && <div className="text-red-500">{error}</div>}

                            <div className="flex flex-col space-y-5">
                                <div>
                                    <button
                                        className={`flex ${isDisabled || isLoading? 'bg-red-700 cursor-not-allowed' : 'bg-blue-600'} flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 border-none text-white text-sm shadow-sm`}
                                        disabled={isDisabled || isLoading}
                                        type="submit"
                                    >
                                        Verify Account
                                    </button>
                                </div>

                                <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-400">
                                    <p>Didn't receive code?</p>
                                    <button
                                        className={`flex ${disableResendButton || isLoading? 'cursor-not-allowed text-gray-500' : 'text-blue-400 cursor-pointer'} flex-row items-center`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleResendOtp();
                                        }}
                                        disabled={disableResendButton || isLoading}
                                    >
                                        Resend
                                    </button>
                                </div>
                                {showCountDown && <p className={'text-red-600'}>Resend in 00:{countDownValue < 10 ? '0' : ''}{countDownValue}</p>}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
