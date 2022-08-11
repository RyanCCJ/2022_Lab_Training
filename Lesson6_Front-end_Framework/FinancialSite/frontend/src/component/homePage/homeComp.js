import React, { useEffect, useState } from 'react';
import axios from 'axios';
import bgimage from "../../image/coins_on_chart.jpg"
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { rootApiIP } from '../../constant'
import { columns1 } from '../column/column'

axios.defaults.withCredentials = true;

function HomeComp() {
    let [data, setData] = useState([]);
    const [pageSize, setPageSize] = useState(5);

    useEffect(() => {
        axios.get(rootApiIP + "/data/newest15")
        .then(res => {
            setData(res.data);
        }).catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }, [])

    return (
        <>
            <div className = 'jumbotron jumbotron-fluid d-flex' style = {{ backgroundImage : `url(${bgimage})`, opacity : "0.8", backgroundAttachment : "fixed", backgroundSize : "cover", height : "60vh", justifyContent : "center", alignItems : "center" }}>
                <div className = 'text-center'>
                    <h1 className = "display-4" style = {{ color : "white" }}>Financial Database</h1>
                    <p className = 'lead' style = {{ color : "white" }}>Easily and quickly</p>
                </div>
            </div>

            <div className = 'container-fluid'>
                <div className = 'col-md-10 mx-auto py-3'>
                    <h3 className = "display-4 text-center">最新15筆資料</h3>
                    <DataGrid
                        columns = { columns1 } 
                        rows = { data }
                        pageSize = { pageSize }
                        onPageSizeChange={ (newPageSize) => setPageSize(newPageSize) }
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
            </div>
        </>
    );
}

export default HomeComp;