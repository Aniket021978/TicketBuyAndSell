import React, { useEffect,Fragment,forwardRef } from 'react'
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'

import './cta26.css'

const CTA26 = forwardRef((props, ref) => {
  const navigate = useNavigate(); 

  const handleClick = () => {
    navigate('/GetTickets'); 
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="thq-section-padding" ref={ref} id="cta26">
      <div className="thq-section-max-width">
        <div className="cta26-accent2-bg">
          <div className="cta26-accent1-bg">
            <div className="cta26-container2">
              <div className="cta26-content">
                <span>
                  {props.heading1 ?? (
                    <Fragment>
                      <span className="cta26-text4 thq-heading-2">
                        Find Your Tickets Now!
                      </span>
                    </Fragment>
                  )}
                </span>
                <p>
                  {props.content1 ?? (
                    <Fragment>
                      <p className="cta26-text5 thq-body-large">
                        Browse through a wide selection of tickets for concerts,
                        movies, and more.
                      </p>
                    </Fragment>
                  )}
                </p>
              </div>
              <div className="cta26-actions">
                <button
                  type="button"
                  className="thq-button-filled cta26-button"
                  onClick={handleClick}
                >
                  <span>
                    {props.action1 ?? (
                      <Fragment>
                        <span className="cta26-text6">Get Tickets</span>
                      </Fragment>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

CTA26.defaultProps = {
  heading1: undefined,
  content1: undefined,
  action1: undefined,
}

CTA26.propTypes = {
  heading1: PropTypes.element,
  content1: PropTypes.element,
  action1: PropTypes.element,
}

export default CTA26
