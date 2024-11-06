import {Link} from "react-router-dom";

const details = [
    {src: 'gmail.svg' , alt: 'gmail' , link : 'https://mail.google.com/mail/?view=cm&fs=1&to=patelom2026@gmail.com' , uName : 'patelom2026@gmail.com'},
    {src: 'linkedinIcon.png' , alt: 'linkedin' , link: 'https://www.linkedin.com/in/om-bhut-ab93972b9?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' , uName: 'Om Bhut'},
    {src: 'x.jpg' , alt: 'X', link: 'https://x.com/Om_Bhut1725?t=togZO9AIn7UQTJyuj1sDog&s=08' ,uName: '@Om_Bhut1725'},
    {src: 'Instagram.svg' , alt: 'instagram',link: 'https://www.instagram.com/reactivcoderz/profilecard/?igsh=MWp5MHNnNDBkNWtoNw==' , uName: '@reactivcoderz'},
];

export function Contact() {
    const contactHandles = details.map((handle)=>(
        <>
            <a href={handle.link} target="_blank"
               className="flex flex-row items-center gap-6 cursor-pointer max-w-xs sm:max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 w-full"

            >
                <img src={`/api/static/${handle.src}`} alt={handle.alt} className={'h-11 max-w-full'}/>
                <h5 className="mb-2 text-xs md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{handle.uName}</h5>
            </a>
        </>
    ));

    return (
        <>
            <div className={'bg-white dark:bg-gray-900 flex flex-col gap-9 md:gap-14 justify-center items-center'}
                 style={{ height: 'calc(100vh - 64px)' }}
            >
                {contactHandles}
            </div>
        </>
    )
}