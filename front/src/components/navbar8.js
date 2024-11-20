import React, { useState, Fragment, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import logo from "../assests/logo1.png";
import "./navbar8.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Navbar8 = (props) => {
  const navigate = useNavigate("");
  const ctaRef = useRef(null);
  const logoSrc = logo;
  const [link5AccordionOpen, setLink5AccordionOpen] = useState(false);
  const [link5DropdownVisible, setLink5DropdownVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignupModal, setIsSignupModal] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [username, setUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [email, setEmail] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [pendingScroll, setPendingScroll] = useState(false);
  
  const scrollToCTA = () => {
    if (props.ctaRef.current) {
      props.ctaRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      console.log("CTA26 section not found.");
    }
  };
  const handleOtpChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        setTimeout(() => {
          const nextInput = document.getElementById(`otp-${index + 1}`);
          if (nextInput) {
            nextInput.focus();
          }
        }, 0);
      }

      if (value === "") {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);

        if (index > 0) {
          const prevInput = document.getElementById(`otp-${index - 1}`);
          if (prevInput) {
            prevInput.focus();
          }
        }
      }
    }
  };

  useEffect(() => {
    let timer;
    if (timerActive && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setMessage("Your time is up! Please send the OTP again.");
      setMessageType("error");
      setIsOtpSent(false);
      setIsOtpVerified(false);
      setOtp(Array(6).fill(""));
      setTimerActive(false);
    }

    return () => clearInterval(timer);
  }, [timerActive, otpTimer,isModalOpen]);

  const handleGetOtp = async (email) => {
    try {
      setLoading(true);

      const verifyEmailResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/verify-email`,
        { email }
      );
      if (verifyEmailResponse.data.isRegistered) {
        const sendOtpResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/send-otp`,
          { email }
        );
        if (sendOtpResponse.data.success) {
          setIsOtpSent(true);
          setMessage("OTP has been sent to your email");
          setMessageType("success");
        } else {
          setMessage("Failed to send OTP. Please try again.");
          setMessageType("error");
        }
      } else {
        setMessage("Email is not registered");
        setMessageType("error");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error verifying email. Please try again.");
      setMessageType("error");
      return;
    } finally {
      setLoading(false);
    }
    setOtpTimer(60);
    setTimerActive(true);
  };

  const handleVerifyOtp = async (email, enteredOtp) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/verify-otp`, {
        email,
        otp: enteredOtp,
      });
      return response.data.message === "OTP verified";
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log(error.response.data.message);

        setMessage("Invalid OTP. Please try again.");
        setMessageType("error");
      } else {
        setMessage("An error occurred. Please try again later.");
        setMessageType("error");
      }
      return false;
    }
  };

  const handleResetPassword = async (email, newPassword) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/reset-password`,
        {
          email,
          newPassword,
        }
      );

      if (response.data.success) {
        setMessage("Your Password Reset Successfully");
        setMessageType("success");
        setIsModalOpen(true);
        setIsSignupModal(false);
        setForgotPassword(false);
        setMessage("");
      } else {
        setMessage(response.data.message);
        setMessageType("error");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setMessage(error.response.data.message);
      } else {
        setMessage(
          "An error occurred while resetting the password. Please try again."
        );
        setMessageType("error");
      }
      console.error("Error resetting password:", error);
    }
  };

  const handleForgotPassword = () => {
    setForgotPassword(true);
    setIsSignupModal(false);
    setMessage("");
    setIsOtpSent(false);
    setIsOtpVerified(false);
    setEmail("");
    setOtp("");
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login Response Data:", data);

      if (response.ok) {
        console.log("Username from response:", data.username);
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("userId", data.userId);
        setUsername(data.username);
        setIsLoggedIn(true);
        setIsModalOpen(false);
        if (pendingScroll) {
          setPendingScroll(false);
        }
      } else {
        setMessage(data.message);
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const checkUsernameAvailability = async (username) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/check-username?username=${username}`
      );
      const data = await response.json();

      if (response.ok) {
        setUsernameAvailable(data.available);
        if (!data.available) {
          setMessage("Username already exists.");
          setMessageType("error");
        } else {
          setMessage("");
        }
      } else {
        setMessage("Error checking username availability.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
    }
  };

  const handleSignup = async (username, email, password) => {
    await checkUsernameAvailability(username);
    if (!usernameAvailable) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      console.log("Response data:", data);
      if (response.ok) {
        setMessage("Registered successfully. Now logging in...");
        setMessageType("success");
        setTimeout(() => {
          setIsSignupModal(false);
          setIsModalOpen(true);
          setMessage("");
        }, 2000);
      } else {
        setMessage(data.message || "Registration failed. Please try again.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.",error);
      setMessageType("error");
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedToken = localStorage.getItem("token");
    const timeout = setTimeout(() => {
      if (storedUsername && storedToken) {
        setUsername(storedUsername);
        setIsLoggedIn(true);
      }
      setLoading(false);
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsSignupModal(false);
  };

  const handleMovieClick = () => {
    navigate("/MovieTicket");
  };
  const handleConcertClick = () => {
    navigate("/ConcertTicket");
  };
  const handleSportClick = () => {
    navigate("/SportsTicket");
  };

  return (
    <header className="navbar8-container1">
      <header data-thq="thq-navbar" className="navbar8-navbar-interactive">
        <img alt={props.logoAlt} src={logoSrc} className="navbar8-image1" />
        <div data-thq="thq-navbar-nav" className="navbar8-desktop-menu">
          <nav className="navbar8-links1">
            <a href={props.link1Url}>
              {props.link1 ?? (
                <Fragment>
                  <span className="navbar8-text18 thq-link thq-body-small">
                    Home
                  </span>
                </Fragment>
              )}
            </a>
            <a
              href={props.link3Url}
              rel="noreferrer noopener"
              ref={ctaRef}
              onClick={(e) => {
                e.preventDefault();
                if (isLoggedIn) {
                  scrollToCTA();
                } else {
                  setPendingScroll(true);
                  setIsModalOpen(true);
                }
              }}
            >
              {props.link3 ?? (
                <Fragment>
                  <a href="">
                    <span className="navbar8-text24 thq-link thq-body-small">
                      Buy-Ticket
                    </span>
                  </a>
                </Fragment>
              )}
            </a>
            <div
              onClick={() => {
                if (isLoggedIn) {
                  setLink5DropdownVisible(!link5DropdownVisible);
                } else {
                  setIsModalOpen(true);
                }
              }}
              className="navbar8-link4-dropdown-trigger"
            >
              <span>
                {props.link4 ?? (
                  <Fragment>
                    <span className="navbar8-text21 thq-link thq-body-small">
                      Sell-Ticket
                    </span>
                  </Fragment>
                )}
              </span>
              <div className="navbar8-icon-container1">
                {link5DropdownVisible && isLoggedIn && (
                  <div className="navbar8-container2">
                    <svg viewBox="0 0 1024 1024" className="navbar8-icon10">
                      <path d="M298 426h428l-214 214z"></path>
                    </svg>
                  </div>
                )}
                {!link5DropdownVisible && isLoggedIn && (
                  <div className="navbar8-container3">
                    <svg viewBox="0 0 1024 1024" className="navbar8-icon12">
                      <path d="M426 726v-428l214 214z"></path>
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <a
              href={props.link2Url}
              rel="noreferrer noopener"
              ref={ctaRef}
              onClick={(e) => {
                e.preventDefault();
                if (isLoggedIn) {
                  navigate("/live");
                } else {
                  setPendingScroll(true);
                  setIsModalOpen(true);
                }
              }}
            >
              {props.link2 ?? (
                <Fragment>
                  <a href="">
                    <span className="navbar8-text24 thq-link thq-body-small">
                      Live-Ticket
                    </span>
                  </a>
                </Fragment>
              )}
            </a>
            <a
              href={props.link5Url}
              rel="noreferrer noopener"
              onClick={(e) => {
                e.preventDefault();
                if (isLoggedIn) {
                  navigate("/contact");
                } else {
                  setPendingScroll(true);
                  setIsModalOpen(true);
                }
              }}
            >
              {props.link5 ?? (
                <Fragment>
                  <a href="">
                    <span className="navbar8-text24 thq-link thq-body-small">
                      Contact Us
                    </span>
                  </a>
                </Fragment>
              )}
            </a>
          </nav>
              
          <div className="navbar8-buttons1">
            {loading ? null : (
              <>
                {isLoggedIn ? (
                  <div className="user-info">
                    {console.log("Username:", username)}
                    <div className="icon-container">
                      <FontAwesomeIcon
                        icon={faUser}
                        size="1.5x"
                        color="black"
                        className="icon-padding"
                      />
                      <span className="username">{username}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="navbar8-action11 thq-button-animated thq-button-filled"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      className="navbar8-action11 thq-button-animated thq-button-filled"
                      onClick={() => {
                        setIsModalOpen(true);
                        setIsSignupModal(false);
                        setForgotPassword(false);
                        setMessage("");
                      }}
                    >
                      <span className="thq-body-small">Login</span>
                    </button>
                    <button
                      className="navbar8-action21 thq-button-outline thq-button-animated"
                      onClick={() => {
                        setIsModalOpen(true);
                        setIsSignupModal(true);
                        setForgotPassword(false);
                        setMessage("");
                      }}
                    >
                      <span className="thq-body-small">Sign Up</span>
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          {isModalOpen && (
            <div className={`modal-fullscreen ${isModalOpen ? "active" : ""}`}>
              <div className="modal-content">
                <button className="close" onClick={() => setIsModalOpen(false)}>
                  &times;
                </button>
                <h2>
                  {forgotPassword
                    ? "Forgot Password"
                    : isSignupModal
                    ? "Sign Up"
                    : "Login"}
                </h2>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const email = e.target.email?.value;

                    if (forgotPassword && !isOtpSent) {
                      setLoading(true);
                      setEmail(email);
                      await handleGetOtp(email);
                      setLoading(false);
                    } else if (forgotPassword && isOtpSent && !isOtpVerified) {
                      const enteredOtp = otp.join("");
                      if (enteredOtp.length < 6) {
                        setMessage("Please enter the complete OTP.");
                        return;
                      }
                      const isVerified = await handleVerifyOtp(
                        email,
                        enteredOtp
                      );

                      if (isVerified) {
                        setIsOtpVerified(true);
                        setTimerActive(false);
                      } else {
                        setIsOtpSent(true);
                        setOtp(Array(6).fill(""));
                        setMessage("Invalid OTP. Please try again.");
                      }
                    } else if (forgotPassword && isOtpVerified) {
                      const newPassword = e.target.password.value;
                      const confirmPassword = e.target.confirmPassword.value;

                      if (newPassword !== confirmPassword) {
                        setMessage("Passwords do not match. Please try again.");
                        return;
                      }

                      await handleResetPassword(email, newPassword);
                    } else {
                      const password = e.target.password?.value;

                      if (isSignupModal) {
                        const username = e.target.username?.value;
                        handleSignup(username, email, password);
                      } else {
                        handleLogin(email, password);
                      }
                    }
                  }}
                >
                  {loading && (
                    <div className="loading-overlay">
                      <div className="loading-spinner"></div>
                    </div>
                  )}

                  {forgotPassword ? (
                    <>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                        disabled={isOtpSent}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />

                      {!isOtpSent && <button type="submit">Get OTP</button>}

                      {isOtpSent && !isOtpVerified && (
                        <>
                          <div className="otp-input-container">
                            {Array.from({ length: 6 }).map((_, index) => (
                              <input
                                key={index}
                                type="text"
                                className="otp-input"
                                value={otp[index] || ""}
                                onChange={(e) =>
                                  handleOtpChange(index, e.target.value)
                                }
                                maxLength="1"
                                id={`otp-${index}`}
                                required
                              />
                            ))}
                          </div>
                          <div style={{ margin: "10px 0" }}>
                            Time Remaining: {otpTimer} seconds
                          </div>
                          <button type="submit">Verify OTP</button>
                        </>
                      )}

                      {isOtpVerified && (
                        <>
                          <input
                            type="password"
                            name="password"
                            placeholder="Enter new password"
                            required
                          />
                          <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm new password"
                            required
                          />
                          <button type="submit">Reset Password</button>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {isSignupModal && (
                        <input
                          type="text"
                          name="username"
                          placeholder="Username"
                          required
                        />
                      )}
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                      />
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                      />

                      {!isSignupModal && (
                        <button
                          type="button"
                          className="forgot-password"
                          onClick={() => {
                            setForgotPassword(true);
                            setIsSignupModal(false);
                            setMessage("");
                            handleForgotPassword();
                          }}
                          style={{
                            marginBottom: "20px",
                            marginLeft: "130px",
                            cursor: "pointer",
                            color: "#007BFF",
                            backgroundColor: "transparent",
                            fontSize: "16px",
                            fontWeight: "bold",
                            transition: "background-color 0.3s, color 0.3s",
                            textDecoration: "none",
                          }}
                        >
                          Forgot Password?
                        </button>
                      )}

                      <button type="submit">
                        {isSignupModal ? "Register" : "Login"}
                      </button>
                    </>
                  )}
                </form>

                {!isSignupModal && !forgotPassword && (
                  <p style={{ marginTop: "15px" }}>
                    Don't have an account?{" "}
                    <span
                      className="signup-link"
                      onClick={() => {
                        setIsSignupModal(true);
                        setForgotPassword(false);
                        setMessage("");
                      }}
                      style={{
                        cursor: "pointer",
                        color: "#007BFF",
                        backgroundColor: "transparent",
                        fontSize: "16px",
                        fontWeight: "bold",
                        transition: "background-color 0.3s, color 0.3s",
                        textDecoration: "none",
                      }}
                    >
                      Sign Up
                    </span>
                  </p>
                )}

                {isSignupModal && !forgotPassword && (
                  <p style={{ marginTop: "15px" }}>
                    Already have an account?{" "}
                    <span
                      className="signup-link"
                      onClick={() => {
                        setIsSignupModal(false);
                        setForgotPassword(false);
                        setMessage("");
                      }}
                      style={{
                        cursor: "pointer",
                        color: "#007BFF",
                        backgroundColor: "transparent",
                        fontSize: "16px",
                        fontWeight: "bold",
                        transition: "background-color 0.3s, color 0.3s",
                        textDecoration: "none",
                      }}
                    >
                      Login
                    </span>
                  </p>
                )}

                {message && (
                  <div
                  className="message"
                  style={{
                    color: messageType === "error" ? "red" : "green", 
                    fontWeight: "bold",
                  }}
                >
                  {message}
                </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div
          data-thq="thq-burger-menu"
          className="navbar8-burger-menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg viewBox="0 0 1024 1024" className="navbar8-icon14">
            <path d="M128 554.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 298.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 810.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667z"></path>
          </svg>
        </div>
        <div
          data-thq="thq-mobile-menu"
          className={`navbar8-mobile-menu ${isMenuOpen ? "active" : ""}`}
        >
          <div className="navbar8-nav">
            <div className="navbar8-top">
              <img alt={props.logoAlt} src={logoSrc} className="navbar8-image1" />
              <div
                data-thq="thq-close-menu"
                className="navbar8-close-menu"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg viewBox="0 0 1024 1024" className="navbar8-icon16">
                  <path d="M810 274l-238 238 238 238-60 60-238-238-238 238-60-60 238-238-238-238 60-60 238 238 238-238z"></path>
                </svg>
              </div>
            </div>
            <nav className="navbar8-links2">
              <a href={props.link1Url}>
                {props.link1 ?? (
                  <Fragment>
                    <span className="navbar8-text18 thq-link thq-body-small">
                      Home
                    </span>
                  </Fragment>
                )}
              </a>
              <a
                href={props.link3Url}
                onClick={(e) => {
                  e.preventDefault();
                  if (isLoggedIn) {
                    scrollToCTA();
                    setIsModalOpen(false); 
                    setIsMenuOpen(false);  
                  } else {
                    setPendingScroll(true);
                    setIsModalOpen(true);
                  }
                  //setIsMenuOpen(false);
                }}
                ref={ctaRef}
              >
                {props.link3 ?? (
                  <Fragment>
                    <a href="">
                      <span className="navbar8-text24 thq-link thq-body-small">
                        Buy-Ticket
                      </span>
                    </a>
                  </Fragment>
                )}
              </a>
              <div className="navbar8-link4-accordion">
                <div
                  onClick={() => {
                    if (isLoggedIn) {
                    setLink5DropdownVisible(!link5DropdownVisible);
                    setLink5AccordionOpen(!link5AccordionOpen);
                  } else {
                    setIsModalOpen(true);
                  }
                }}
                  className="navbar8-trigger"
                >
                  <span>
                    {props.link4 ?? (
                      <Fragment>
                        <span className="navbar8-text21 thq-link thq-body-small">
                          Sell-Ticket
                        </span>
                      </Fragment>
                    )}
                  </span>
                  <div className="navbar8-icon-container2">
                    {link5AccordionOpen && isLoggedIn && (
                      <div className="navbar8-container4">
                        <svg viewBox="0 0 1024 1024" className="navbar8-icon18">
                          <path d="M298 426h428l-214 214z"></path>
                        </svg>
                      </div>
                    )}
                    {!link5AccordionOpen && isLoggedIn && (
                      <div className="navbar8-container5">
                        <svg viewBox="0 0 1024 1024" className="navbar8-icon20">
                          <path d="M426 726v-428l214 214z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                {link5AccordionOpen && (
                  <div className="navbar8-container6">
                    <a href={props.linkUrlPage1} onClick={handleSportClick}>
                      <div className="navbar8-menu-item1">
                        <img
                          alt={props.page1ImageAlt}
                          src={props.page1ImageSrc}
                          className="navbar8-page1-image1"
                        />
                        <div className="navbar8-content1">
                          <span>
                            {props.page1 ?? (
                              <Fragment>
                                <span className="navbar8-text17 thq-body-large">
                                  Sports
                                </span>
                              </Fragment>
                            )}
                          </span>
                          <span>
                            {props.page1Description ?? (
                              <Fragment>
                                <span className="navbar8-text22 thq-body-small">
                                  Explore upcoming sports events and buy tickets
                                </span>
                              </Fragment>
                            )}
                          </span>
                        </div>
                      </div>
                    </a>
                    <a href={props.linkUrlPage2} onClick={handleConcertClick}>
                      <div className="navbar8-menu-item2">
                        <img
                          alt={props.page2ImageAlt}
                          src={props.page2ImageSrc}
                          className="navbar8-page2-image1"
                        />
                        <div className="navbar8-content2">
                          <span>
                            {props.page2 ?? (
                              <Fragment>
                                <span className="navbar8-text20 thq-body-large">
                                  Concerts
                                </span>
                              </Fragment>
                            )}
                          </span>
                          <span>
                            {props.page2Description ?? (
                              <Fragment>
                                <span className="navbar8-text23 thq-body-small">
                                  Find tickets for the hottest concerts in town
                                </span>
                              </Fragment>
                            )}
                          </span>
                        </div>
                      </div>
                    </a>
                    <a href={props.linkUrlPage3} onClick={handleMovieClick}>
                      <div className="navbar8-menu-item3">
                        <img
                          alt={props.page3ImageAlt}
                          src={props.page3ImageSrc}
                          className="navbar8-page3-image1"
                        />
                        <div className="navbar8-content3">
                          <span>
                            {props.page3 ?? (
                              <Fragment>
                                <span className="navbar8-text25 thq-body-large">
                                  Movies
                                </span>
                              </Fragment>
                            )}
                          </span>
                          <span>
                            {props.page3Description ?? (
                              <Fragment>
                                <span className="navbar8-text26 thq-body-small">
                                  Get tickets for the latest movie releases
                                </span>
                              </Fragment>
                            )}
                          </span>
                        </div>
                      </div>
                    </a>
                  </div>
                )}
              </div>
              <a
              href={props.link2Url}
              rel="noreferrer noopener"
              ref={ctaRef}
              onClick={(e) => {
                e.preventDefault();
                if (isLoggedIn) {
                  navigate("/live");
                } else {
                  setPendingScroll(true);
                  setIsModalOpen(true);
                }
              }}
            >
              {props.link2 ?? (
                <Fragment>
                  <a href="">
                    <span className="navbar8-text24 thq-link thq-body-small">
                      Live-Ticket
                    </span>
                  </a>
                </Fragment>
              )}
            </a>
            <a
              href={props.link5Url}
              rel="noreferrer noopener"
              onClick={(e) => {
                e.preventDefault();
                if (isLoggedIn) {
                  navigate("/contact");
                } else {
                  setPendingScroll(true);
                  setIsModalOpen(true);
                }
              }}
            >
              {props.link5 ?? (
                <Fragment>
                  <a href="">
                    <span className="navbar8-text24 thq-link thq-body-small">
                      Contact Us
                    </span>
                  </a>
                </Fragment>
              )}
            </a>
            </nav>

            <div className="navbar8-buttons2">
            {loading ? null : (
              <>
                {isLoggedIn ? (
                  <div className="user-info">
                    {console.log("Username:", username)}
                    <div className="icon-container">
                      <FontAwesomeIcon
                        icon={faUser}
                        size="1.5x"
                        color="black"
                        className="icon-padding"
                      />
                      <span className="username">{username}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="navbar8-action11 thq-button-animated thq-button-filled"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      className="navbar8-action11 thq-button-animated thq-button-filled"
                      onClick={() => {
                        setIsModalOpen(true);
                        setIsSignupModal(false);
                        setForgotPassword(false);
                        setMessage("");
                      }}
                    >
                      <span className="thq-body-small">Login</span>
                    </button>
                    <button
                      className="navbar8-action21 thq-button-outline thq-button-animated"
                      onClick={() => {
                        setIsModalOpen(true);
                        setIsSignupModal(true);
                        setForgotPassword(false);
                        setMessage("");
                      }}
                    >
                      <span className="thq-body-small">Sign Up</span>
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          {isModalOpen && (
            <div className={`modal-fullscreen ${isModalOpen ? "active" : ""}`}>
              <div className="modal-content">
                <button className="close" onClick={() => setIsModalOpen(false)}>
                  &times;
                </button>
                <h2>
                  {forgotPassword
                    ? "Forgot Password"
                    : isSignupModal
                    ? "Sign Up"
                    : "Login"}
                </h2>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const email = e.target.email?.value;

                    if (forgotPassword && !isOtpSent) {
                      setLoading(true);
                      setEmail(email);
                      await handleGetOtp(email);
                      setLoading(false);
                    } else if (forgotPassword && isOtpSent && !isOtpVerified) {
                      const enteredOtp = otp.join("");
                      if (enteredOtp.length < 6) {
                        setMessage("Please enter the complete OTP.");
                        return;
                      }
                      const isVerified = await handleVerifyOtp(
                        email,
                        enteredOtp
                      );

                      if (isVerified) {
                        setIsOtpVerified(true);
                        setTimerActive(false);
                      } else {
                        setIsOtpSent(true);
                        setOtp(Array(6).fill(""));
                        setMessage("Invalid OTP. Please try again.");
                      }
                    } else if (forgotPassword && isOtpVerified) {
                      const newPassword = e.target.password.value;
                      const confirmPassword = e.target.confirmPassword.value;

                      if (newPassword !== confirmPassword) {
                        setMessage("Passwords do not match. Please try again.");
                        return;
                      }

                      await handleResetPassword(email, newPassword);
                    } else {
                      const password = e.target.password?.value;

                      if (isSignupModal) {
                        const username = e.target.username?.value;
                        handleSignup(username, email, password);
                      } else {
                        handleLogin(email, password);
                      }
                    }
                  }}
                >
                  {loading && (
                    <div className="loading-overlay">
                      <div className="loading-spinner"></div>
                    </div>
                  )}

                  {forgotPassword ? (
                    <>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                        disabled={isOtpSent}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />

                      {!isOtpSent && <button type="submit">Get OTP</button>}

                      {isOtpSent && !isOtpVerified && (
                        <>
                          <div className="otp-input-container">
                            {Array.from({ length: 6 }).map((_, index) => (
                              <input
                                key={index}
                                type="text"
                                className="otp-input"
                                value={otp[index] || ""}
                                onChange={(e) =>
                                  handleOtpChange(index, e.target.value)
                                }
                                maxLength="1"
                                id={`otp-${index}`}
                                required
                              />
                            ))}
                          </div>
                          <div style={{ margin: "10px 0" }}>
                            Time Remaining: {otpTimer} seconds
                          </div>
                          <button type="submit">Verify OTP</button>
                        </>
                      )}

                      {isOtpVerified && (
                        <>
                          <input
                            type="password"
                            name="password"
                            placeholder="Enter new password"
                            required
                          />
                          <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm new password"
                            required
                          />
                          <button type="submit">Reset Password</button>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {isSignupModal && (
                        <input
                          type="text"
                          name="username"
                          placeholder="Username"
                          required
                        />
                      )}
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                      />
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                      />

                      {!isSignupModal && (
                        <button
                          type="button"
                          className="forgot-password"
                          onClick={() => {
                            setForgotPassword(true);
                            setIsSignupModal(false);
                            setMessage("");
                            handleForgotPassword();
                          }}
                          style={{
                            marginBottom: "20px",
                            marginLeft: "130px",
                            cursor: "pointer",
                            color: "#007BFF",
                            backgroundColor: "transparent",
                            fontSize: "16px",
                            fontWeight: "bold",
                            transition: "background-color 0.3s, color 0.3s",
                            textDecoration: "none",
                          }}
                        >
                          Forgot Password?
                        </button>
                      )}

                      <button type="submit">
                        {isSignupModal ? "Register" : "Login"}
                      </button>
                    </>
                  )}
                </form>

                {!isSignupModal && !forgotPassword && (
                  <p style={{ marginTop: "15px" }}>
                    Don't have an account?{" "}
                    <span
                      className="signup-link"
                      onClick={() => {
                        setIsSignupModal(true);
                        setForgotPassword(false);
                        setMessage("");
                      }}
                      style={{
                        cursor: "pointer",
                        color: "#007BFF",
                        backgroundColor: "transparent",
                        fontSize: "16px",
                        fontWeight: "bold",
                        transition: "background-color 0.3s, color 0.3s",
                        textDecoration: "none",
                      }}
                    >
                      Sign Up
                    </span>
                  </p>
                )}

                {isSignupModal && !forgotPassword && (
                  <p style={{ marginTop: "15px" }}>
                    Already have an account?{" "}
                    <span
                      className="signup-link"
                      onClick={() => {
                        setIsSignupModal(false);
                        setForgotPassword(false);
                        setMessage("");
                      }}
                      style={{
                        cursor: "pointer",
                        color: "#007BFF",
                        backgroundColor: "transparent",
                        fontSize: "16px",
                        fontWeight: "bold",
                        transition: "background-color 0.3s, color 0.3s",
                        textDecoration: "none",
                      }}
                    >
                      Login
                    </span>
                  </p>
                )}

                {message && (
                  <div
                  className="message"
                  style={{
                    color: messageType === "error" ? "red" : "green", 
                    fontWeight: "bold",
                  }}
                >
                  {message}
                </div>
                )}
              </div>
            </div>
          )}
          </div>
          {/* <div className="navbar8-icon-group">
            <svg
              viewBox="0 0 950.8571428571428 1024"
              className="thq-icon-x-small"
            >
              <path d="M925.714 233.143c-25.143 36.571-56.571 69.143-92.571 95.429 0.571 8 0.571 16 0.571 24 0 244-185.714 525.143-525.143 525.143-104.571 0-201.714-30.286-283.429-82.857 14.857 1.714 29.143 2.286 44.571 2.286 86.286 0 165.714-29.143 229.143-78.857-81.143-1.714-149.143-54.857-172.571-128 11.429 1.714 22.857 2.857 34.857 2.857 16.571 0 33.143-2.286 48.571-6.286-84.571-17.143-148-91.429-148-181.143v-2.286c24.571 13.714 53.143 22.286 83.429 23.429-49.714-33.143-82.286-89.714-82.286-153.714 0-34.286 9.143-65.714 25.143-93.143 90.857 112 227.429 185.143 380.571 193.143-2.857-13.714-4.571-28-4.571-42.286 0-101.714 82.286-184.571 184.571-184.571 53.143 0 101.143 22.286 134.857 58.286 41.714-8 81.714-23.429 117.143-44.571-13.714 42.857-42.857 78.857-81.143 101.714 37.143-4 73.143-14.286 106.286-28.571z"></path>
            </svg>
            <svg
              viewBox="0 0 877.7142857142857 1024"
              className="thq-icon-x-small"
            >
              <path d="M585.143 512c0-80.571-65.714-146.286-146.286-146.286s-146.286 65.714-146.286 146.286 65.714 146.286 146.286 146.286 146.286-65.714 146.286-146.286zM664 512c0 124.571-100.571 225.143-225.143 225.143s-225.143-100.571-225.143-225.143 100.571-225.143 225.143-225.143 225.143 100.571 225.143 225.143zM725.714 277.714c0 29.143-23.429 52.571-52.571 52.571s-52.571-23.429-52.571-52.571 23.429-52.571 52.571-52.571 52.571 23.429 52.571 52.571zM438.857 152c-64 0-201.143-5.143-258.857 17.714-20 8-34.857 17.714-50.286 33.143s-25.143 30.286-33.143 50.286c-22.857 57.714-17.714 194.857-17.714 258.857s-5.143 201.143 17.714 258.857c8 20 17.714 34.857 33.143 50.286s30.286 25.143 50.286 33.143c57.714 22.857 194.857 17.714 258.857 17.714s201.143 5.143 258.857-17.714c20-8 34.857-17.714 50.286-33.143s25.143-30.286 33.143-50.286c22.857-57.714 17.714-194.857 17.714-258.857s5.143-201.143-17.714-258.857c-8-20-17.714-34.857-33.143-50.286s-30.286-25.143-50.286-33.143c-57.714-22.857-194.857-17.714-258.857-17.714zM877.714 512c0 60.571 0.571 120.571-2.857 181.143-3.429 70.286-19.429 132.571-70.857 184s-113.714 67.429-184 70.857c-60.571 3.429-120.571 2.857-181.143 2.857s-120.571 0.571-181.143-2.857c-70.286-3.429-132.571-19.429-184-70.857s-67.429-113.714-70.857-184c-3.429-60.571-2.857-120.571-2.857-181.143s-0.571-120.571 2.857-181.143c3.429-70.286 19.429-132.571 70.857-184s113.714-67.429 184-70.857c60.571-3.429 120.571-2.857 181.143-2.857s120.571-0.571 181.143 2.857c70.286 3.429 132.571 19.429 184 70.857s67.429 113.714 70.857 184c3.429 60.571 2.857 120.571 2.857 181.143z"></path>
            </svg>
            <svg
              viewBox="0 0 602.2582857142856 1024"
              className="thq-icon-small"
            >
              <path d="M548 6.857v150.857h-89.714c-70.286 0-83.429 33.714-83.429 82.286v108h167.429l-22.286 169.143h-145.143v433.714h-174.857v-433.714h-145.714v-169.143h145.714v-124.571c0-144.571 88.571-223.429 217.714-223.429 61.714 0 114.857 4.571 130.286 6.857z"></path>
            </svg>
          </div> */}
        </div>
        {link5DropdownVisible && (
          <div className="navbar8-container7 thq-box-shadow">
            <div className="navbar8-link5-menu-list">
              <a href={props.linkUrlPage1} onClick={handleSportClick}>
                <div className="navbar8-menu-item5">
                  <img
                    alt={props.page1ImageAlt}
                    src={props.page1ImageSrc}
                    className="navbar8-page1-image2 thq-img-ratio-1-1"
                  />
                  <div className="navbar8-content5">
                    <span>
                      {props.page1 ?? (
                        <Fragment>
                          <span className="navbar8-text17 thq-body-large">
                            Sports
                          </span>
                        </Fragment>
                      )}
                    </span>
                    <span>
                      {props.page1Description ?? (
                        <Fragment>
                          <span className="navbar8-text22 thq-body-small">
                            Explore upcoming sports events and buy tickets
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                </div>
              </a>
              <a href={props.linkUrlPage2} onClick={handleConcertClick}>
                <div className="navbar8-menu-item6">
                  <img
                    alt={props.page2ImageAlt}
                    src={props.page2ImageSrc}
                    className="navbar8-page2-image2 thq-img-ratio-1-1"
                  />
                  <div className="navbar8-content6">
                    <span>
                      {props.page2 ?? (
                        <Fragment>
                          <span className="navbar8-text20 thq-body-large">
                            Concerts
                          </span>
                        </Fragment>
                      )}
                    </span>
                    <span>
                      {props.page2Description ?? (
                        <Fragment>
                          <span className="navbar8-text23 thq-body-small">
                            Find tickets for the hottest concerts in town
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                </div>
              </a>
              <a href={props.linkUrlPage3} onClick={handleMovieClick}>
                <div className="navbar8-menu-item7">
                  <img
                    alt={props.page3ImageAlt}
                    src={props.page3ImageSrc}
                    className="navbar8-page3-image2 thq-img-ratio-1-1"
                  />
                  <div className="navbar8-content7">
                    <span>
                      {props.page3 ?? (
                        <Fragment>
                          <span className="navbar8-text25 thq-body-large">
                            Movies
                          </span>
                        </Fragment>
                      )}
                    </span>
                    <span>
                      {props.page3Description ?? (
                        <Fragment>
                          <span className="navbar8-text26 thq-body-small">
                            Get tickets for the latest movie releases
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        )}
      </header>
      {link5DropdownVisible && (
        <div
          onClick={() => setLink5DropdownVisible(false)}
          className="navbar8-container8"
        ></div>
      )}
    </header>
  );
};

Navbar8.defaultProps = {
  linkUrlPage4: "",
  link2Url: "",
  page4Description: undefined,
  page1ImageSrc:
    "https://images.unsplash.com/photo-1556741576-1d17b478d761?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNzE2OTQ3N3w&ixlib=rb-4.0.3&q=80&w=1080",
  action1: undefined,
  page2ImageAlt: "Concerts Image",
  link2: undefined,
  linkUrlPage2: "",
  logoAlt: "TicketHub Logo",
  page3ImageAlt: "Movies Image",
  linkUrlPage1: "",
  page1: undefined,
  link1: undefined,
  page4ImageSrc:
    "https://images.unsplash.com/photo-1525087963384-18370717ae2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNzE2OTQ3OHw&ixlib=rb-4.0.3&q=80&w=1080",
  linkUrlPage3: "",
  page4: undefined,
  page2: undefined,
  link4: undefined,
  page4ImageAlt: "Sell Tickets Image",
  page1Description: undefined,
  page2ImageSrc:
    "https://images.unsplash.com/photo-1667571256144-7aa5d0a1780f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNzE2OTQ3OXw&ixlib=rb-4.0.3&q=80&w=1080",
  page3ImageSrc:
    "https://images.unsplash.com/photo-1565373676943-403a8e5c2900?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNzE2OTQ4MHw&ixlib=rb-4.0.3&q=80&w=1080",
  page2Description: undefined,
  link3: undefined,
  page3: undefined,
  link1Url: "",
  page3Description: undefined,
  page1ImageAlt: "Home Image",
  action2: undefined,
  link3Url: "",
};

Navbar8.propTypes = {
  linkUrlPage4: PropTypes.string,
  link2Url: PropTypes.string,
  page4Description: PropTypes.element,
  page1ImageSrc: PropTypes.string,
  action1: PropTypes.element,
  page2ImageAlt: PropTypes.string,
  link2: PropTypes.element,
  linkUrlPage2: PropTypes.string,
  logoAlt: PropTypes.string,
  logoSrc: PropTypes.string,
  page3ImageAlt: PropTypes.string,
  linkUrlPage1: PropTypes.string,
  page1: PropTypes.element,
  link1: PropTypes.element,
  page4ImageSrc: PropTypes.string,
  linkUrlPage3: PropTypes.string,
  page4: PropTypes.element,
  page2: PropTypes.element,
  link4: PropTypes.element,
  page4ImageAlt: PropTypes.string,
  page1Description: PropTypes.element,
  page2ImageSrc: PropTypes.string,
  page3ImageSrc: PropTypes.string,
  page2Description: PropTypes.element,
  link3: PropTypes.element,
  page3: PropTypes.element,
  link1Url: PropTypes.string,
  page3Description: PropTypes.element,
  page1ImageAlt: PropTypes.string,
  action2: PropTypes.element,
  link3Url: PropTypes.string,
};

export default Navbar8;
