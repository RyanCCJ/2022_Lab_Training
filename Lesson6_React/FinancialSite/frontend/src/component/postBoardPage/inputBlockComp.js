import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { rootApiIP } from '../../constant'
var FormData = require('form-data');

function InputBlockComp() {
    const [input1, setInput1] = useState([])
    const [input1Validation, set_input1Validation] = useState(false)
    const [input2, setInput2] = useState("")
    const [input3, setInput3] = useState("")
    const [input4, setInput4] = useState("")
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [autocom, setAutocom] = useState([])
    const [username, setUsername] = useState("")
    var Today = new Date();
    
    function submit(e){
        e.preventDefault()

        if(input1.length === 0){
            set_input1Validation(true)
        }else{
            set_input1Validation(false)

            const formData = new FormData();
            formData.append("stock_num_name", input1[0].stock_num_name);
            formData.append("date", Today.getFullYear() + "_" + String(Today.getMonth()+1).padStart(2, '0') + "_" + String(Today.getDate()).padStart(2, '0'))
            formData.append("recommend", input2);
            formData.append("price", input3);
            formData.append("reason", input4);
            formData.append("selectFile", file);
            formData.append("filename", fileName);

            axios.post(rootApiIP + "/data/upload/post_board_upload", formData, {
                headers : { "Content-Type": "multipart/form-data" }
            }).then(res => {
                alert("上傳成功")
            }).catch(res => {
                if(res.response.data === "Session expired") window.location.reload()
            })
        }
    }
    
    const saveFile = (e) => {
        if(e.target.files.length !== 0){
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }else{
            setFile(null);
            setFileName("");
        }
    };

    useEffect(() => {
        axios.get("http://140.116.214.154:3000/api/data/autoCom")
        .then(res => {
            setAutocom(res.data);
        }).catch(res => {
        })

        axios.get("http://140.116.214.154:3000/api/data/username")
        .then(res => {
            setUsername(res.data)
        }).catch(res => {
        })
    }, [])

    return (
        <>
            <form className = 'row mx-auto' onSubmit = { submit } noValidate style = {{ width : "70%" }}>
                <h3 className = "text-center mt-2">個股推薦資料輸入</h3>

                <div className = "form-row px-5">
                    <div className = "form-group">
                        <label htmlFor = "stock_num_name">股票代號&名稱:</label>
                        <Typeahead
                            id = "stockNum_or_Name"
                            labelKey = "stock_num_name"
                            onChange = { setInput1 }
                            options = { autocom }
                            placeholder = "請輸入股票代號或名稱"
                            selected = { input1 }
                            inputProps = {{ required : true }}
                        />
                        { input1Validation ? <div style = {{ color : "red" }}>此欄位為必填或格式錯誤</div> : <></> }
                    </div>
                </div>

                <div className = "form-row px-5 pt-4">
                    <div className = "form-group">
                        <label htmlFor = "date">日期:</label>
                        <input type = "text" className = "form-control" id = "date" value = { Today.getFullYear() + "_" + String(Today.getMonth()+1).padStart(2, '0') + "_" + String(Today.getDate()).padStart(2, '0') } disabled style = {{ opacity : 0.8 }}/>
                    </div>
                </div>

                <div className = "form-row px-5 pt-4">
                    <div className = "form-group">
                        <label htmlFor = "username">使用者:</label>
                        <input type = "text" className = "form-control" id = "username" value = { username } disabled style = {{ opacity : 0.8 }}/>
                    </div>
                </div>

                <div className = "form-row px-5 pt-4">
                    <div className = "form-group">
                        <label htmlFor = "recommend">評價:</label>

                        <select id = "recommend" className = "form-select" onChange = { event => setInput2(event.target.value) }>
                            <option value = "">請選擇評價</option>
                            <option value = "買進">買進</option>
                            <option value = "中立">中立</option>
                            <option value = "賣出">賣出</option>
                        </select>
                    </div>
                </div>

                <div className = "form-row px-5 pt-4">
                    <div className = "form-group">
                        <label htmlFor = "targetPrice">目標價:</label>
                        <input type = "number" className = "form-control" id = "targetPrice" placeholder = '請輸入預估價位' onChange = { event => setInput3(event.target.value) }/>
                    </div>
                </div>

                <div className = "form-row px-5 pt-4">
                    <div className = "form-group">
                        <label htmlFor = "reason">理由:</label>
                        <textarea type = "text" className = "form-control" id = "reason" placeholder = '請輸入理由' onChange = { event => setInput4(event.target.value) } style = {{ resize : 'none' }}/>
                    </div>
                </div>

                <div className = "form-row px-5 pt-4">
                    <div className = "form-group">
                        <label htmlFor = "upload">檔案上傳(Optional):</label>
                        <input type = "file" className = "form-control" id = "upload" onChange = { saveFile }/>
                    </div>
                </div>

                <div className = "px-5 py-4">
                    <button id = "registerButton" type = "submit" className = "btn btn-primary">送出</button>
                </div>
            </form>
        </>
    );
}

export default InputBlockComp;