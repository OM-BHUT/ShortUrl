import {useState} from "react";
import axios from "axios";
import {useDispatch} from "react-redux";
import {addUrl} from "@/redux/slice/changesSlice.js";
import Swal from "sweetalert2";


export function EnterUrl(props) {

    const [data,setData] = useState({
        shortUrl:''
    });

    const [urlCheck,setUrlCheck] = useState(false);
    const isDisabled = !urlCheck;
    const dispatch = useDispatch();
    function handleEnter(e){
        e.preventDefault();
        axios.post(import.meta.env.VITE_BACKENDURL + '/api/shortUrl', data, { withCredentials: true })
            .then(res => {
                dispatch(addUrl(res.data));
                Swal.fire({
                    position: 'bottom-right', // Aligns the alert to the top-left of the screen
                    icon: 'success',
                    title: 'Added New Url',
                    text: res.data.redirectUrl,
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
                setData({ shortUrl: '' });
            })
            .catch(error => console.error("Error posting URL:", error));

    }


    return (
        <>
            <div className={'my-16'}>
            <form className={'flex justify-center items-center gap-9'} onSubmit={handleEnter}>
                {/*<p className={'text-white'}>{JSON.stringify(data)}</p>*/}
                <div className={'flex flex-col w-full max-w-screen-lg gap-y-3'}>

                <input type="text"
                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
                       focus:border-blue-500 block w-full max-w-screen-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       placeholder="Enter Your ShortUrl" onChange={(e)=>{
                           const pattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9\-]+\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?(\/\S*)?$/;
                    const value = e.target.value;
                           const regex = new RegExp(pattern);
                           setUrlCheck(regex.test(value));
                           setData({
                               shortUrl: value.toString()
                           });
                }}/>
                </div>
                <button
                    type="submit"
                    className={`text-white bg-gradient-to-r from-gray-800 via-gray-700 to-gray-500 
                hover:bg-gradient-to-br focus:ring-4 focus:outline-none 
                focus:ring-gray-800 dark:focus:ring-blue-800 shadow-lg 
                shadow-zinc-500/50 dark:shadow-lg dark:shadow-zinc-800/80 
                font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 h-full 
                ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
                    disabled={isDisabled}
                >
                    Enter
                </button>

            </form>
            {isDisabled && <p className={'text-red-500 ms-52 mt-3'}>Enter Valid Url</p>}
            </div>
        </>
    )
}