import { Dropdown, ListGroup, Form } from 'react-bootstrap'

export let textFieldFilter = (filterText, onChange) => {
  return (
    <ListGroup.Item
      as="li"
      action
      className="cursor-pointer px-1"
      style={{ padding: '0px', lineHeight: '12px' }}
    >
      <Dropdown className="d-inline mx-2" autoClose="outside" drop="end">
        <Dropdown.Toggle
          id="dropdown-autoclose-outside"
          variant="white"
          as="p"
          style={{ margin: '0px' }}
        >
          <i class="fas fa-filter  mr-2 mt-1 text-gray-600 "></i>
          Filter <span className="float-right pt-1">&#9654;</span>
        </Dropdown.Toggle>

        <Dropdown.Menu className="ml-1">
          <span className="d-flex align-items-center px-1">
            <i class="fas fa-search  mr-2  text-gray-600 "></i>
            <Form.Control
              autoFocus
              type="search"
              className="m-1 "
              size="sm"
              placeholder="Type to filter..."
              value={filterText}
              onChange={onChange}
              style={{ width: '150px' }}
            />
          </span>
        </Dropdown.Menu>
      </Dropdown>
    </ListGroup.Item>
  )
}

export let dateFieldFilter = (dateValue, dateHandler) => {
  return (
    <ListGroup.Item
      as="li"
      key="4"
      action
      className="cursor-pointer px-1"
      style={{ padding: '0px', lineHeight: '12px' }}
    >
      <Dropdown className="d-inline mx-2" autoClose="outside" drop="end">
        <Dropdown.Toggle
          id="dropdown-autoclose-outside"
          variant="white"
          as="p"
          style={{ margin: '0px' }}
        >
          <i class="fas fa-filter  mr-2 mt-1 text-gray-600 "></i>
          Filter <span className="float-right pt-1">&#9654;</span>
        </Dropdown.Toggle>

        <Dropdown.Menu className="ml-1">
          <span className="px-2">
            <p className="mx-1 my-2 ">From Date:</p>
            <Form.Control
              autoFocus
              type="date"
              className="m-2"
              size="sm"
              placeholder="Type to filter..."
              name="fromDate"
              value={dateValue.fromDate}
              onChange={dateHandler}
              style={{ width: '150px' }}
            />

            <p className="mx-1 my-2">To Date:</p>
            <Form.Control
              autoFocus
              type="date"
              className="mx-2"
              size="sm"
              placeholder="Type to filter..."
              name="toDate"
              value={dateValue.toDate}
              min={dateValue.fromDate}
              onChange={dateHandler}
              style={{ width: '150px' }}
            />
          </span>
        </Dropdown.Menu>
      </Dropdown>
    </ListGroup.Item>
  )
}
