import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { rootApiIP } from '../../constant'

function InputBlockComp() {
    const [input1, setInput1] = useState([])
    const [input1Validation, set_input1Validation] = useState(false)
    const [input2, setInput2] = useState("")
    const [input2Validation, set_input2Validation] = useState(false)
    const [autocom, setAutocom] = useState([])
    const [username, setUsername] = useState("")
    var Today = new Date();

    function submit(e){
        e.preventDefault()

        if(input1.length !== 0 && input2 !== ""){
            set_input1Validation(false)
            set_input2Validation(false)

            axios.post(rootApiIP + "/data/upload/line_memo_upload", {
                stock_num_name : input1[0].stock_num_name,
                date : Today.getFullYear() + "_" + String(Today.getMonth()+1).padStart(2, '0') + "_" + String(Today.getDate()).padStart(2, '0'),
                content : input2
            }).then(res => {
                alert("上傳成功")
            }).catch(res => {
                if(res.response.data === "Session expired") window.location.reload()
            })
        }else{
            input1.length === 0 ? set_input1Validation(true) : set_input1Validation(false)
            input2 === "" ? set_input2Validation(true) : set_input2Validation(false)
        }
    }

    useEffect(() => {
        axios.get(rootApiIP + "/data/autoCom")
        .then(res => {
            setAutocom(res.data);
        }).catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })

        axios.get(rootApiIP + "/data/username")
        .then(res => {
            setUsername(res.data)
        }).catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }, [])

    return (
        <>
            <form className = 'row mx-auto' onSubmit = { submit } noValidate style = {{ width : "70%" }}>
                <h3 className = "text-center mt-2">Line memo資料輸入</h3>

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
                        <label htmlFor = "username">使用者:</label>
                        <input type = "text" className = "form-control" id = "username" value = { username } disabled style = {{ opacity : 0.8 }}/>
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
                        <label htmlFor = "reason">內容:</label>
                        <textarea type = "text" className = "form-control" id = "reason" placeholder = '請輸入內容' onChange = { event => setInput2(event.target.value) } style = {{ resize : 'none', height : "30vh" }}/>
                        { input2Validation ? <div style = {{ color : "red" }}>此欄位為必填</div> : <></> }
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