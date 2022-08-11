import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { rootApiIP } from '../../constant'
import { columns2 } from '../column/column';

function SearchBlockComp() {
    const [dataQuantity, set_dataQuantity] = useState(0)
    const [newestDate, set_newestDate] = useState("")
    const [input1, setInput1] = useState([])
    const [input1Error, set_input1Error] = useState(false);
    const [input2, setInput2] = useState("");
    const [input3, setInput3] = useState("");
    const [input4, setInput4] = useState("");
    const [input5, setInput5] = useState("");
    const [loading, setLoading] = useState(false);
    const [autocom, setAutocom] = useState([])
    const [data, setData] = useState([]);
    const [search, setSearch] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    function submit(e){
        e.preventDefault();
        setLoading(true)

        if(document.getElementsByClassName('rbt-input-main form-control rbt-input')[0].value !== "" && !autocom.map(element => element.stock_num_name).includes(document.getElementsByClassName('rbt-input-main form-control rbt-input')[0].value)){
            set_input1Error(true)
            setLoading(false)
            setData([])
            setPage(0)
        }else{
            set_input1Error(false)

            axios.post(rootApiIP + "/data/post_board_search", {
                "stockName_or_Num" : input1,
                "startDate" : input2,
                "endDate" : input3,
                "recommend" : input4,
                "provider" : input5
            }).then(res => {
                setData(res.data)
                setSearch(true)
                setLoading(false)
                setPage(0)
            }).catch(res => {
                if(res.response.data === "Session expired") window.location.reload()
                setData([])
                setSearch(true)
                setLoading(false)
                setPage(0)
            })
        }
    }

    useEffect(() => {
        axios.get(rootApiIP + "/data/autoCom")
        .then(res => {
            setAutocom(res.data);
        }).catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })

        axios.get(rootApiIP + "/data/post_board_state")
        .then(res => {
            set_dataQuantity(res.data.dataQuantity)
            set_newestDate(res.data.newestDate)
        }).catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }, [])

    return (
        <>
            <form className = 'mx-auto' onSubmit = { submit } style = {{ width : "70%" }}>
                <p className = 'mt-2'>資料總筆數:{dataQuantity} 最新資料日期: {newestDate} 資料總表下載: <a href = {rootApiIP + '/data/download/post_board_memo'} download = {"post_board_memo.csv"}>點此</a></p>

                <div className = 'form-group row my-2'>
                    <label htmlFor = "stockNum_or_Name" className = "col-md-2 col-form-label text-center">股票代號&名稱:</label>
                    <div className = 'col-md-3'>
                        <Typeahead
                            id = "stockNum_or_Name"
                            labelKey = "stock_num_name"
                            onChange = { setInput1 }
                            options = { autocom }
                            placeholder = "請輸入股票代號或名稱"
                            selected = { input1 }
                        />
                    </div>
                </div>

                <div className = 'form-group row my-2'>
                    <label htmlFor = "date1" className = "col-md-2 col-form-label text-center">日期:</label>
                    <div className = 'col-md-3'>
                        <input type = "date" id = "date1" className = "form-control" onChange = {e => setInput2(e.target.value)}></input>
                    </div>

                    <label htmlFor = "date2" className = "col-md-1 col-form-label text-center">到</label>
                    <div className = 'col-md-3'>
                        <input type = "date" id = "date2" className = "form-control" onChange = {e => setInput3(e.target.value)}></input>
                    </div>
                </div>

                <div className = "form-group row my-2">
                    <label htmlFor = "recommend" className = "col-md-2 col-form-label text-center">評價:</label>

                    <div className = 'col-md-2'>
                        <select id = "recommend" className = "form-select" style = {{ width : "auto" }} onChange = { event => setInput4(event.target.value) }>
                            <option value = "">請選擇評價</option>
                            <option value = "買進">買進</option>
                            <option value = "中立">中立</option>
                            <option value = "賣出">賣出</option>
                        </select>
                    </div>
                </div>

                <div className = 'form-group row my-2'>
                    <label htmlFor = "investmentCompany" className = "col-md-2 col-form-label text-center">提供者:</label>
                    <div className = 'col-md-3'>
                        <input type = "text" id = "investmentCompany" className = "form-control" onChange = {e => setInput5(e.target.value)}></input>
                    </div>
                </div>

                <div className = 'form-group pt-4 text-center'>
                    { input1Error ? <p style = {{ color : "red" }}>股票代號&名稱格式錯誤</p> : <></> }
                    {loading && <button type = "submit" className = "btn btn-primary" style = {{ width : "200px" }} disabled><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></button>}
                    {!loading && <button type = "submit" className = "btn btn-primary" style = {{ width : "200px" }}>搜尋</button>}
                </div>
            </form>

            { search &&  <div className = 'row mx-auto py-4' style = {{ height : "400px" }}>
                <h3 className = "display-6 text-center">查詢結果</h3>

                <DataGrid
                    columns = { columns2 }
                    rows = { data }
                    page = { page }
                    onPageChange={(newPage) => setPage(newPage)}
                    pageSize = { pageSize }
                    onPageSizeChange={ (newPageSize) => setPageSize(newPageSize) }
                    rowsPerPageOptions = {[5, 10, 20]}
                    getRowId = { row => row.ID }
                    components = {{ Toolbar: GridToolbar }}
                    componentsProps = {{ toolbar: { showQuickFilter: true },}}
                    pagination
                    disableColumnMenu
                    disableColumnSelector
                    disableDensitySelector
                    disableColumnFilter
                    disableSelectionOnClick = { true }
                />
            </div>}
        </>
    );
}

export default SearchBlockComp;