import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { Card } from 'react-bootstrap'
import CustomFilter from './CustomFilter'
// import AGCommonTable from '../../components/AgTable/AgTable'
import { baseUrl } from '../../rest/Api_Directory'
import axios from 'axios'
import apiPayload from './apiData.json'
import pako from 'pako'
// import MedalRenderer from './medalRender';

import { AgGridReact } from 'ag-grid-react'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import {
  getTime,
  getBackgroundColor,
  CheckboxData,
  TotalHours,
  MapIcon,
} from './cellRenderFucntion'

const Decompress = (base64Data) => {
  var strData = atob(base64Data),
    // Convert binary s}ring to character-number array
    charData = strData.split('').map(function (x) {
      return x.charCodeAt(0)
    }),
    // Turn number array into byte-array
    binData = new Uint8Array(charData),
    // Pako magic
    data = pako.inflate(binData),
    obj
  strData = new TextDecoder('utf-8').decode(data)
  obj = JSON.parse(strData)
  return obj
}

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault()
      onClick(e)
    }}
  >
    {children}
    &#x25bc;
  </a>
))

// Formatting Time ---------------------
var dateFilterParams = {
  comparator: (filterLocalDateAtMidnight, cellValue) => {
    var dateAsString = cellValue
    if (dateAsString == null) return -1
    var dateParts = dateAsString.split('/')
    var cellDate = new Date(
      Number(dateParts[2]),
      Number(dateParts[1]) - 1,
      Number(dateParts[0]),
    )
    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0
    }
    if (cellDate < filterLocalDateAtMidnight) {
      return -1
    }
    if (cellDate > filterLocalDateAtMidnight) {
      return 1
    }
    return 0
  },
}

const FWAs = () => {
  let setValue = new Set()
  const gridRef = useRef()
  const [rowData, setRowData] = useState([])
  const [loading, setLoading] = useState(true)
  const [ColData, setColData] = useState([])
  const [checkBox, setCheckbox] = useState([])
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'Date',
      field: 'nextDate',
      colId: 'Date',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
      cellRenderer: getTime,
    },
    {
      headerName: 'Status',
      field: 'fwaStatusString',
      colId: 'Status',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
    },
    {
      headerName: 'Submitted Through',
      field: 'lastSubmittedDate',
      colId: 'SubmittedThrough',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
      cellRenderer: getTime,
    },
    {
      headerName: 'Approved Through',
      field: 'lastSubmittedDate',
      colId: 'ApprovedThrough',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
      cellRenderer: getTime,
    },
    {
      headerName: 'Recur',
      field: 'recurrCt',
      colId: 'Recur',
      width: 50,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
    },
    {
      headerName: 'Recur End',
      field: 'RecurrenceEndDate',
      colId: 'RecurEnd',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
      cellRenderer: getTime,
    },
    {
      headerName: 'Attach Count',
      field: 'attachmentCtDoc',
      colId: 'AttachCount',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
    },
    {
      headerName: 'FWA Name',
      field: 'fwaName',
      colId: 'FWAName',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
    },
    {
      headerName: 'FWA',
      field: 'fwaNum',
      colId: 'FWA',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
    },
    {
      headerName: 'Avail',
      field: 'availableForUseInField',
      colId: 'Avail',
      width: 100,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
      cellRenderer: CheckboxData,
    },
    {
      headerName: 'Contr',
      field: 'isContractWork',
      colId: 'Contr',
      width: 100,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
      cellRenderer: CheckboxData,
    },
    {
      headerName: 'Total Hours',
      field: 'hours',
      colId: 'TotalHours',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
      cellRenderer: TotalHours,
    },
    {
      headerName: 'Total Ovt. Hours',
      field: 'hours',
      colId: 'OvtHour',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
      cellRenderer: TotalHours,
    },
    {
      headerName: 'Travel Hours',
      field: 'hours',
      colId: 'TravelHour',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
      cellRenderer: TotalHours,
    },
    {
      headerName: 'Field Priority',
      field: 'fieldPriorityId',
      colId: 'FieldPriority',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
      lockVisible: true,
      cellClass: 'locked-visible',
      cellRenderer: getBackgroundColor,
    },
    {
      headerName: 'Crew',
      field: 'scheduledCrewName',
      colId: 'Crew',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
    },
    {
      headerName: 'Client',
      field: 'clientName',
      colId: 'Client',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
    },
    {
      headerName: 'Project',
      field: 'wbs1',
      colId: 'Project',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
    },
    {
      headerName: 'Project Name',
      field: 'wbs1Name',
      colId: 'ProjectName',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
    },
    {
      headerName: 'Phase',
      field: 'wbs2',
      colId: 'Phase',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
    },
    {
      headerName: 'Phase Name',
      field: 'wbs2Name',
      colId: 'PhaseName',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
    },
    {
      headerName: 'Task',
      field: 'wbs3',
      colId: 'Task',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
    },
    {
      headerName: 'Task Name',
      field: 'wbs3Name',
      colId: 'TaskName',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
    },
    {
      headerName: 'City',
      field: 'city',
      colId: 'City',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
    },
    {
      headerName: 'State',
      field: 'state',
      colId: 'State',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
    },
    {
      headerName: 'Zip',
      field: 'zip',
      colId: 'Zip',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
    },
    {
      headerName: 'Ordered By',
      field: 'wbs1Name',
      colId: 'OrderedBy',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
    },
    {
      headerName: 'Site Name',
      field: 'udf_a1',
      colId: 'SiteName',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
    },
    {
      headerName: 'Agency',
      field: 'udf_a2',
      colId: 'Agency',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
    },
    {
      headerName: 'Contract',
      field: 'udf_a3',
      colId: 'Contract',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
    },
    {
      headerName: 'Long Label',
      field: 'udf_a4',
      colId: 'LongLabel',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
    },
    {
      headerName: 'Trailer',
      field: 'udf_a5',
      colId: 'Trailer',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
    },
    {
      headerName: 'Gate#',
      field: 'udf_a6',
      colId: 'Gate',
      width: 150,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,
    },
    {
      headerName: 'Map',
      field: 'map',
      colId: 'Map',
      width: 70,
      suppressSizeToFit: true,
      filter: CustomFilter,
      sortable: true,
      status: true,

      cellRenderer: MapIcon,
    },
  ])

  const defaultColDef = useMemo(() => {
    return {
      resizable: true,
    }
  }, [])

  useEffect(() => {
    // setLoading(true)
    setColData(columnDefs)
    axios
      .post(baseUrl, apiPayload)
      .then((response) => {
        if (response.data) {
          // console.log(Decompress(response.data[0].result.data))
          setRowData(Decompress(response.data[0].result.data))
          setLoading(false)
        }
      })
      .catch((err) => {
        setLoading(false)
        console.log(err)
      })
  }, [])

  return (
    // Main Content------------
    <div class="container-fluid my-0">
      {/* Page Heading  ---------*/}
      <div class="d-sm-flex align-items-center justify-content-between mb-2 mt-0">
        <h1 class="h5 mb-0">FWAs</h1>
        <div>
          {/* <a
           onClick={after2010}
            class="btn btn-sm btn-secondary shadow-sm ml-2"
          >
            New FWA
          </a> */}
          <a href="#" class="btn btn-sm btn-secondary shadow-sm ml-2">
            Print All
          </a>
          <a href="#" class="btn btn-sm btn-secondary shadow-sm ml-2">
            Maps
          </a>
        </div>
      </div>
      <div>
        {/* <input type="checkbox" onChange={(e)=>RemoveDef(e,"nextDate")}/> date
        <input type="checkbox" onChange={(e)=>RemoveDef(e,"fwaStatusString")}/> status */}
      </div>

      {/* Card Content------- */}
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center spinner"
          style={{ height: '70vh' }}
        >
          <div class="bounce1"></div>
          <div class="bounce2"></div>
          <div class="bounce3"></div>
        </div>
      ) : (
        <Card>
          <div className="mt-1 mx-2 d-flex justify-content-end align-items-center">
            <div className="">
              <strong>FWA Record Count: {rowData.length}</strong>{' '}
            </div>
          </div>
          <Card.Body className="p-1">
            <div className="row">
              <div
                className="ag-theme-alpine col-12"
                style={{ height: '79vh' }}
              >
                <AgGridReact
                  //  pagination={true}

                  defaultColDef={defaultColDef}
                  ref={gridRef}
                  rowData={rowData}
                  columnDefs={columnDefs}
                  onGridReady={rowData}
                  pagination={true}
                  paginationPageSize={10}
                ></AgGridReact>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
    // <div className='row'>
    //    <div className='col-12'>
    //        <AGCommonTable

    //             rowData={rowData}
    //             columnDefs={columnDefs}

    //             onGridReady={onGridReady}
    //             pagination={true}
    //             paginationPageSize={10}

    //           >
    //        </AGCommonTable>
    //    </div>
    //    </div>
  )
}

export default FWAs
