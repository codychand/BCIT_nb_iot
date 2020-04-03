import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';

const getRandomKey = () => Math.floor(Math.random() * Math.floor(10000));
const oneMonthAgo = obj => {
    obj.setUTCMonth(obj.getMonth() === 0 ? 11 : obj.getMonth() - 1);
    return obj;
}

const SimpleDateTimePicker = props => {
    
    //constants
    const lsStartTs = localStorage.getItem('start_timestamp');
    const lsEndTs = localStorage.getItem('end_timestamp');
    
    // state
    const [mydate, setMydate] = useState(
        lsStartTs !== null && lsEndTs !== null ? 
        [new Date(parseInt(lsStartTs) * 1000), new Date(parseInt(lsEndTs) * 1000)] :
        null
    );
    const [r, pleaseReRender] = useState(null);
    
    // functions
    const setParentTimestamps = () => {
        if (mydate === null) {
            const from = Math.floor((Date.now() / 1000) - 1500000);
            const to = Math.floor(Date.now() / 1000);
            localStorage.setItem('start_timestamp', from);
            localStorage.setItem('end_timestamp', to)
            props.setTimestamps(from, to);
        } else {
            localStorage.setItem('start_timestamp', Math.floor(mydate[0] / 1000));
            localStorage.setItem('end_timestamp', Math.floor(mydate[1] / 1000))
            props.setTimestamps(Math.floor(mydate[0] / 1000), Math.floor(mydate[1] / 1000));
        }
    }
    
    useEffect(() => {
        // change divider from "-" to " to "
        document.getElementsByClassName('react-datetimerange-picker__range-divider')[0].textContent = " to ";
    })
  
    return (
        <div>
            <div style={{ 
                display: 'flex', 
                alignItems: props.viewportWidth <= 680 ? 'flex-start' : 'center',
                flexDirection: props.viewportWidth <= 680 ? 'column' : 'row'
            }}>     
                <div style={{ backgroundColor: '#47bd9a', padding: 5, borderRadius: 3 }}>
                    { props.viewportWidth <= 900 ? '' : 
                        <span style={{ marginRight: 5, color: 'black' }}>
                            Show device activity from 
                        </span> 
                    }
                    <DateTimeRangePicker
                        rangeDivider=" to "
                        onChange={date => { console.log(date); setMydate(date)}}
                        value={mydate}
                        maxDate={new Date()}
                        showLeadingZeros={true}
                    />
                </div>
                    
                <Button 
                    style={{ margin: 10, marginLeft: props.viewportWidth <= 680 ? 0 : 10, minWidth: 100 }}
                    className="btn-icon" 
                    onClick={() => {
                        setParentTimestamps();
                        pleaseReRender();
                    }}
                    color="primary"> 
                    <span className="btn-icon-label">
                        <i className="mdi mdi-bullseye-arrow mr-2"></i>
                    </span> 
                    Go
                </Button>
            </div>
        </div>
    );
  
}

export default SimpleDateTimePicker;
