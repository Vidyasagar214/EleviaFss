import React, { useState, useEffect } from 'react'
import FWANew from '../FWANew/FWANew'
import FWAs from '../FWAs'
import SchedularList from '../SchedularList'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { Modal, Button } from 'react-bootstrap'

const GlobalPage = () => {
  const navigate = useNavigate()

  const [Scheduler, setScheduler] = useState('collapsed'),
    [SchedulerItem, setSchedulerItem] = useState(''),
    [Expenses, setExpenses] = useState('collapsed'),
    [ExpensesItem, setExpensesItem] = useState(''),
    [Timesheet, setTimesheet] = useState('collapsed'),
    [TimesheetItem, setTimesheetItem] = useState(''),
    [Crew, setCrew] = useState('collapsed'),
    [CrewItem, setCrewItem] = useState(''),
    [FWA, setFWA] = useState('collapsed'),
    [FWAItem, setFWAItem] = useState(''),
    [userstyle, setUserstyle] = useState(''),
    [userlogoutstyle, setUserlogoutstyle] = useState('novisible')

  const [active, setActive] = useState('')
  const [show, setShow] = useState(false)

  const handleUser = (e) => {
    e.preventDefault()
    if (userstyle != '') {
      setUserstyle('')
    } else setUserstyle('show')
  }

  const handleUserLogout = (e) => {
    e.preventDefault()
    if (userlogoutstyle == 'novisible') {
      setUserlogoutstyle('show showvisible')
    } else setUserlogoutstyle('novisible')
  }

  const handleChange = (e) => {
    if (e === 'Scheduler') {
      if (Scheduler != '') {
        setScheduler('')
      } else setScheduler('collapsed')
      if (SchedulerItem == '') {
        setSchedulerItem('show')
      } else setSchedulerItem('')
    }
    if (e === 'Expenses') {
      if (Expenses != '') {
        setExpenses('')
      } else setExpenses('collapsed')
      if (ExpensesItem == '') {
        setExpensesItem('show')
      } else setExpensesItem('')
    }
    if (e === 'Timesheet') {
      if (Timesheet != '') {
        setTimesheet('')
      } else setTimesheet('collapsed')
      if (TimesheetItem == '') {
        setTimesheetItem('show')
      } else setTimesheetItem('')
    }
    if (e === 'Crew') {
      if (Crew != '') {
        setCrew('')
      } else setCrew('collapsed')
      if (CrewItem == '') {
        setCrewItem('show')
      } else setCrewItem('')
    }
    if (e === 'FWA') {
      if (FWA != '') {
        setFWA('')
      } else setFWA('collapsed')
      if (FWAItem == '') {
        setFWAItem('show')
      } else setFWAItem('')
    }
  }

  const SchedularToggle = React.forwardRef(({ onClick }) => (
    <Link
      className="d-block justify-content-center cursor-pointer text-white mt-3 dropdown"
      onClick={(e) => {
        e.preventDefault()
        onClick(e)
        setActive('schedular')
      }}
    >
      <i
        className="fas fa-fw fa-clock fa-lg dropdown-icon p-0 active"
        style={{ color: active === 'schedular' && 'white' }}
      ></i>
      <p> Schedular</p>
    </Link>
  ))
  const CrewToggle = React.forwardRef(({ onClick }) => (
    <span
      className="d-block justify-content-center cursor-pointer text-white mt-2 dropdown"
      onClick={(e) => {
        e.preventDefault()
        onClick(e)
        setActive('crew')
      }}
    >
      <i
        className="fas fa-fw fa-users fa-lg dropdown-icon p-0"
        style={{ color: active === 'crew' && 'white' }}
      ></i>
      <p> Crew</p>
    </span>
  ))
  const FwaToggle = React.forwardRef(({ onClick }) => (
    <NavLink
      className="d-block justify-content-center cursor-pointer text-white mt-2 dropdown"
      onClick={(e) => {
        e.preventDefault()
        onClick(e)
        setActive('fwa')
      }}
    >
      <i
        className="fas fa-fw fa-tasks fa-lg dropdown-icon p-0"
        style={{ color: active === 'fwa' && 'white' }}
      ></i>
      <p> FWA</p>
    </NavLink>
  ))
  const TimesheetToggle = React.forwardRef(({ onClick }) => (
    <span
      className="d-block justify-content-center cursor-pointer text-white mt-2 dropdown"
      onClick={(e) => {
        e.preventDefault()
        onClick(e)
        setActive('timesheet')
      }}
    >
      <i
        className="fas fa-fw fa-calendar-alt fa-lg dropdown-icon p-0"
        style={{ color: active === 'timesheet' && 'white' }}
      ></i>
      <p> Timesheet</p>
    </span>
  ))
  const ExpensesToggle = React.forwardRef(({ onClick }) => (
    <span
      className="d-block justify-content-center cursor-pointer text-white mt-2 dropdown"
      onClick={(e) => {
        e.preventDefault()
        onClick(e)
        setActive('expenses')
      }}
    >
      <i
        className="fas fa-fw fa-hand-holding-usd fa-lg dropdown-icon p-0"
        style={{ color: active === 'expenses' && 'white' }}
      ></i>
      <p> Expenses</p>
    </span>
  ))
  const EmployeeToggle = React.forwardRef(() => (
    <Link
      className="d-block justify-content-center cursor-pointer text-white  mt-2 dropdown"
      to="/employeevailable"
      onClick={(e) => {
        setActive('employee')
      }}
    >
      <i
        className="fas fa-fw fa-user fa-xl  dropdown-icon p-0"
        style={{ color: active === 'employee' && 'white' }}
      ></i>
      <p> Employee Availability</p>
    </Link>
  ))
  const UtilityToggle = React.forwardRef(() => (
    <NavLink
      className="d-block justify-content-center cursor-pointer text-white mt-2 dropdown"
      to="/utilities"
      onClick={(e) => {
        setActive('utilities')
      }}
    >
      <i
        className="fas fa-fw fa-wrench fa-lg dropdown-icon p-0"
        style={{ color: active === 'utilities' && 'white' }}
      ></i>
      <p> Utilities</p>
    </NavLink>
  ))

  const logoutHandle = () => {
    navigate('/')
    setShow(false)
  }

  return (
    <>
      <div id="wrapper">
        {/* Sidebar */}
        <ul
          className="navbar-nav bg-brand sidebar sidebar-dark accordion toggled text-center"
          id="accordionSidebar"
        >
          {/* Sidebar - Brand */}
          <Link
            className="sidebar-brand bg-white d-flex align-items-center justify-content-center m-0 py-0 px-1"
            to="/dashboard"
          >
            <img src="img/elevia-logo-white.png" className="img-fluid" />
          </Link>

          {/* Divider */}
          <hr className="sidebar-divider my-0 mx-1 bg-light opacity-50" />

          <Dropdown>
            <Dropdown.Toggle
              as={SchedularToggle}
              id="dropdown-custom-components"
            ></Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.ItemText>
                {' '}
                <h6 className="collapse-header">Scheduler</h6>
              </Dropdown.ItemText>
              <Dropdown.Item className="collapse-item">
                {' '}
                <Link to="/dashboard">
                  <p className="m-0">Calendar View</p>
                </Link>
              </Dropdown.Item>
              <Dropdown.Item className="collapse-item">
                <Link to="/schedularlist">
                  <p className="m-0">List View</p>
                </Link>
              </Dropdown.Item>
              <Dropdown.Item className="collapse-item">
                {' '}
                <Link to="/dashboard">
                  <p className="m-0">Employee Schedule</p>
                </Link>
              </Dropdown.Item>
              <Dropdown.Item className="collapse-item">
                <Link to="/dashboard">
                  <p className="m-0">Crew Task</p>
                </Link>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Toggle
              as={CrewToggle}
              id="dropdown-custom-components"
              className="dropdown-header"
            ></Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.ItemText>
                {' '}
                <h6 className="collapse-header">Crew</h6>
              </Dropdown.ItemText>
              <Dropdown.Item className="collapse-item">
                {' '}
                <Link to="/dashboard">
                  <p className="m-0">Crew</p>
                </Link>
              </Dropdown.Item>
              <Dropdown.Item className="collapse-item">
                <Link to="/dashboard">
                  <p className="m-0">Crew Assign</p>
                </Link>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Toggle
              as={FwaToggle}
              id="dropdown-custom-components"
              className="dropdown-header"
            ></Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.ItemText>
                {' '}
                <h6 className="collapse-header">FWA</h6>
              </Dropdown.ItemText>
              <Dropdown.Item className="collapse-item">
                {' '}
                <Link to="/fwas">
                  <p className="m-0">FWAs</p>
                </Link>
              </Dropdown.Item>
              <Dropdown.Item className="collapse-item">
                <Link to="/fwanew">
                  <p className="m-0">New FWA</p>
                </Link>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Toggle
              as={TimesheetToggle}
              id="dropdown-custom-components"
              className="dropdown-header"
            ></Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.ItemText>
                {' '}
                <h6 className="collapse-header">Timesheet</h6>
              </Dropdown.ItemText>
              <Dropdown.Item className="collapse-item">
                {' '}
                <Link to="/dashboard">
                  <p className="m-0">Timesheet</p>
                </Link>
              </Dropdown.Item>
              <Dropdown.Item className="collapse-item">
                <Link to="/dashboard">
                  <p className="m-0">Timesheet Approval</p>
                </Link>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown>
            <Dropdown.Toggle
              as={ExpensesToggle}
              id="dropdown-custom-components"
              className="dropdown-header"
              active
            ></Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.ItemText>
                {' '}
                <h6 className="collapse-header">Expenses</h6>
              </Dropdown.ItemText>
              <Dropdown.Item className="collapse-item">
                {' '}
                <Link to="/dashboard">
                  <p className="m-0">Expenses</p>
                </Link>
              </Dropdown.Item>
              <Dropdown.Item className="collapse-item">
                <Link to="/dashboard">
                  <p className="m-0">Expenses Approval</p>
                </Link>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown>
            <Dropdown.Toggle
              as={EmployeeToggle}
              id="dropdown-custom-components"
              className="dropdown-header"
            ></Dropdown.Toggle>
          </Dropdown>
          <Dropdown>
            <Dropdown.Toggle
              as={UtilityToggle}
              id="dropdown-custom-components"
              className="dropdown-header"
            ></Dropdown.Toggle>
          </Dropdown>
        </ul>
        {/* End of Sidebar */}

        {/* Content Wrapper */}
        <div id="content-wrapper" className="d-flex flex-column">
          {/* Main Content */}
          <div id="content">
            {/* <!-- Topbar Navbar --> */}
            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-2 static-top shadow-sm">
              <div>
                <h5 className="color-brand mb-1">Field Services Suite</h5>
              </div>

              <ul className="navbar-nav ml-auto">
                <li className="nav-item ">
                  <span className="text-dark mr-3 d-lg-inline text-gray-600">
                    Apple, William
                  </span>
                  <span className="text-black-50 cursor-pointer">
                    <i className="fas fa-cogs fa-lg fa-fw mr-2"></i>
                  </span>
                  <span
                    className="text-black-50 cursor-pointer"
                    onClick={() => setShow(true)}
                  >
                    <i className="fas fa-sign-out-alt fa-lg fa-fw mr-3"></i>
                  </span>
                </li>
              </ul>
            </nav>

            {/* Begin Page Content */}
            <div className="">
              {/* Content Row */}
              {window.location.pathname === '/dashboard' ? (
                <div className="row">
                  <div className="col text-center">
                    <h2 className="text-gray-500">Welcome</h2>
                    <h4>Apple, William</h4>
                  </div>
                </div>
              ) : window.location.pathname === '/fwanew' ? (
                <FWANew />
              ) : window.location.pathname === '/fwas' ? (
                <FWAs />
              ) : window.location.pathname === '/schedularlist' ? (
                  <SchedularList />
              ) : (
                <></>
              )}

              {/* Content Row */}

              {/* Content Row */}
            </div>
            {/* /.container-fluid */}
          </div>
          {/* End of Main Content */}
        </div>
        {/* End of Content Wrapper */}
      </div>

      {/* Logout Modal------------- */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header className="d-flex align-items-center justify-content-between">
          <Modal.Title>
            <h5 className="modal-title" id="exampleModalLabel">
              Ready to Leave?
            </h5>
          </Modal.Title>
          <button className="close" type="button" onClick={() => setShow(false)}>
            <span aria-hidden="true">×</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          Select "Logout" below if you are ready to end your current session.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={logoutHandle}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  )
}

export default GlobalPage
