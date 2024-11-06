import axios from "axios";
import {useState} from "react";

export function TestingRedirect() {
    const [data,setData] = useState();
    return (
        <>
            {JSON.stringify(data)}
        <button onClick={()=>{
            axios.get('/api/testingRedirect')
                .then(res => setData(res.data));
        }}>Click Me </button>
        </>
    )
}