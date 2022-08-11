import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';
import { rootApiIP } from '../../constant'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { columns4 } from '../column/column';
import { useNavigate } from 'react-router-dom';

function CalendarComp() {
    const nav = useNavigate()
    const [data, setData] = useState([])
    const [year1, setYear1] = useState(new Date().getFullYear())
    const [month1, setMonth1] = useState(new Date().getMonth() + 1)
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        axios.post(rootApiIP + "/data/calenderData", { "year" : year1, "month" : month1 })
        .then(res => {
            setPage(0)
            setData(res.data)
        }).catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }, [year1, month1])

    function clickEvent(info){
        nav("/database/search/" + info.event.title)
    }

    async function getCalendarData(fetchInfo, successCallback) {

        try {
            let year = new Date().getFullYear();
            let month = new Date().getMonth() + 1;
        
            if (fetchInfo) {
                year = new Date(fetchInfo.start).getFullYear();
                month = new Date(fetchInfo.start).getMonth() + 1;
            }

            setYear1(year)
            setMonth1(month)

            const response = await axios.post(rootApiIP + "/data/calender", { "year" : year, "month" : month })

            successCallback(
                response.data.map(event => {
                    return ({
                        title: event.title,
                        start: event.date,
                    });
                })
            );
        } catch (error) {
            if(error.response.data === "Session expired") window.location.reload()
        }
    }

    return (
        <>
            <div className = 'row mt-3 mx-auto text-center'>
                <h1>法說會行事曆</h1>
            </div>

            <div className = 'row mt-3 mx-auto'>
                <div className = 'col-md-6 mx-auto'>
                    <FullCalendar
                        height = { 600 }
                        plugins={[ dayGridPlugin ]}
                        initialView = "dayGridMonth"
                        events = { (fetchInfo, successCallback, failureCallback) => getCalendarData(fetchInfo, successCallback, failureCallback) }
                        dayMaxEventRows = { 2 }
                        eventClick = { clickEvent }
                        eventMouseEnter = { info => info.el.style.cursor = "pointer" }
                        showNonCurrentDates = { false }
                        fixedWeekCount = { false }
                    />
                </div>
            </div>

            <div className = 'row mt-5 mx-auto' style = {{height : "600px"}}>
                <DataGrid
                    columns = { columns4 }
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
            </div>
        </>
    );
}

export default CalendarComp;