import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CustomA from '../customA';
import { rootApiIP } from '../../constant'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import { Backdrop, CircularProgress } from '@mui/material';

function AllSearchPageComp() {
    const { stockNum } = useParams();
    const [data1, setData1] = useState([]);
    const [loading1, setLoading1] = useState(true)
    const [data2, setData2] = useState([]);
    const [loading2, setLoading2] = useState(true)
    const [data3, setData3] = useState([]);
    const [loading3, setLoading3] = useState(true)
    const [page1, setPage1] = useState(0);
    const [pageSize1, setPage1Size] = useState(5);
    const [page2, setPage2] = useState(0);
    const [pageSize2, setPage2Size] = useState(5);
    const [page3, setPage3] = useState(0);
    const [pageSize3, setPage3Size] = useState(5);

    const check_single_post_board_memo_NULL = (value) => {
        if(value === "NULL"){
            return <> </>
        }else{
            return <CustomA value = { rootApiIP + "/data/download/single_post_board_memo?filename=" + value } />
        }
    }

    const check_single_lineMemo_memo_NULL = (value) => {
        if(value === "NULL"){
            return <> </>
        }else{
            return <CustomA value = { rootApiIP + "/data/download/single_line_memo?filename=" + value } />
        }
    }

    const columns1 = [
        { field: "ID", headerName : "ID", flex: 1, headerAlign: 'center', align: 'center', hide : 'true' },
        { field: 'stockNum', headerName: '股票代號', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'stockName', headerName: '股票名稱', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'date', headerName: '資料日期', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'investmentCompany', headerName: '提供者', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'recommend', headerName: '推薦', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'filename', headerName: '檔案下載', flex: 1, headerAlign: 'center', sortable: false, align: 'center', renderCell : rowData => <a href = { rootApiIP + "/data/download/single_financialData?filename=" + rowData.value } download = { rowData.value}>Download</a> },
    ];

    const columns2 = [
        { field: "ID", headerName : "ID", flex: 1, headerAlign: 'center', align: 'center', hide : 'true' },
        { field: 'date', headerName: '日期', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'username', headerName: 'Username', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'stockName', headerName: '股票名稱', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'stockNum', headerName: '股票代號', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'evaluation', headerName: '評價', flex: 1, headerAlign: 'center', align: 'center', sortable: false },
        { field: 'price', headerName: '目標價', flex: 1, headerAlign: 'center', align: 'center', sortable: false },
        { field: 'reason', headerName: '理由', headerAlign: 'center', align: 'center', sortable: false, width: 400 },
        { field: 'filename', headerName: '檔案下載', headerAlign: 'center', sortable: false, align: 'center', renderCell : (rowData) => (check_single_post_board_memo_NULL(rowData.value))},
    ];

    const columns3 = [
        { field: "ID", headerName : "ID", flex: 1, headerAlign: 'center', align: 'center', hide : 'true' },
        { field: 'stockNum', headerName: '股票代號', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'stockName', headerName: '股票名稱', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'date', headerName: '日期', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'filename', headerName: '檔案下載', flex: 1, headerAlign: 'center', sortable: false, align: 'center', renderCell : rowData => (check_single_lineMemo_memo_NULL(rowData.value)) },
        { field: 'inputTime', headerName: '評價', flex: 1, headerAlign: 'center', align: 'center', sortable: false },
        { field: 'username', headerName: 'Username', flex: 1, headerAlign: 'center', align: 'center' },
    ];

    useEffect(() => {
        axios.post(rootApiIP + "/data/dbsearch", {
            "stockName_or_Num" : [{ "stock_num_name" : stockNum }],
            "startDate" : "",
            "endDate" : "",
            "investmentCompany" : "",
            "dbTable" : "financialData"
        }).then(res => {
            setData1(res.data)
            setLoading1(false)
        }).catch(res => {

        })

        axios.post(rootApiIP + "/data/dbsearch", {
            "stockName_or_Num" : [{ "stock_num_name" : stockNum }],
            "startDate" : "",
            "endDate" : "",
            "investmentCompany" : "",
            "dbTable" : "post_board_memo"
        }).then(res => {
            setData2(res.data)
            setLoading2(false)
        }).catch(res => {

        })

        axios.post(rootApiIP + "/data/dbsearch", {
            "stockName_or_Num" : [{ "stock_num_name" : stockNum }],
            "startDate" : "",
            "endDate" : "",
            "investmentCompany" : "",
            "dbTable" : "lineMemo"
        }).then(res => {
            setData3(res.data)
            setLoading3(false)
        }).catch(res => {

        })
    }, [])

    return (
        <>
            { loading1 || loading2 || loading3 ? <Backdrop
                sx = {{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open = { true }
            >
                <CircularProgress color = "inherit" />
            </Backdrop> : 

            <>
                <div className = 'row mt-3 mx-auto text-center'>
                    <h3 className = "display-6 text-center">查詢結果</h3>
                    <hr className = 'mx-auto' style = {{ width : "95vw" }}/>
                </div>

                <div className = 'row mx-auto py-3' style = {{ width : "90%" }}>
                    <h2 className = "text-center">個股研究資料</h2>

                    <DataGrid
                        columns = { columns1 }
                        rows = { data1 }
                        page = { page1 }
                        onPageChange={(newPage) => setPage1(newPage)}
                        pageSize = { pageSize1 }
                        onPageSizeChange={ (newPageSize) => setPage1Size(newPageSize) }
                        rowsPerPageOptions = {[5, 10, 20]}
                        getRowId = { row => row.ID }
                        components = {{ Toolbar: GridToolbar }}
                        componentsProps = {{ toolbar: { showQuickFilter: true },}}
                        pagination
                        autoHeight
                        disableColumnMenu
                        disableColumnSelector
                        disableDensitySelector
                        disableColumnFilter
                        disableSelectionOnClick = { true }
                    />
                </div>

                <div className = 'row mx-auto py-3' style = {{ width : "90%" }}>
                    <h2 className = "text-center">個股推薦</h2>

                    <DataGrid
                        columns = { columns2 }
                        rows = { data2 }
                        page = { page2 }
                        onPageChange={(newPage) => setPage2(newPage)}
                        pageSize = { pageSize2 }
                        onPageSizeChange={ (newPageSize) => setPage2Size(newPageSize) }
                        rowsPerPageOptions = {[5, 10, 20]}
                        getRowId = { row => row.ID }
                        components = {{ Toolbar: GridToolbar }}
                        componentsProps = {{ toolbar: { showQuickFilter: true },}}
                        pagination
                        autoHeight
                        disableColumnMenu
                        disableColumnSelector
                        disableDensitySelector
                        disableColumnFilter
                        disableSelectionOnClick = { true }
                    />
                </div>

                <div className = 'row mx-auto py-3' style = {{ width : "90%" }}>
                    <h2 className = "text-center">Line memo</h2>

                    <DataGrid
                        columns = { columns3 }
                        rows = { data3 }
                        page = { page3 }
                        onPageChange={(newPage) => setPage3(newPage)}
                        pageSize = { pageSize3 }
                        onPageSizeChange={ (newPageSize) => setPage3Size(newPageSize) }
                        rowsPerPageOptions = {[5, 10, 20]}
                        getRowId = { row => row.ID }
                        components = {{ Toolbar: GridToolbar }}
                        componentsProps = {{ toolbar: { showQuickFilter: true },}}
                        pagination
                        autoHeight
                        disableColumnMenu
                        disableColumnSelector
                        disableDensitySelector
                        disableColumnFilter
                        disableSelectionOnClick = { true }
                    />
                </div>
            </>}
            

            
        </>
    );
}

export default AllSearchPageComp;