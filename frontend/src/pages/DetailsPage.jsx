import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {logOutUser} from "@/redux/slice/userSlice.js";
import {useEffect} from "react";

export function DetailsPage() {
    const user = useSelector(state => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const API_URL = import.meta.env.VITE_BACKENDURL;
    useEffect(()=>{
        if (user.email==='' || Object.keys(user).length===0){
            navigate('/login');
        }
    },[user,navigate]);


function handleSignOut(){
    axios.post(API_URL+'/api/users/logout', {} ,{ withCredentials: true })
        .then(res=>{
            dispatch(logOutUser());
            // navigate('/login');
        })
}
    return (
        <>

            <div className={'grid place-items-center pt-14'}>
            <div
                className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className={'max-h-full'}>
                    <img className="rounded-t-lg h-96" src={user.profilePicture} alt=""/>
                </div>
                <div className="p-5">
                    <a href="#">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{user.name}</h5>
                    </a>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Email: {user.email}</p>
                    <div className={'grid grid-cols-2 gap-x-4'}>
                        <button
                            className="inline-flex items-center px-3 py-2 text-sm gap-x-5 font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={()=>{
                                navigate('/home/edit');
                            }}
                        >
                            Edit
                            <img src={API_URL+'/api/static/edit.svg'} alt={'edit'}/>
                        </button>

                        <button type="button"
                                className="inline-flex items-center px-3 py-2 gap-x-5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={handleSignOut}>Log
                            Out
                            <img src={API_URL+'/api/static/logOut.svg'} alt={'Log out'}/>
                        </button>
                    </div>
                </div>
            </div>
            </div>
        </>
    )
}