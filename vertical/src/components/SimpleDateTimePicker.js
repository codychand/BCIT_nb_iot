import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';

const SimpleDateTimePicker = props => {
    
    // state
    const [fromValue, setFromValue] = useState(['', Math.floor((Date.now() / 1000) - 1500000)]);
    const [toValue, setToValue] = useState(['', Math.floor(Date.now() / 1000)]);
    
    // functions
    const hasThirtyDays = mm => ["02", "04", "06", "08", "10", "12"].indexOf(mm) > -1;
    const convertInputStringToDateObj = str => {
        if (str.length !== 16) return null;
        
        const dd = str.substr(0, 2);
        const mm = parseInt(str.substr(3, 2)) - 1;
        const yyyy = str.substr(6, 4);
        const hours = str.substr(11, 2);
        const mins = str.substr(14, 2);
        
        
        if (yyyy < 1000 || yyyy > (new Date()).toDateString().substr(11 ,4)) return null;
        if (mm < 0 || mm > 11) return null;
        if (dd > 31 || (hasThirtyDays(mm) && dd > 30)) return null;
        if (hours < 0 || hours > 24) return null;
        if (mins < 0 || mins > 60) return null;
        
        let obj = new Date();
        obj.setMinutes(mins);
        obj.setHours(hours);
        obj.setDate(dd);
        obj.setUTCMonth(mm);
        obj.setFullYear(yyyy);
        
        return obj;
    }
    const onToInputChange = value => {
        if (value === "now") {
            setToValue([value, Math.floor(Date.now() / 1000)]);
            return;
        }
        
        const obj = convertInputStringToDateObj(value);
        
        if (obj != null) {
            setToValue([value, Math.floor(obj / 1000)]);
        } else {
            setToValue([value, toValue[1]])
        }
    }
    const onFromInputChange = value => {
        const obj = convertInputStringToDateObj(value);
        
        if (obj != null) {
            setFromValue([value, Math.floor(obj / 1000)]);
        } else {
            setFromValue([value, fromValue[1]])
        }
    }
    const setParentTimestamps = () => props.setTimestamps(fromValue, toValue);
  
    return (
        <div>
            <div style={{ 
                display: 'flex', 
                alignItems: props.viewportWidth <= 680 ? 'flex-end' : 'center',
                flexDirection: props.viewportWidth <= 680 ? 'column' : 'row'
            }}>
                <div style={{ display: 'flex', 
                alignItems: 'center', }}>
                    <label style={{ marginRight: 5 }} >From:</label>
                    <input 
                        style={{ margin: 5, maxWidth: 200 }}
                        className="form-control" 
                        type="search" 
                        onChange={e => onFromInputChange(e.target.value)}
                        placeholder="dd/mm/yyyy@hh:mm"
                        id="from-timestamp-input" 
                        />
                </div>
                <div style={{ display: 'flex', 
                alignItems: 'center', }}>
                    <label style={{ margin: 5 }} >To:</label>
                    <input 
                        style={{ margin: 5, maxWidth: 200 }}
                        className="form-control" 
                        type="search"
                        onChange={e => onToInputChange(e.target.value)} 
                        placeholder="now"
                        id="to-timestamp-input" 
                        />
                </div>
                    
                <Button 
                    style={{ margin: 10, minWidth: 100 }}
                    className="btn-icon" 
                    onClick={() => setParentTimestamps()}
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
