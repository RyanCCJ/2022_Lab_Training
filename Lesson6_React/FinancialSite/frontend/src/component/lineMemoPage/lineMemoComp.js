import React, { useState } from 'react';
import InputBlockComp from './inputBlockComp';
import SearchBlockComp from './searchBlockComp';

function LineMemoComp() {
    const [function1, setFunction1] = useState(true)
    const [function2, setFunction2] = useState(false)

    function button1(e){
        e.preventDefault()

        setFunction1(true)
        setFunction2(false)
    }

    function button2(e){
        e.preventDefault()

        setFunction1(false)
        setFunction2(true)
    }

    return (
        <>
            <div className = 'row mx-auto py-3' style = {{ width : "90%", height : "100%" }}>
                <div className = 'list-group list-group-horizontal mt-2 mx-auto text-center' style = {{ width : "80%" }}>
                    { function1 ? <button className = 'list-group-item list-group-item-action active' onClick = { button1 }>Line memo資料輸入</button>:<button className = 'list-group-item list-group-item-action' onClick = { button1 }>Line memo資料輸入</button>}
                    { function2 ? <button className = 'list-group-item list-group-item-action active' onClick = { button2 }>Line memo資料查詢</button>:<button className = 'list-group-item list-group-item-action' onClick = { button2 }>Line memo資料查詢</button>}
                </div>

                { function1 ? <InputBlockComp /> : <SearchBlockComp /> }
            </div>
        </>
    );
}

export default LineMemoComp;