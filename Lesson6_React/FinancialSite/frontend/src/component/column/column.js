import CustomA from "../customA";
import { rootApiIP } from '../../constant'
import React from 'react';

export const columns = [
    { field: "dbName", headerName : "資料表名稱", flex: 1, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'dataQuantity', headerName: '資料總筆數', flex: 1, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'newestDate', headerName: '最新資料日期', flex: 1, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'downloadUrl', headerName: '資料總表下載', flex: 1, headerAlign: 'center', align: 'center', renderCell : rowData => <a href = { rowData.value } download = { rowData.value.split("/")[-1] + ".csv" }>Download</a> , sortable: false},
];

export const columns1 = [
    { field: "ID", headerName : "ID", flex: 1, headerAlign: 'center', align: 'center', hide : 'true' },
    { field: 'stockNum', headerName: '股票代號', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'stockName', headerName: '股票名稱', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'date', headerName: '資料日期', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'investmentCompany', headerName: '提供者', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'recommend', headerName: '推薦', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'filename', headerName: '檔案下載', flex: 1, headerAlign: 'center', sortable: false, align: 'center', renderCell : rowData => <a href = { rootApiIP + "/data/download/single_financialData?filename=" + rowData.value } download = { rowData.value}>Download</a> },
];

export const columns2 = [
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

export const columns3 = [
    { field: "ID", headerName : "ID", flex: 1, headerAlign: 'center', align: 'center', hide : 'true' },
    { field: 'stockNum', headerName: '股票代號', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'stockName', headerName: '股票名稱', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'date', headerName: '日期', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'filename', headerName: '檔案下載', flex: 1, headerAlign: 'center', sortable: false, align: 'center', renderCell : rowData => (check_single_lineMemo_memo_NULL(rowData.value)) },
    { field: 'inputTime', headerName: '輸入時間', flex: 1, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'username', headerName: 'Username', flex: 1, headerAlign: 'center', align: 'center' },
];

export const columns4 = [
    { field: "ID", headerName : "ID", flex: 1, headerAlign: 'center', align: 'center', hide : 'true' },
    { field: 'stockNum', headerName: '股票代號', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'stockName', headerName: '股票名稱', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'Date', headerName: '法說會日期', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'Time', headerName: '法說會時間', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'Form', headerName: '法說會形式', flex: 1, headerAlign: 'center', sortable: false, align: 'center' },
    { field: 'Message', headerName: '法說會訊息', flex: 1, headerAlign: 'center', sortable: false, align: 'center' },
    { field: 'chPDF', headerName: '中文檔案', flex: 1, headerAlign: 'center', sortable: false, align: 'center', renderCell : rowData => check_single_twse_chPDF_NULL(rowData.value) },
    { field: 'enPDF', headerName: '英文檔案', flex: 1, headerAlign: 'center', sortable: false, align: 'center', renderCell : rowData => check_single_twse_enPDF_NULL(rowData.value) },
    { field: 'More information', headerName: '相關資訊', flex: 1, headerAlign: 'center', sortable: false, align: 'center' },
    { field: 'Video address', headerName: '影音連結資訊', flex: 1, headerAlign: 'center', sortable: false, align: 'center' },
    { field: 'Attention', headerName: '其他應敘明事項', flex: 1, headerAlign: 'center', sortable: false, align: 'center'},
];

export const columns5 = [
    { field: "ID", headerName : "ID", flex: 1, headerAlign: 'center', align: 'center', hide : 'true' },
    { field: 'username', headerName: '上傳者', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'date', headerName: '上傳日期', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'title', headerName: '上傳檔案標題', flex: 1, headerAlign: 'center', sortable: false, align: 'center'},
    { field: 'fileName', headerName: '上傳檔案名稱', flex: 1, headerAlign: 'center', sortable: false, align: 'center'},
    { field: 'filename', headerName: '檔案下載', flex: 1, headerAlign: 'center', sortable: false, align: 'center', renderCell : rowData => <a href = { rootApiIP + "/data/download/single_industry_analysis?filename=" + rowData.value } download = { rowData.value }>Download</a>  },
];

export const columns6 = [
    { field: "ID", headerName : "ID", flex: 1, headerAlign: 'center', align: 'center', hide : 'true' },
    { field: 'username', headerName: '上傳者', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'date', headerName: '上傳日期', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'fileName', headerName: '上傳檔案名稱', flex: 1, headerAlign: 'center', sortable: false, align: 'center'},
    { field: 'filename', headerName: '檔案下載', flex: 1, headerAlign: 'center', sortable: false, align: 'center', renderCell : rowData => <a href = { rootApiIP + "/data/download/single_meetingData?filename=" + rowData.value } download = { rowData.value }>Download</a>  },
];

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

const check_single_twse_chPDF_NULL = (value) => {
    if(value === "NULL"){
        return <> </>
    }else{
        return <a href = { rootApiIP + "/data/download/single_twse_chPDF_download?filename=" + value } download = { value }>Download</a>
    }
}

const check_single_twse_enPDF_NULL = (value) => {
    if(value === "NULL"){
        return <> </>
    }else{
        return <a href = { rootApiIP + "/data/download/single_twse_enPDF_download?filename=" + value } download = { value }>Download</a>
    }
}