import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {changeName, setProfilePicture} from "@/redux/slice/userSlice.js";
import Swal from "sweetalert2";

export function EditPage() {
    const user = useSelector((state) => state.user);
    const [file,setFile] = useState(null);
    const [uploadedFileUrl, setUploadedFileUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [inputChange,setInputChange] = useState(false);
    const [name,setName] = useState(user.name || '');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [nameCheck,setNameCheck] = useState(false);
    const isDisabled = !nameCheck;

    useEffect(()=>{
        if (user.email==='' || Object.keys(user).length===0){
            navigate('/login');
        }
    },[user]);

    function handleFileChange(e){
        e.preventDefault();
        setInputChange(true);
        setFile(e.target.files[0]);
    }

    async function handleFileUpload(e){
        e.preventDefault(); // Prevent default form submission
        if (!file) {
            Swal.fire({
                position: 'top-right', // Aligns the alert to the top-left of the screen
                icon: 'error',
                title: 'Please Enter File',
                background: '#ffffff', // Sets a white background for the alert
                showConfirmButton: false,
                timer: 2000, // Alert disappears after 2 seconds
                toast: true, // Makes the alert behave like a toast notification
                customClass: {
                    popup: 'swal2-right-toast', // Custom class for the popup
                    title: 'swal-title', // Custom class for the title
                    content: 'swal-content', // Custom class for the content
                }
            });
            return;
        }

        const formData = new FormData();
        formData.append('profilePicture', file);

        setIsLoading(true); // Set loading state to true
        try {
            const response = await axios.post('/api/users/profilePicture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            dispatch(setProfilePicture(response.data.url));
            setFile(null); // Clear the file input after upload
        } catch (error) {
            console.error("Error uploading file:", error);
            Swal.fire({
                position: 'top-right', // Aligns the alert to the top-left of the screen
                icon: 'error',
                title: 'Error occurred',
                background: '#ffffff', // Sets a white background for the alert
                showConfirmButton: false,
                timer: 2000, // Alert disappears after 2 seconds
                toast: true, // Makes the alert behave like a toast notification
                customClass: {
                    popup: 'swal2-right-toast', // Custom class for the popup
                    title: 'swal-title', // Custom class for the title
                    content: 'swal-content', // Custom class for the content
                }
            });
        } finally {
            setIsLoading(false); // Set loading state back to false
        }
    }

    async function handleDeleteProfilePicture(e){
        try {
            const response = await axios.delete('/api/users/setToDefaultPicture');
            dispatch(setProfilePicture(response.data.defaultUrl));
        }catch (e) {
            console.log('err ',e);
        }
    }

    async function handleSubmit(e){
        e.preventDefault();
        try {
            const response = await axios.patch('/api/users/changeName', {name});
            dispatch(changeName(name));
            navigate('/home/details');
        }catch (e) {
            console.log('err ',e);
        }
    }

    function homeButtonClicked(){
        navigate('/home');
    }

    return (
        <>
            <div className="w-full flex flex-col items-center bg-zinc-800 gap-5 px-3 md:px-16 lg:px-28 overflow-hidden">
                <main className="w-full py-1 flex flex-col items-center"
                      style={{height: 'calc(100vh - 64px)'}}
                >
                    <h1 className="sm:text-4xl text-xl font-bold text-white sm:mt-4 sm:p-4 rounded-lg shadow-md text-center sm:mb-6">
                        Edit Page
                    </h1>

                    <div className="p-2 md:p-4 w-full sm:w-auto">
                        <div className="w-full px-6 pb-8 sm:max-w-xl sm:rounded-lg">
                            <div className="grid w-full mx-auto mt-8 gap-4">
                                <div
                                    className="flex flex-col items-center sm:flex-row sm:space-y-0 space-y-4 sm:space-x-6">
                                    <img
                                        className="object-cover w-32 h-32 sm:w-40 sm:h-40 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500"
                                        src={user.profilePicture || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"}
                                        alt="User avatar"
                                    />

                                    <div className="flex flex-col w-full space-y-3 sm:ml-8">
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <label
                                                className="cursor-pointer text-base font-medium text-indigo-100 bg-[#202142] rounded-lg border border-indigo-200 hover:bg-indigo-900 focus:outline-none focus:z-10 focus:ring-4 focus:ring-indigo-200 px-4 py-2.5 w-full sm:w-auto text-center"
                                            >
                                                Change Picture
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept=".jpg, .jpeg, .png"
                                                    onChange={handleFileChange}
                                                />
                                            </label>
                                            {inputChange && (
                                                <button
                                                    className={`bg-gray-800 hover:bg-gray-700 text-white text-base px-5 py-2.5 rounded cursor-pointer font-[sans-serif] w-full sm:w-auto ${isLoading ? 'cursor-not-allowed' : ''}`}
                                                    onClick={handleFileUpload}
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? 'Uploading...' : 'Upload'}
                                                </button>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            className="text-base font-medium text-indigo-900 bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100 hover:text-[#202142] focus:outline-none focus:z-10 focus:ring-4 focus:ring-indigo-200 px-4 py-2.5"
                                            onClick={handleDeleteProfilePicture}
                                        >
                                            Delete picture
                                        </button>
                                    </div>
                                </div>

                                <div className="w-full mt-6">
                                    <label htmlFor="first_name"
                                           className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                                        Your name
                                    </label>
                                    <input
                                        type="text"
                                        id="first_name"
                                        className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                                        placeholder="Your first name"
                                        value={name}
                                        onChange={(e) => {
                                            const {value} = e.target;
                                            setName(value);
                                            const pattern = /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/;
                                            setNameCheck(pattern.test(value));
                                        }}
                                    />
                                </div>

                                <div className="w-full mt-4">
                                    <label htmlFor="email"
                                           className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                                        Your email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 cursor-not-allowed"
                                        placeholder="your.email@mail.com"
                                        value={user.email}
                                        required
                                        disabled
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 w-full">
                                    <button
                                        type="button"
                                        className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 flex items-center justify-center gap-2 w-full"
                                        onClick={homeButtonClicked}
                                    >
                                        <img src={'/api/static/home.svg'} alt={'home logo'} className={'h-6 w-6'}/>
                                        Home
                                    </button>
                                    <button
                                        type="submit"
                                        className={`text-white ${isDisabled ? 'cursor-not-allowed' : ''} bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800`}
                                        onClick={handleSubmit}
                                        disabled={isDisabled}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

        </>
    );
}
