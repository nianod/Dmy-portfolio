import { FaDownload } from "react-icons/fa";

const resume_file = 'https://stack-by-arnold.vercel.app/Arnold_Katumo_Resume-.pdf';

const Resime = () => {
  const downloadResumeURL = (url) => {
    const fileName = url.split('/').pop()
    const download = document.createElement('a')
    download.href = url;
    download.setAttribute('download', fileName)
    document.body.appendChild(download)
    download.click()
    document.body.removeChild(download)
  }


  
  return (
    <div className="flex justify-center mt-3">
      <button
        className="p-2 px-4 rounded bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2 cursor-pointer"
        onClick={() => downloadResumeURL(resume_file)}
      >
        My Resume <FaDownload />
      </button>
    </div>
  );

}


export default Resime;
