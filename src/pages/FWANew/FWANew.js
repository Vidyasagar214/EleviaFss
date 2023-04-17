import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaClock, FaUsers, FaGlobe, FaTasks, FaHandHoldingUsd, FaUser, FaWrench } from 'react-icons/fa';
import { SlCalender } from 'react-icons/sl';
import { BsFillClockFill } from 'react-icons/bs';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
//import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro'
//import './homepage.css'

// var Scheduler = "collapsed";
//     var SchedulerItem = "";
const FWANew = () => {
    const [domainAuth, setDomainAuth] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [Scheduler, setScheduler] = useState("collapsed");
    const [SchedulerItem, setSchedulerItem] = useState("");
    const [userstyle, setUserstyle] = useState("");

    const handleClick = (e) => {
        e.preventDefault();
        console.log("handleClick");
        axios
            .post('https://demo3.eleviasoftware.com/FieldServices.75.BL/DirectRouter/Index',
                { "action": "User", "method": "Login", "data": ["lqcWVYFl7qoQ7P0dg__a2bfnUSmyaXw4Ed__a2bIqSG2wcF__a2fWVRFQCQFpk4aeljEzVgKiUQ__a2brYrc7hz__a2fQcNWf0c2qQqlLj5bTp7aFcyTuJN3BrNc1TcHYPD5T__a2fB9qg5iLGyaChUMhCRaGWUL5rnXQZAWR9w7Vfm038jKkSxxJNjXemiVjMe4beBOPFUn__a2bwTxORkIlRXdMxMcusZ1Lm__a2fsZgBnvotaXg__a3d__a3d", "ADMIN", "62065038895f9f01e2d52f600a583458b00c23e5bef68d1890961d76b5efdc6b", "_none_", "N"], "type": "rpc", "tid": 2 })
            .then((response) => {
                console.log("responsee", response.data.result)
                if (response != null) {
                    if (response?.data?.result?.success) {
                        setIsLoggedIn(true);
                    }
                    else {
                        setIsLoggedIn(false);
                    }
                }
            });
    }

    useEffect(() => {
        axios
            .post('https://demo3.eleviasoftware.com/FieldServices.75.BL/DirectRouter/Index',
                { "action": "User", "method": "SupportIntegratedLogin", "data": ["en-US", "lqcWVYFl7qoQ7P0dg__a2bfnUSmyaXw4Ed__a2bIqSG2wcF__a2fWVRFQCQFpk4aeljEzVgKiUQ__a2brYrc7hz__a2fQcNWf0c2qQqlLj5bTp7aFcyTuJN3BrNc1TcHYPD5T__a2fB9qg5iLGyaChUMhCRaGWUL5rnXQZAWR9w7Vfm038jKkSxxJNjXemiVjMe4beBOPFUn__a2bwTxORkIlRXdMxMcusZ1Lm__a2fsZgBnvotaXg__a3d__a3d", "4.2.7.4-FSS1_VP55up-0220-75"], "type": "rpc", "tid": 1 })
            .then((response) => {
                console.log("domain-auth-response", response, response.data.result.data)
                if (response != null) {
                    if (response?.data?.result?.data == 'Y') {
                        setDomainAuth(true);
                    }
                    else {
                        setDomainAuth(false);
                    }
                }
            });
    }, [])

    const handleUser = (e) => {
        e.preventDefault();
        console.log("handleUser", e, userstyle);
            if (userstyle != "") {
                setUserstyle("");
            } else setUserstyle("show");
    }
    console.log("userstyle", userstyle);
    const handleChange = (e) => {
        //e.preventDefault();
        console.log("csschange", e);
        // if (e === "user") {
        //     if (userStyle != "") {
        //         setUserStyle("show");
        //     } else setUserStyle("");
        // }
        if(e === "Scheduler")
        {
        if (Scheduler != "") {
            setScheduler("");
        } else setScheduler("collapsed");
        if (SchedulerItem == "") {
            setSchedulerItem("show");
        } else setSchedulerItem("");
        console.log("newcsschange11", SchedulerItem, Scheduler);
        }
    }
    console.log("newcsschange", SchedulerItem, Scheduler, userstyle);
    return (
      <>
                {/* Begin Page Content */}
                <div class="container-fluid">

                    {/* Page Heading */}
                    <div class="d-sm-flex align-items-center justify-content-between mb-3">
                        <h1 class="h5 mb-0">New FWA</h1>
                        <div>
                          <a href="#" class="btn btn-sm btn-secondary shadow-sm ml-2">Search</a>
                          <a href="#" class="btn btn-sm btn-secondary shadow-sm ml-2">Attach Doc</a>
                          <a href="#" class="btn btn-sm btn-secondary shadow-sm ml-2">Attach Photo</a>
                          <a href="#" class="btn btn-sm btn-secondary shadow-sm ml-2">Update</a>
                          <a href="#" class="btn btn-sm btn-secondary shadow-sm ml-2">Save</a>
                        </div>
                        
                    </div>

                    {/* Content Row */}
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="card shadow-sm mb-3">
                                <div class="card-header p-2">
                                    <h6 class="m-0 font-weight-bold">Field Work Assignment</h6>
                                </div>
                                <div class="card-body p-1">
                                   
                                        <div class="row">
                                          <div class="col-sm-3 d-flex align-items-center">
                                            <label for="inputEmail3" class="col-4 col-form-label pl-1">FWA#</label>
                                            <input type="text" class="form-control form-control-sm" id="inputEmail3"/>
                                          </div>
                                          <div class="col-sm-3 d-flex align-items-center">
                                            <label for="inputEmail3" class="col-5 col-form-label ">FWA Name</label>
                                            <input type="text" class="form-control form-control-sm" id="inputEmail3"/>
                                          </div>
                                          <div class=" col-sm-0 form-check form-check-inline">
                                            <label class="form-check-label mr-1" for="defaultCheck1">
                                                Available
                                              </label>
                                            <input class="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                                          </div>
                                          <div class="col-sm-2 d-flex align-items-center justify-content-center">
                                            <label for="inputEmail3" class=" col-form-label ">Status: Creating</label>
                                          </div>

                                          <div class="col-sm-3 d-flex align-items-center">
                                            <label for="inputEmail3" class="col-5 col-form-label">FWA Name</label>
                                             <select class="form-control form-control-sm">
                                                <option  value="">As Scheduled</option>
                                              </select>
                                            <i class="fas fa-fw fa-folder ml-2" 
                                            //style="font-size: 25px; color: rgb(18, 18, 112);"
                                            ></i> 
                                        </div>
                                          
                                        </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12">
                            <div class="card shadow-sm mb-3">
                                <div class="card-header  p-2">
                                    <h6 class="m-0 font-weight-bold">General Information</h6>
                                </div>
                                <div class="card-body p-2">
                                    <div class="row">
                                        {/* 1 column--------------------------------------- */}
                                        <div class="col-4">
                                            <div class="form-group row">
                                                <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Project#</label>
                                                <div class="col-sm-8 d-flex">
                                                      <select class="form-control form-control-sm">
                                                        <option  value="">1999990.00</option>
                                                      </select>
                                                     <i class="fas fa-fw fa-search ml-2 mt-1" 
                                                     //style="font-size: 20px; color: rgb(87, 87, 88);"
                                                     ></i>
                                                   
                                                </div>
                                              </div>
                                              <div class="form-group row">
                                                <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Project Name</label>
                                                <div class="col-sm-8">
                                                  <input type="text" class="form-control form-control-sm" id="colFormLabelSm" value="Albert Bellfour Cole Plaza Study"/>
                                                </div>
                                              </div>
                                              <div class="form-group row">
                                                <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Company Name</label>
                                                <div class="col-sm-8">
                                                  <input type="email" class="form-control form-control-sm" id="colFormLabelSm" value="Atlantic Research Corporation"/>
                                                </div>
                                              </div>
                                              <div class="form-group row">
                                                <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Crew Name</label>
                                                <div class="col-sm-8 d-flex justify-content-end">
                                                    <i class="fas fa-fw fa-users ml-2 mt-1" 
                                                    //style="font-size: 20px; color: rgb(14, 14, 80);"
                                                    ></i>
                                                    
                                                </div>
                                              </div>
                                              <div class="form-group row">
                                                <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Request NO</label>
                                                <div class="col-sm-8">
                                                    <select class="form-control form-control-sm">
                                                        <option  value=""></option>
                                                      </select>
                                                </div>
                                              </div>
                                              <div class="form-group row">
                                                <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Agency Id</label>
                                                <div class="col-sm-8">
                                                  <input type="text" class="form-control form-control-sm" id="colFormLabelSm" />
                                                </div>
                                              </div>
                                              <div class="form-group row">
                                                <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Dispatch Notes</label>
                                                <div class="col-sm-8">
                                                    <select class="form-control form-control-sm">
                                                        <option  value=""></option>
                                                      </select>
                                                </div>
                                              </div>
                                        </div>
                                        {/* 2 column------------------------------------ */}
                                        <div class="col-4">
                                            <div class="form-group row">
                                                <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Phase</label>
                                                <div class="col-sm-8 d-flex">
                                                      <select class="form-control form-control-sm">
                                                        <option  value=""></option>
                                                      </select>
                                                </div>
                                              </div>
                                              <div class="form-group row">
                                                <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Phase Name</label>
                                                <div class="col-sm-8">
                                                  <input type="text" class="form-control form-control-sm" id="colFormLabelSm" />
                                                </div>
                                              </div>
                                              <div class="form-group row">
                                                <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Client Contact</label>
                                                <div class="col-sm-8">
                                                  <input type="email" class="form-control form-control-sm" id="colFormLabelSm" />
                                                </div>
                                              </div>
                                              <div class="form-group row">
                                                <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Signed & Dated</label>
                                                <div class="col-sm-8 d-flex justify-content-end">
                                                    <input type="email" class="form-control form-control-sm" id="colFormLabelSm" />
                                                </div>
                                              </div>
                                              <div class="form-group row">
                                                <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Crew Requested</label>
                                                <div class="col-sm-8">
                                                    <select class="form-control form-control-sm">
                                                        <option  value=""></option>
                                                      </select>
                                                </div>
                                              </div>
                                              <div class="form-group row">
                                                <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Agency Contact</label>
                                                <div class="col-sm-8">
                                                  <input type="text" class="form-control form-control-sm" id="colFormLabelSm" />
                                                </div>
                                              </div>
                                              <div class="form-group row">
                                                <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Dispatch type</label>
                                                <div class="col-sm-8">
                                                    <select class="form-control form-control-sm">
                                                        <option  value=""></option>
                                                      </select>
                                                </div>
                                              </div> 
                                        </div>
                                        {/* 3 column--------------------------------- */}
                                        <div class="col-4">
                                            <div class="form-group row">
                                                <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Task #</label>
                                                <div class="col-sm-8 d-flex">
                                                      <select class="form-control form-control-sm">
                                                        <option  value=""></option>
                                                      </select>                                                   
                                                </div>
                                              </div>
                                              <div class="form-group row">
                                                <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Task Name</label>
                                                <div class="col-sm-8">
                                                  <input type="text" class="form-control form-control-sm" id="colFormLabelSm" />
                                                </div>
                                              </div>
                                              <div class="form-group row">
                                                <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Schedule By</label>
                                                <div class="col-sm-8">
                                                    <select class="form-control form-control-sm">
                                                        <option  value="">Apple William</option>
                                                      </select> 
                                                </div>
                                              </div>
                                              <div class="form-group row d-flex justify-content-end" >
                                                <div class="form-check  form-check-inline" >
                                                    <label class="form-check-label mr-2" for="inlineCheckbox1"><small>WBS Locked</small></label>
                                                    <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1"/>
                                                  </div>
                                                  <div class="form-check form-check-inline">
                                                    <label class="form-check-label mr-2" for="inlineCheckbox2"><small>Contract?</small></label>
                                                    <input class="form-check-input" type="checkbox" id="inlineCheckbox2" value="option2"/>
                                                  </div>
                                                  <div class="form-check form-check-inline">
                                                    <label class="form-check-label mr-2" for="inlineCheckbox3"><small>Cert Req.</small></label>
                                                    <input class="form-check-input" type="checkbox" id="inlineCheckbox3" value="option3" /> 
                                                  </div>
                                              </div>
                                              <div class="form-group row " style={{height: "37px"}}>
                                               
                                              </div>
                                              <div class="form-group row">
                                                <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Agency Id</label>
                                                <div class="col-sm-8">
                                                  <input type="text" class="form-control form-control-sm" id="colFormLabelSm" />
                                                </div>
                                              </div>
                                              <div class="form-group row">
                                                <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Dispatch Notes</label>
                                                <div class="col-sm-8">
                                                    <select class="form-control form-control-sm">
                                                        <option  value=""></option>
                                                      </select>
                                                </div>
                                              </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                       
                        <div class="col-lg-12 ">
                          <nav>
                            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                              <button class="nav-link active" id="nav-all-tab" data-toggle="tab" data-target="#nav-all" type="button" role="tab" aria-controls="nav-all" aria-selected="true">All</button>
                              <button class="nav-link" id="nav-address-tab" data-toggle="tab" data-target="#nav-address" type="button" role="tab" aria-controls="nav-address" aria-selected="true">Work Address And Dates & Times</button>
                              <button class="nav-link" id="nav-code-tab" data-toggle="tab" data-target="#nav-code" type="button" role="tab" aria-controls="nav-code" aria-selected="false">Work Code & Units</button>
                              <button class="nav-link" id="nav-hours-tab" data-toggle="tab" data-target="#nav-hours" type="button" role="tab" aria-controls="nav-hours" aria-selected="false">Employee Hours</button>
                              {/* <button class="nav-link" id="nav-expenses-tab" data-toggle="tab" data-target="#nav-expenses" type="button" role="tab" aria-controls="nav-expenses" aria-selected="false">Employee Expenses</button> */}
                              <button class="nav-link" id="nav-sign-tab" data-toggle="tab" data-target="#nav-sign" type="button" role="tab" aria-controls="nav-sign" aria-selected="false">Signatures</button>
                              
                            </div>
                          </nav>
                          <div class="tab-content" id="nav-tabContent">
                            {/* Work Address And Dates & Times */}
                            <div class="tab-pane fade show active row" id="nav-address" role="tabpanel" aria-labelledby="nav-address-tab">
                                  {/* Work Address---------------------------- */}
                                  <div class="col-12">
                                    <div class="card shadow-sm mb-3 mt-2">
                                        <div class="card-header p-2">
                                            <h6 class="m-0 font-weight-bold">Work Address</h6>
                                        </div>
                                        <div class="card-body p-2">
                                            <div class="row d-flex justify-content-between">
                                                {/* 1 column--------------------------------------- */}
                                                <div class="col-6 pr-lg-5">
                                                      <div class="form-group row">
                                                        <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Address 1</label>
                                                        <div class="col-sm-8">
                                                          <input type="text" class="form-control form-control-sm" id="colFormLabelSm"/>
                                                        </div>
                                                      </div>
                                                      <div class="form-group row">
                                                        <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Address 2</label>
                                                        <div class="col-sm-8">
                                                          <input type="email" class="form-control form-control-sm" id="colFormLabelSm" />
                                                        </div>
                                                      </div>
                                                      <div class="form-group row">
                                                        <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">City </label>
                                                        <div class="col-sm-8">
                                                          <input type="text" class="form-control form-control-sm" id="colFormLabelSm"/>
                                                        </div>
                                                      </div>
                                                      <div class="form-group row">
                                                        <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">State</label>
                                                        <div class="col-sm-8">
                                                          <input type="text" class="form-control form-control-sm" id="colFormLabelSm"/>
                                                        </div>
                                                      </div>
                                                      <div class="form-group row">
                                                        <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Zip</label>
                                                        <div class="col-sm-8">
                                                          <input type="text" class="form-control form-control-sm" id="colFormLabelSm" />
                                                        </div>
                                                      </div>
                                                      <div class="form-group row">
                                                        <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Latitude</label>
                                                        <div class="col-sm-8">
                                                          <input type="text" class="form-control form-control-sm" id="colFormLabelSm"/>
                                                        </div>
                                                      </div>
                                                      <div class="form-group row">
                                                        <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Longitude </label>
                                                        <div class="col-sm-8">
                                                          <input type="text" class="form-control form-control-sm" id="colFormLabelSm"/>
                                                        </div>
                                                      </div>
                                                </div>
                                                {/* 2 column------------------------------------ */}
                                                <div class="col-6 pl-lg-5">
                                                    <div class="form-group row">
                                                        <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Site Name</label>
                                                        <div class="col-sm-8">
                                                          <input type="text" class="form-control form-control-sm" id="colFormLabelSm"/>
                                                        </div>
                                                      </div>
                                                      <div class="form-group row">
                                                        <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Agency</label>
                                                        <div class="col-sm-8">
                                                          <input type="email" class="form-control form-control-sm" id="colFormLabelSm" />
                                                        </div>
                                                      </div>
                                                      <div class="form-group row">
                                                        <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Contact </label>
                                                        <div class="col-sm-8">
                                                          <input type="text" class="form-control form-control-sm" id="colFormLabelSm"/>
                                                        </div>
                                                      </div>
                                                      <div class="form-group row">
                                                        <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Locale</label>
                                                        <div class="col-sm-8">
                                                          <input type="text" class="form-control form-control-sm" id="colFormLabelSm"/>
                                                        </div>
                                                      </div>
                                                      <div class="form-group row">
                                                        <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Trailer</label>
                                                        <div class="col-sm-8">
                                                          <input type="text" class="form-control form-control-sm" id="colFormLabelSm" />
                                                        </div>
                                                      </div>
                                                      <div class="form-group row">
                                                        <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Gate</label>
                                                        <div class="col-sm-8">
                                                          <input type="text" class="form-control form-control-sm" id="colFormLabelSm"/>
                                                        </div>
                                                      </div>
                                                      <div class="form-group row  ">
                                                        <div class=" col d-flex justify-content-end">
                                                            <button class="btn btn-info btn-sm">
                                                            <i class="fas fa-fw fa-map-marker-alt" 
                                                            //style="font-size: 15px; color: rgb(231, 231, 235);"
                                                            ></i>
                                                            Map Location
                                                        </button></div>
                                                      
                                                      </div>
                                                      </div>
                                                </div>
                                                
                                        </div>
                                    </div>
                                </div>

                                {/*   Date & Time-------------- */}
                                <div class="col-12">
                                    <div class="card shadow-sm mb-3 mt-1">
                                        <div class="card-header p-2">
                                            <h6 class="m-0 font-weight-bold">Dates & Times</h6>
                                        </div>
                                        <div class="card-body p-2">
                                            <div class="row d-flex justify-content-between">
                                                {/* 1 column--------------------------------------- */}
                                                <div class="col-6 pr-lg-5">
                                                      <div class="form-group row">
                                                        <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Date Ordered</label>
                                                        <div class="col-sm-8">
                                                          <input type="date" class="form-control form-control-sm" id="colFormLabelSm"/>
                                                        </div>
                                                      </div>
                                                      <div class="form-group row">
                                                        <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Ordered By</label>
                                                        <div class="col-sm-8">
                                                            <select class="form-control form-control-sm">
                                                                <option  value=""></option>
                                                              </select>
                                                        </div>
                                                      </div>
                                                      <div class="form-group row">
                                                        <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Date Required </label>
                                                        <div class="col-sm-8">
                                                          <input type="date" class="form-control form-control-sm" id="colFormLabelSm"/>
                                                        </div>
                                                      </div>
                                                      <div class="form-group row">
                                                        <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Filed Date</label>
                                                        <div class="col-sm-8">
                                                          <input type="date" class="form-control form-control-sm" id="colFormLabelSm"/>
                                                        </div>
                                                      </div>
                                                      <div class="form-group row">
                                                        <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Inspection Date</label>
                                                        <div class="col-sm-8">
                                                          <input type="date" class="form-control form-control-sm" id="colFormLabelSm" />
                                                        </div>
                                                      </div>
                                                      <div class="form-group row">
                                                        <div class=" col d-flex justify-content-end">
                                                            <button class="btn btn-info btn-sm">
                                                            Clear Dates
                                                        </button></div>
                                                      </div>
                                                    
                                                </div>
                                                {/* 2 column------------------------------------ */}
                                                <div class="col-6 pl-lg-5">
                                                    <div class="form-group row">
                                                        <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Start Date</label>
                                                        <div class="col-sm-8">
                                                          <input type="date" class="form-control form-control-sm" id="colFormLabelSm"/>
                                                        </div>
                                                      </div>
                                                      <div class="form-group row">
                                                        <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Start Time</label>
                                                        <div class="col-sm-8">
                                                          <input type="time" class="form-control form-control-sm" id="colFormLabelSm" />
                                                        </div>
                                                      </div>
                                                      <div class="form-group row">
                                                        <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">End Date </label>
                                                        <div class="col-sm-8">
                                                          <input type="date" class="form-control form-control-sm" id="colFormLabelSm"/>
                                                        </div>
                                                      </div>
                                                      <div class="form-group row">
                                                        <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">End Time</label>
                                                        <div class="col-sm-8">
                                                          <input type="time"  class="form-control form-control-sm" id="colFormLabelSm"/>
                                                        </div>
                                                      </div>
                                                      <div class="form-group row">
                                                        <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Day(s)</label>
                                                        <div class="col-sm-8">
                                                          <small>0 </small> 
                                                        </div>
                                                      </div>
                                                      <div class="form-group row">
                                                        <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm">Duration</label>
                                                        <div class="col-sm-8">
                                                          <small>0 </small> 
                                                        </div>
                                                      </div>
                                                      <div class="form-group row  ">
                                                        <label for="colFormLabelSm" class="col-sm-4 col-form-label col-form-label-sm"></label>
                                                        <div class=" col d-flex justify-content-between">
                                                            <button class="btn btn-info btn-sm">
                                                              Clear Start/End
                                                          </button>
                                                          <button class="btn btn-info btn-sm">
                                                            <i class="fas fa-fw fa-plus" 
                                                            //style="font-size: 12px; color: rgb(255, 255, 255);"
                                                            ></i> Create Recurrance
                                                        </button>
                                                        </div>
                                                      
                                                      </div>
                                                      </div>
                                                </div>
                                                
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Work Code & Units */}
                            <div class="tab-pane fade row" id="nav-code" role="tabpanel" aria-labelledby="nav-code-tab">
                              <div class="col-12">
                                <div class="card shadow-sm mb-3 mt-2">
                                  <div class="card-header p-2">
                                      <h6 class="m-0 font-weight-bold">Work Code</h6>
                                  </div>
                                  <div class="card-body p-2">
                                    <table class="table table-bordered table-striped table-sm">
                                      <thead class="">
                                        <tr>
                                          <th scope="col">Work Code</th>
                                          <th scope="col">Scheduled</th>
                                          <th scope="col">Actual</th>
                                          <th scope="col">Description</th>
                                          <th scope="col">% Complete</th>
                                          <th scope="col">Comments</th>
                                          <th scope="col">P...</th>
                                          <th scope="col"></th>
                                          <th scope="col"></th>
                                          <th scope="col"></th>
                                        </tr>
                                      </thead>
                                      <tbody >
                                        <tr class="table-borderless">
                                          <td>F105</td>
                                          <td>0</td>
                                          <td>0</td>
                                          <td>Sewer Sta...</td>
                                          <td>0.0 %</td>
                                          <td></td>
                                          <td class="text-center"><input type="checkbox"/></td>
                                          <td class="text-center"><i class="fas fa-fw fa-camera" 
                                          //style="font-size: 18px; color: rgb(37, 62, 131);cursor: pointer;"
                                          ></i></td>
                                          <td class="text-center"><i class="fas fa-fw fa-paperclip" 
                                          //style="font-size: 18px; color: rgb(0, 0, 0);cursor: pointer;"
                                          ></i></td>
                                          <td class="text-center"><i class="fas fa-fw fa-trash-alt" 
                                          //style="font-size: 18px; color:red;cursor: pointer;"
                                          ></i></td>
                                        </tr>
                                        <tr class="table-borderless">
                                          <td ><span class="bg-light p-1"><i class="fas fa-fw fa-plus" 
                                          //style="font-size: 15px; color: rgb(133, 224, 79);cursor: pointer;"
                                          ></i></span></td>
                                        </tr >
                                        
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                                <div class="card shadow-sm mb-3 mt-1">
                                  <div class="card-header p-2">
                                      <h6 class="m-0 font-weight-bold">Units</h6>
                                  </div>
                                  <div class="card-body p-2">
                                    <table class="table table-bordered table-striped table-sm table-light">
                                      
                                      <thead >
                                        <tr id="monthHeader">
                                          <div id="header" class="d-flex align-middle justify-content-center align-items-center mb-2">   
                                            <span class="bg-light p-1 mx-2"><i class="fas fa-fw fa-arrow-left" 
                                            //style="font-size: 15px; color: rgb(0, 0, 0);cursor: pointer;"
                                            ></i></span>      
                                            <span class="d-inline-block align-middle bg-light px-5" id="month">09/02/2023</span>
                                            <span class="bg-light p-1 mx-2"><i class="fas fa-fw fa-arrow-right" 
                                            //style="font-size: 15px; color: rgb(0, 0, 0);cursor: pointer;"
                                            ></i></span>
                                          </div>
                                        </tr>
                                        <tr >
                                          <th scope="col" class="border">Unit</th>
                                          <th scope="col" class="border">Name</th>
                                          <th scope="col"class="border">Qty</th>
                                          <th scope="col"class="border">Equipment</th>
                                          <th scope="col"class="border">Comments</th>
                                          <th scope="col"class="border"></th>
                                          <th scope="col"class="border"></th>
                                        </tr>
                                      </thead>
                                      <tbody >
                                        <tr class="table-borderless">
                                          <td>0</td>
                                          <td>0</td>
                                          <td>0</td>
                                          <td>0</td>
                                          <td>0</td>
                                          <td></td>
                                          <td></td>
                                        </tr>
                                        <tr class="table-borderless">
                                          <td ><span class="bg-light p-1"><i class="fas fa-fw fa-plus" 
                                          //</span>style="font-size: 15px; color: rgb(133, 224, 79);cursor: pointer;"
                                          ></i></span></td>
                                        </tr >
                                        
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                                
                              </div>
                              
                            </div>

                            {/* Employee Hours */}
                            <div class="tab-pane fade row" id="nav-hours" role="tabpanel" aria-labelledby="nav-hours-tab">
                              <div class="col-12">
                                <div class="card shadow-sm mb-3 mt-2">
                                  <div class="card-header p-2">
                                      <h6 class="m-0 font-weight-bold">Employee Hours</h6>
                                  </div>
                                  <div class="card-body p-2">
                                    <table class="table table-bordered table-striped table-sm table-light">
                                      
                                      <thead >
                                        <tr id="monthHeader">
                                          <div id="header" class="d-flex align-middle justify-content-center align-items-center mb-2">   
                                            <span class="bg-light p-1 mx-2"><i class="fas fa-fw fa-arrow-left" 
                                            //style="font-size: 15px; color: rgb(0, 0, 0);cursor: pointer;"
                                            ></i></span>      
                                            <span class="d-inline-block align-middle bg-light px-5" id="month">09/02/2023</span>
                                            <span class="bg-light p-1 mx-2"><i class="fas fa-fw fa-arrow-right" 
                                            //style="font-size: 15px; color: rgb(0, 0, 0);cursor: pointer;"
                                            ></i></span>
                                          </div>
                                        </tr>
                                        <tr >
                                          <th scope="col" class="border">Employee</th>
                                          <th scope="col" class="border">Role</th>
                                          <th scope="col"class="border">Work Code</th>
                                          <th scope="col"class="border">Labor Code</th>
                                          <th scope="col"class="border"></th>
                                          <th scope="col"class="border">Start Time</th>
                                          <th scope="col"class="border">End Time</th>
                                          <th scope="col" class="border">Reg Hrs</th>
                                          <th scope="col" class="border">Ovt Hrs</th>
                                          <th scope="col"class="border">Ovt2 Hrs</th>
                                          <th scope="col"class="border">Travel Hrs</th>
                                          <th scope="col"class="border">Comments</th>
                                          <th scope="col"class="border"></th>
                                        </tr>
                                      </thead>
                                      <tbody >
                                        <tr class="table-borderless">
                                          <td>Apple William</td>
                                          <td>Party Chief</td>
                                          <td>F105</td>
                                          <td>001</td>
                                          <td class="text-center"><i class="fas fa-fw fa-search" 
                                          //</td>style="font-size: 18px; color:rgb(2, 2, 2);cursor: pointer;"
                                          ></i></td>
                                          <td>11:00 AM</td>
                                          <td>06:00 PM</td>
                                          <td>8</td>
                                          <td>0</td>
                                          <td>0</td>
                                          <td>0</td>
                                          <td></td>
                                          <td class="text-center"><i class="fas fa-fw fa-trash-alt" 
                                          //</td>style="font-size: 18px; color:red;cursor: pointer;"
                                          ></i></td>
                                        </tr>
                                        <tr class="table-borderless">
                                          <td ><span class="bg-light p-1"><i class="fas fa-fw fa-plus" 
                                          //</td>style="font-size: 15px; color: rgb(133, 224, 79);cursor: pointer;"
                                          ></i></span></td>
                                        </tr >
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Employee Expenses */}
                            <div class="tab-pane fade row" id="nav-expenses" role="tabpanel" aria-labelledby="nav-expenses-tab">
                              <div class="col-12">
                                <div class="card shadow-sm mb-3 mt-2">
                                  <div class="card-header p-2">
                                      <h6 class="m-0 font-weight-bold">Employee Hours</h6>
                                  </div>
                                  <div class="card-body p-2">
                                    <table class="table table-bordered table-striped table-sm">
                                      <thead class="">
                                        <tr>
                                          <th scope="col">Date </th>
                                          <th scope="col">Employe...</th>
                                          <th scope="col">Category</th>
                                          <th scope="col">Description</th>
                                          <th scope="col">Amount</th>
                                          <th scope="col">Project</th>
                                          <th scope="col">Project Name</th>
                                          <th scope="col">Phase</th>
                                          <th scope="col">Phase Name</th>
                                          <th scope="col">Task</th>
                                          <th scope="col">Task Name</th>
                                          <th scope="col">Billable</th>
                                          <th scope="col">Account ...</th>
                                          <th scope="col"></th>
                                          <th scope="col"></th>
                                          <th scope="col"></th>
                                        </tr>
                                      </thead>
                                      <tbody >
                                        <tr class="table-borderless">
                                          <td>09/02/2023</td>
                                          <td>Apple William</td>
                                          <td>0</td>
                                          <td>0</td>
                                          <td>0</td>
                                          <td>0</td>
                                          <td>0</td>
                                          <td>0</td>
                                          <td>0</td>
                                          <td>0</td>
                                          <td>0</td>
                                          <td>0</td>
                                          <td >0</td>
                                          <td></td>
                                          <td></td>
                                          <td ></td>
                                         </tr>
                                        <tr class="table-borderless">
                                          <td ><span class="bg-light p-1"><i class="fas fa-fw fa-plus" 
                                          //</span>style="font-size: 15px; color: rgb(133, 224, 79);cursor: pointer;"
                                          ></i></span></td>
                                        </tr >
                                        
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Signatures */}
                            <div class="tab-pane fade row" id="nav-sign" role="tabpanel" aria-labelledby="nav-sign-tab">
                              <div class="col-12">
                                <div class="card shadow-sm mb-3 mt-2">
                                  <div class="card-header p-2">
                                      <h6 class="m-0 font-weight-bold">Signatures</h6>
                                  </div>
                                  <div class="card-body p-2">
                                    <div class="row">
                                      <div class="col">
                                        <div class="card shadow-sm mb-3 mt-2">
                                          <div class="card-header p-2">
                                            <h6 class="m-0 ">Manage Client Signature (*required field)</h6>
                                          </div>
                                          <div class="card-body p-2">
                                            <div class="row d-flex p-0 m-0">
                                              <button class="btn btn-info"><i class="fas fa-fw fa-edit mr-2" 
                                              //</button>style="font-size: 15px; color: rgb(255, 255, 255);cursor: pointer;"
                                              ></i>Add Signature</button>
                                              <div class="form-group row ml-3 p-0 m-0">
                                               <label for="colFormLabelSm" class="col-sm-auto col-form-label col-form-label-sm">Signature Date:</label>
                                               <div class="col-sm-7">
                                                <input type="text" class="form-control form-control-sm" id="colFormLabelSm"  placeholder="02/08/2023 12:34 PM" />
                                               </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="col">
                                        <div class="card shadow-sm mb-3 mt-2">
                                          <div class="card-header p-2">
                                            <h6 class="m-0 ">Manage Party Chief Signature (*required field)</h6>
                                          </div>
                                          <div class="card-body p-2">
                                            <div class="row d-flex p-0 m-0">
                                               <button class="btn btn-info"><i class="fas fa-fw fa-edit mr-2" 
                                               //style="font-size: 15px; color: rgb(255, 255, 255);cursor: pointer;"
                                               ></i>Add Signature</button>
                                               <div class="form-group row ml-3 p-0 m-0">
                                                <label for="colFormLabelSm" class="col-sm-auto col-form-label col-form-label-sm">Signature Date:</label>
                                                <div class="col-sm-7">
                                                 <input type="text" class="form-control form-control-sm" id="colFormLabelSm" placeholder="02/08/2023 12:34 PM" />
                                                </div>
                                               </div>
                                             </div>
                                        </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                    </div>
                </div>
    </>
       
    );
};

export default FWANew;
