import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
} from 'react'
import { Dropdown, ListGroup, Form } from 'react-bootstrap'
import { textFieldFilter, dateFieldFilter } from './filterFields'

export default forwardRef((props, ref) => {
  const [filterText, setFilterText] = useState(null)
  const [dateValue, setDateValue] = useState({
    fromDate: '',
    toDate: '',
  })

  const refFlatPickr = useRef(null)

  const onSortRequested = (order, event) => {
    props.columnApi.applyColumnState({
      state: [{ colId: props.colDef.colId, sort: order }],
      defaultState: { sort: null },
    })
  }

  useEffect(() => {
    props.filterChangedCallback()
  }, [dateValue.fromDate, dateValue.toDate])
  // custom text filter ********************************
  useImperativeHandle(ref, () => {
    return {
      doesFilterPass(params) {
        const { api, colDef, column, columnApi, context } = props
        const { node } = params
        let passed = true
        filterText
          .toLowerCase()
          .split(' ')
          .forEach((filterWord) => {
            const value = props.valueGetter({
              api,
              colDef,
              column,
              columnApi,
              context,
              data: node.data,
              getValue: (field) => node.data[field],
              node,
            })
            if (value.toString().toLowerCase().indexOf(filterWord) < 0) {
              passed = false
            }
          })
        return passed
      },
      isFilterActive() {
        return filterText != null && filterText !== ''
      },
      getModel() {},

      setModel() {},
    }
  })

  const onChange = (event) => {
    setFilterText(event.target.value)
  }

  useEffect(() => {
    props.filterChangedCallback()
  }, [filterText])

  const CustomColumnToggle = React.forwardRef(({ children, onClick }, ref) => (
    <p
      className="m-0"
      style={{ padding: '0.75rem 0px' }}
      ref={ref}
      onClick={(e) => {
        e.preventDefault()
        onClick(e)
      }}
    >
      {children}
      <span style={{ float: 'right', padding: '2px' }}> &#9654;</span>
    </p>
  ))

  // Date Handler*******************************
  let dateHandler = (event) => {
    setDateValue((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  // console.log('data', props.rowModel.getRootNode().allLeafChildren)

  useEffect(() => {
    let FilterData = props.rowModel.getRootNode().allLeafChildren
    if (dateValue.toDate && dateValue.fromDate) {
      let newDateTo = new Date(dateValue.toDate)
      let fromDateNew = new Date(dateValue.fromDate)
      let FilteredData = FilterData.filter((x) => {
        let DateDulp = x.data.date
        let dateNode = new Date(DateDulp)
        console.log("dcfvg",dateNode)
        return dateNode >= fromDateNew && dateNode <= newDateTo
      })
      console.log("filterData",FilteredData)
      if (FilteredData.length > 0) {
        let NewRowdata = []
        FilteredData.map((x) => {
          NewRowdata.push(x.data)
        })
        props.api.setRowData(NewRowdata)
      }
    }
  }, [dateValue.fromDate, dateValue.toDate])

  let checkBoxHideShow = (e, index) => {
    let allData = props.columnApi.columnModel.columnDefs
    console.log('ColumnDefikhgvcfvgbh', allData)
    let filterdArray = []
    if (e.target.checked) {
      allData[index].status = e.target.checked
      let filteredData = allData.filter((x) => x.status == true)
      filteredData.map((x) => {
        let colid = x.colId
        filterdArray.push(colid)
      })
      props.columnApi.setColumnsVisible(filterdArray, true)
    } else {
      allData[index].status = e.target.checked
      allData[index].status = e.target.checked
      let filteredData = allData.filter((x) => x.status == false)

      filteredData.map((x) => {
        let colid = x.colId
        filterdArray.push(colid)
      })
      props.columnApi.setColumnsVisible(filterdArray, false)
    }
    props.api.setColumnDefs(allData)
  }

  let filterDropdown = () => {
    switch (props.colDef.colId) {
      case 'date':
        return dateFieldFilter(dateValue, dateHandler)
        break
      case 'country':
        return textFieldFilter(filterText, onChange)
      case 'athlete':
        return textFieldFilter(filterText, onChange)
      case 'sport':
        return textFieldFilter(filterText, onChange)
    }
  }

  return (
    <div
      className="ag-input-wrapper custom-filter custom-date-filter"
      role="presentation"
      ref={refFlatPickr}
    >
      <ListGroup as="ul" className="list">
        <ListGroup.Item
          as="li"
          action
          className="cursor-pointer px-1"
          onClick={(event) => onSortRequested('asc', event)}
        >
          <i class="fas fa-long-arrow-alt-up   mr-2 mt-1 text-gray-600 "></i>
          Sort Ascending
        </ListGroup.Item>
        <ListGroup.Item
          as="li"
          action
          className="cursor-pointer px-1"
          onClick={(event) => onSortRequested('desc', event)}
        >
          <i class="fas fa-long-arrow-alt-down   mr-2 mt-1 text-gray-600 "></i>
          Sort Descending
        </ListGroup.Item>
        <ListGroup.Item
          as="li"
          action
          className="cursor-pointer px-1"
          style={{ padding: '0px' }}
        >
          <Dropdown drop="end">
            <Dropdown.Toggle as={CustomColumnToggle} id="dropdownCustomColumn">
              <i class="fas fa-table  mr-2 mt-1 text-gray-600 "></i>
              Columns
            </Dropdown.Toggle>
            <Dropdown.Menu
              style={{
                height: '320px',
                overflowY: 'auto',
                border: '1px solid lightgray',
              }}
            >
              {props.columnApi.columnModel.columnDefs.map((data, index) => {
                return (
                  <p className="ml-4">
                    <input
                      type="checkbox"
                      onChange={(e) => checkBoxHideShow(e, index)}
                      defaultChecked={data.status}
                    />{' '}
                    {data.field}
                  </p>
                )
              })}
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>

        {filterDropdown()}
      </ListGroup>
    </div>
  )
})
