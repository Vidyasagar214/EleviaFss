import React, {useState,useRef, useMemo,useCallback} from 'react';

import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';


const AGCommonTable = (props) => {

  const gridRef = useRef();
  console.log("gridref",gridRef)
    
   const defaultColDef = useMemo(() => {
    return {
      resizable: true,
    };
  }, []);

  
  

   return (
    <div className='row'>
       <div className="ag-theme-alpine col-12" style={{height:"79vh"}}>
           <AgGridReact
                ref={gridRef}
                pagination={true}
               
                defaultColDef={defaultColDef}
                {...props}
              >
           </AgGridReact>
       </div>
       </div>
   );
};

export default AGCommonTable;