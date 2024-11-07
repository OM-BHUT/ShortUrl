import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import style from "@/components/homePageComponents/css/hideScrollBar.module.css";
import {deleteUrl, fetchUrls} from "@/redux/slice/changesSlice.js";

export function Admin() {
    const user = useSelector(state => state.user);
    const navigate = useNavigate();
    const [urls,setUrls] = useState([]);
    const [expandedRow,setExpandedRow] = useState(null);
    useEffect(()=>{
        if (!user || user.role!=='admin' || Object.keys(user).length===0){
            navigate('/home');
        }
    },[user]);

    useEffect(()=>{
        axios.get('/api/shortUrl/admin/allUrl')
            .then(res=> {
                setUrls(res.data)
            })
            .catch((err)=>console.log(err));
    },[]);

    function handleDelete(shortId) {
        axios.delete('/api/shortUrl/' + shortId)
            .then((res) => {
                setUrls(urls.filter(url => url.shortId !== shortId));
            })
            .catch((err) => {
                if (err.response) {
                    const message = err.response.data.message;
                    console.error("Error:", message);
                }
            });
    }


    function handleExpandLink(index){
        setExpandedRow(expandedRow===index ? null : index);
    }

    const urlsHtml = urls.map((url, index) => (
        <tr key={index}
            className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {url.shortId}
            </th>
            <td className={`px-6 py-4 ${expandedRow===index ? `whitespace-normal` : 'truncate'}`}
                style={{maxWidth:'12rem',wordBreak:'break-word'}}
            >
                {expandedRow===index ? url.redirectUrl  : url.redirectUrl.slice(0,12)}
            </td>
            <td className="px-6 py-4">{url.details.length}</td>

            <td className="px-6 py-4">{url.createdBy}</td>
            <td className="px-6 py-4">

                <button type="button"
                        className={`text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700`}
                        onClick={()=>{handleExpandLink(index)}}
                >{expandedRow===index ? 'Close Link' : 'View Link'}
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
                <div className={`max-h-[650px] overflow-y-auto ${style.scrollbarHide}`}>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        {/* Header */}
                        <thead
                            className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3">Short Url</th>
                            <th scope="col" className="px-6 py-3">Redirect Url</th>
                            <th scope="col" className="px-6 py-3">Count</th>
                            <th scope="col" className="px-6 py-3">User email</th>
                            <th scope="col" className="px-6 py-3">Full Link</th>
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
        </>
    )
}