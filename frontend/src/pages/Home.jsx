import {Outlet} from "react-router-dom";
import {Layout} from "@/components/homePageComponents/Layout.jsx";

export function Home() {
    return (
        <>
            <div className={'bg-zinc-800 min-h-screen'}>
            <Layout />
            <Outlet />
            </div>
        </>
    )
}