import React, { useState, useEffect } from 'react'
import { FaUserAlt, FaLock, FaGlobe } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { sha256 } from 'js-sha256'
import { baseUrl } from '../../rest/Api_Directory'
//import './login.css'
import CryptoJS from 'crypto-js'

// crypto config
const SARALK = '12345678900000001234567890000023' //32 bit
export const Encrypt = (str) => {
  var IV = '1234567890000000' //16 bits
  var key = CryptoJS.enc.Utf8.parse(SARALK)
  var iv = CryptoJS.enc.Utf8.parse(IV)

  var encrypted = ''

  var srcs = CryptoJS.enc.Utf8.parse(str)
  encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })

  return encrypted.ciphertext.toString()
}

const Login = () => {
  const [domainAuth, setDomainAuth] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userConfig, setUserConfig] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const usercredential = username.toLocaleUpperCase() + password
  const handleClick = (e) => {
    e.preventDefault()
    console.log('handleClick')
    axios
      .post(baseUrl, {
        action: 'User',
        method: 'Login',
        data: [
          'lqcWVYFl7qoQ7P0dg__a2bfnUSmyaXw4Ed__a2bIqSG2wcF__a2fWVRFQCQFpk4aeljEzVgKiUQ__a2brYrc7hz__a2fQcNWf0c2qQqlLj5bTp7aFcyTuJN3BrNc1TcHYPD5T__a2fB9qg5iLGyaChUMhCRaGWUL5rnXQZAWR9w7Vfm038jKkSxxJNjXemiVjMe4beBOPFUn__a2bwTxORkIlRXdMxMcusZ1Lm__a2fsZgBnvotaXg__a3d__a3d',
          username.toLocaleUpperCase(),
          sha256(usercredential),
          '_none_',
          'N',
        ],
        type: 'rpc',
        tid: 2,
      })
      .then((response) => {
        console.log('responsee', response.data.result)
        if (response != null) {
          if (response?.data?.result?.success) {
            setIsLoggedIn(true)
            //navigate("/dashboard")
          } else {
            setIsLoggedIn(false)
            alert('Please check your username/password')
          }
        }
      })
  }

  useEffect(() => {
    axios
      .post(baseUrl, {
        action: 'User',
        method: 'SupportIntegratedLogin',
        data: [
          'en-US',
          'lqcWVYFl7qoQ7P0dg__a2bfnUSmyaXw4Ed__a2bIqSG2wcF__a2fWVRFQCQFpk4aeljEzVgKiUQ__a2brYrc7hz__a2fQcNWf0c2qQqlLj5bTp7aFcyTuJN3BrNc1TcHYPD5T__a2fB9qg5iLGyaChUMhCRaGWUL5rnXQZAWR9w7Vfm038jKkSxxJNjXemiVjMe4beBOPFUn__a2bwTxORkIlRXdMxMcusZ1Lm__a2fsZgBnvotaXg__a3d__a3d',
          '4.2.7.4-FSS1_VP55up-0220-75',
        ],
        type: 'rpc',
        tid: 1,
      })
      .then((response) => {
        console.log('domain-auth-response', response, response.data.result.data)
        if (response != null) {
          if (response?.data?.result?.data == 'Y') {
            setDomainAuth(true)
          } else {
            setDomainAuth(false)
          }
        }
      })
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      axios
        .post(baseUrl, {
          action: 'UserConfig',
          method: 'GetByUsername',
          data: [
            'lqcWVYFl7qoQ7P0dg__a2bfnUSmyaXw4Ed__a2bIqSG2wcF__a2fWVRFQCQFpk4aeljEzVgKiUQ__a2brYrc7hz__a2fQcNWf0c2qQqlLj5bTp7aFcyTuJN3BrNc1TcHYPD5T__a2fB9qg5iLGyaChUMhCRaGWUL5rnXQZAWR9w7Vfm038jKkSxxJNjXemiVjMe4beBOPFUn__a2bwTxORkIlRXdMxMcusZ1Lm__a2fsZgBnvotaXg__a3d__a3d',
            'Lfbxg1ffszI9XrfSdoC__a2bzw__a3d__a3d',
            'FSS',
          ],
          type: 'rpc',
          tid: 6,
        })
        .then((response) => {
          console.log(
            'UserConfig-response',
            response,
            response.data.result.data,
          )
          if (response != null) {
            if (response?.data?.result?.success) {
              setUserConfig(true)
            } else {
              setUserConfig(false)
            }
          }
        })
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (isLoggedIn && userConfig) {
      console.log('isLoggedIn && userConfig')
      navigate('/dashboard')
    }
  }, [userConfig])

  return (
    <div className="bg-brand">
      {/* <Grid container spacing={{ xs: 2, md: 3, lg: 4 }}>
                <Grid item xs={6}> */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-sm-8 col-lg-6">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-12">
                    <div className="p-4">
                      <div className="text-center">
                        <div className="row">
                          <div className="col-6 d-flex align-items-center justify-content-center">
                            <img
                              src="img/elevia-logo.svg"
                              className="img-fluid w-75"
                            />
                          </div>
                          <div className="col-6 border-left d-flex align-items-center justify-content-center">
                            <img
                              src="img/deltek.png"
                              className="img-fluid w-75"
                            />
                          </div>
                        </div>
                        {/* <img src="img/elevia-logo.svg" className="img-fluid" /> */}
                        <hr />
                        <h1 className="h3 text-gray-900 mb-4">
                          Field Services Suite
                        </h1>
                      </div>
                      <form className="user login">
                        <div className="form-group ">
                          <div className="input-group mb-3">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                {/* <FontAwesomeIcon icon="fa-solid fa-user" /> */}
                                <FaUserAlt />
                              </span>
                            </div>
                            <input
                              type="email"
                              className="form-control form-control-user"
                              id="inputEmail"
                              aria-describedby="emailHelp"
                              placeholder="Username"
                              name="username"
                              onChange={(e) => setUsername(e.target.value)}
                              value={username}
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="input-group mb-3">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <FaLock />
                              </span>
                            </div>
                            <input
                              type="password"
                              className="form-control form-control-user"
                              id="inputPassword"
                              placeholder="Password"
                              name="password"
                              onChange={(e) => setPassword(e.target.value)}
                              value={password}
                            />
                          </div>
                        </div>
                        <hr />
                        {domainAuth ? (
                          <>
                            <div className="form-group">
                              <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                  <span className="input-group-text">
                                    <FaGlobe />
                                    {/* <span className="fa fa-globe"></span> */}
                                  </span>
                                </div>
                                <input
                                  type="text"
                                  className="form-control form-control-user"
                                  id="inputDomain"
                                  placeholder="Domain"
                                />
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="custom-control custom-checkbox small">
                                <input
                                  type="checkbox"
                                  className="custom-control-input"
                                  id="customCheck"
                                />
                                <label className="custom-control-label">
                                  Windows Authentication
                                </label>
                              </div>
                            </div>{' '}
                          </>
                        ) : (
                          <></>
                        )}
                        <button
                          className="btn btn-primary btn-user btn-block"
                          onClick={(e) => handleClick(e)}
                        >
                          Login
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </Grid>
        </Grid> */}
    </div>
  )
}

export default Login
