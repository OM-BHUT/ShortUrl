import {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import {deleteUrl, fetchUrls} from "@/redux/slice/changesSlice.js";
import style from './css/hideScrollBar.module.css';
import axios from "axios";
import Swal from 'sweetalert2'

export function Urls() {
    const urls = useSelector(state => state.shortUrls);
    const host = useSelector(state => state.user.host);
    console.log(urls);
    const dispatch = useDispatch();
    const [error,setError] = useState('');
    const [message,setMessage] = useState('');
    const [expandedRow,setExpandedRow] = useState(null);

    useEffect(()=>{
        dispatch(fetchUrls());
    },[]);

    function redirectUrl(url) {
        let newUrl = url.split('://');
        if (newUrl.length < 2) {
            return url;
        }
        if (newUrl[1].length>=6){
            return newUrl[1].slice(0,12)+'...';
        }
        return newUrl[1];
    }

    function handleDelete(shortId){
        axios.delete('/api/shortUrl/'+shortId)
            .then((res)=>{
                dispatch(deleteUrl(shortId));
                dispatch(fetchUrls());
            })
            .catch((err)=>{
                if (err.response){
                    const message = err.response.data.message;
                    setError(message)
                }else{
                    setError('Login Failed '+err);
                }
            })
    }

    function copyToClipBoard(shortUrl){
        navigator.clipboard.writeText(shortUrl)
            .then(()=>{
                Swal.fire({
                    position: 'bottom-left', // Aligns the alert to the top-left of the screen
                    icon: 'success',
                    title: 'Copied',
                    text: shortUrl,
                    background: '#ffffff', // Sets a white background for the alert
                    showConfirmButton: false,
                    timer: 2000, // Alert disappears after 2 seconds
                    toast: true, // Makes the alert behave like a toast notification
                    customClass: {
                        popup: 'swal2-left-toast' // Optional: You can add custom CSS here if needed
                    }
                });
            })
            .catch((err)=>{
                setMessage(`failed to copy`);
            })
    }

    function handleExpandLink(index){
        setExpandedRow(expandedRow===index ? null : index);
    }

    const urlsHtml = urls.map((url, index) => (
        <tr key={index}
            className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                http://{host}/api/shortUrl/{url.shortId}
            </th>
            <td className={`px-6 py-4 ${expandedRow===index ? `whitespace-normal` : 'truncate'}`}
                style={{maxWidth:'12rem',wordBreak:'break-word'}}
            >
                {expandedRow===index ? url.redirectUrl  : url.redirectUrl.slice(0,12)}
            </td>
            <td className="px-6 py-4">{url.details.length}</td>
            <td className="px-6 py-4">

                <button type="button"
                        className={`text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700`}
                        onClick={()=>{handleExpandLink(index)}}
                >{expandedRow===index ? 'Close Link' : 'View Link'}
                </button>

            </td>
            <td className="px-6 py-4">
                <button type="button"
                        className="text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 rounded-lg py-2 px-2.5 inline-flex items-center justify-center bg-white border-gray-200 border"
                        onClick={() => copyToClipBoard(`http://${host}/api/shortUrl/${url.shortId}`)}
                >
                    <span id="default-message" className="inline-flex items-center">
                <svg className="w-3 h-3 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"/>
                </svg>
                <span className="text-xs font-semibold">Copy</span>
            </span>
                    <span id="success-message" className="hidden inline-flex items-center">
                <svg className="w-3 h-3 text-blue-700 dark:text-blue-500 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                </svg>
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-500">Copied</span>
            </span>
                </button>
            </td>
            <td className="px-6 py-4">
                <button type="button"
                        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                        onClick={() => {
                            handleDelete(url.shortId)
                        }}>
                    Delete
                </button>
            </td>
        </tr>
    ));

    return (
        <>
            <div className="relative shadow-md sm:rounded-lg">
                <div className={`max-h-[350px] overflow-y-auto ${style.scrollbarHide}`}>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        {/* Header */}
                        <thead
                            className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3">Short Url</th>
                            <th scope="col" className="px-6 py-3">Redirect Url</th>
                            <th scope="col" className="px-6 py-3">Count</th>
                            <th scope="col" className="px-6 py-3">Full Link</th>
                            <th scope="col" className="px-6 py-3">Copy</th>
                            <th scope="col" className="px-6 py-3">Delete</th>
                        </tr>
                        </thead>

                        {/* Scrollable Body */}
                        <tbody>
                        {urlsHtml}
                        </tbody>
                    </table>
                </div>
            </div>
            {message && <p className={'text-green-500'}>{message}</p>}
            {error && <p className="text-red-500">{error}</p>}
        </>
    );

}