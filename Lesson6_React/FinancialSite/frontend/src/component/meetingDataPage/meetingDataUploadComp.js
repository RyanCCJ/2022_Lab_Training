import axios from 'axios';
import React, { useState } from 'react';
import { rootApiIP } from '../../constant'

function MeetingDataUploadComp() {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");

    const saveFile = (e) => {
        if(e.target.files.length !== 0){
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }else{
            setFile(null);
            setFileName("");
        }
    };

    function submit(e){
        e.preventDefault();

        if(fileName !== ""){
            const formData = new FormData();
            formData.append("selectFile", file);
            formData.append("filename", fileName);

            axios.post(rootApiIP + "/data/upload/meeting_data_upload", formData, {
                headers : { "Content-Type": "multipart/form-data" }
            }).then(res => {
                alert("上傳成功")
            }).catch(res => {
                if(res.response.data === "Session expired") window.location.reload()
            })
        }else{
            alert("請選擇檔案")
        }
    }

    return (
        <>
            <div className = 'row text-center mx-auto mt-3'>
                <h3>會議紀錄上傳</h3>

                <div className = 'mt-3'>
                    <label htmlFor = "upload">檔案上傳:&emsp;</label>
                    <input type = "file" id = "upload" onChange = { saveFile }/>
                    <button className = "btn btn-primary" onClick = { event => submit(event) }>送出</button>
                </div>
            </div>
        </>
    );
}

export default MeetingDataUploadComp;