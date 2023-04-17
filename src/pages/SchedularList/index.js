import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { Card } from 'react-bootstrap'
import CustomFilter from './CustomFilter'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import axios from 'axios'
import CustomTooltip from './customTooltip'
import data from "./tabledata.json"


const SchedularList = () => {
  const gridRef = useRef()
  const [rowData, setRowData] = useState([])
  const [loading, setLoading] = useState(true)
  const [ColData, setColData] = useState([])
  const [columnDefs, setColumnDefs] = useState([
    {
      field: 'athlete',
      colId: 'athlete',
      sortable: true,
      filter: CustomFilter,
      status: true,
      tooltipField: 'athlete',
    },
    {
      field: 'age',
      colId: 'age',
      sortable: true,
      width: 90,
      filter: CustomFilter,
      status: true,
    },
    {
      field: 'country',
      colId: 'country',
      sortable: true,
      filter: CustomFilter,
      status: true,
    },
    {
      headerComponentParams: {
        template: `<div class="text-center" style=" writing-mode: vertical-lr;text-orientation: upright;">Year</div>`,
      },
      field: 'year',
      colId: 'year',
      width: 70,
      sortable: true,
      filter: CustomFilter,
      status: true,
    },
    {
      field: 'date',
      colId: 'date',
      sortable: true,
      filter: CustomFilter,
      status: true,
    },
    {
      field: 'sport',
      colId: 'sport',
      sortable: true,
      filter: CustomFilter,
      status: true,
    },
    {
      field: 'gold',
      colId: 'gold',
      sortable: true,
      filter: CustomFilter,
      status: true,
    },
    {
      field: 'silver',
      colId: 'silver',
      sortable: true,
      filter: CustomFilter,
      status: true,
    },
    {
      field: 'bronze',
      colId: 'bronze',
      sortable: true,
      filter: CustomFilter,
      status: true,
    },
    {
      field: 'total',
      colId: 'total',
      sortable: true,
      filter: CustomFilter,
      status: true,
    },
  ])

  const defaultColDef = useMemo(() => {
    return {
      resizable: true,
      tooltipComponent: CustomTooltip,
      editable: true,
    }
  }, [])

  useEffect(() => {
    // setLoading(true)
    setColData(columnDefs)
    axios
      .post('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .then((response) => {
        if (response.data) {
          console.log(response.data)
          setRowData(response.data)
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
        <h1 class="h5 mb-0">Schedular List</h1>
        <div>
          <a class="btn btn-sm btn-secondary shadow-sm ml-2">New FWA</a>
          <a href="#" class="btn btn-sm btn-secondary shadow-sm ml-2">
            Print All
          </a>
          <a href="#" class="btn btn-sm btn-secondary shadow-sm ml-2">
            Maps
          </a>
        </div>
      </div>
      <div></div>

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
              <strong>Schedular List Record Count: {rowData.length}</strong>{' '}
            </div>
          </div>
          <Card.Body className="p-1">
            <div className="row">
              <div
                className="ag-theme-alpine col-12"
                style={{ height: '79vh' }}
              >
                <AgGridReact
                  // pagination={true}
                  defaultColDef={defaultColDef}
                  ref={gridRef}
                  rowData={data}
                  columnDefs={columnDefs}
                  onGridReady={rowData}
                  // paginationPageSize={10}
                  tooltipShowDelay={200}
                  tooltipHideDelay={2000}
                  headerHeight={130}
                ></AgGridReact>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  )
}

export default SchedularList
