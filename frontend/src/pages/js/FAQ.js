import React, { Fragment, useState, useRef } from "react";

import NavBar from "../../components/NavBar";

const FAQ = () => {
  const toggleIcon = useRef([]);

  let faqHeadingStyles = {
    backgroundColor: "#0067b8",
    color: "white",
    fontWeight: "10px",
  };

  let headingStyle = {
    position: "absolute",
    marginLeft: "5rem",
    marginTop: "1rem",
  };

  let [content] = useState({
    displayIcon: false,
    faqData: [
      {
        heading: "What is your name",
        id: "header",
        nestHeading: [
          {
            id: "header",
            nestId: "nestfirst",
            head: "This is a nested heading",
            ans: "Hello i am working now",
          },
        ],
      },
      {
        heading: "What is your name",
        id: "heads",
        nestHeading: [
          {
            id: "heads",
            nestId: "nest",
            head: "This is a nested heading",
            ans: "Hello i am working now",
          },
        ],
      },
    ],
  });

  // Handler for handling the icon state
  const iconChangeHandler = (index) => {
    if (
      toggleIcon.current[index].className.split(" ")[1] === "fa-minus-circle"
    ) {
      toggleIcon.current[index].className = "fa fa-plus-circle";
    } else {
      toggleIcon.current[index].className = "fa fa-minus-circle";
    }
  };

  // Function to assign refs

  const faqRenderingHandler = (props, index) => {
    return (
      <div key={Math.floor(Math.random() * 20 + 1).toString()}>
        <div
          key={Math.floor(Math.random() * 20 + 1).toString()}
          className="collapse"
          id={props.id}
          data-toggle="collapse"
          data-target={"#" + props.nestId}
          aria-expanded="true"
          aria-controls="collapseExample"
        >
          <div className="card card-body">{props.head}</div>
        </div>

        {content.displayIcon ? (
          <div className="collapse" id={props.nestId}>
            <div className="card card-body">{props.ans}</div>
          </div>
        ) : undefined}
      </div>
    );
  };

  return (
    <Fragment>
      <NavBar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12" style={faqHeadingStyles}>
            <p style={{ fontWeight: "8rem", fontSize: "2.5rem" }}>
              Frequently Asked Questions
            </p>
          </div>
          <div className="col-sm-12">
            <div className="row">
              {content.faqData.map((props, index) => {
                //toggleIcon.current.push(index);
                return (
                  <div
                    className="col-sm-12  border-bottom"
                    key={Math.floor(Math.random() * 20 + 1).toString()}
                  >
                    <div
                      key={Math.floor(Math.random() * 20 + 1).toString()}
                      className="col-sm-12"
                      data-toggle="collapse"
                      data-target={"#" + props.id}
                      aria-expanded="false"
                      aria-controls="collapseExample"
                    >
                      <span style={headingStyle}>{props.heading} </span>
                      <p>
                        <i
                          id={Math.floor(Math.random() * 20 + 1).toString()}
                          key={Math.floor(Math.random() * 20 + 1).toString()}
                          ref={(el) => toggleIcon.current.push(el)}
                          className="fa fa-plus-square"
                          style={{ fontSize: "48px", display: "block" }}
                          onClick={iconChangeHandler.bind(this, index)}
                        ></i>
                      </p>
                    </div>
                    {props.nestHeading.map(faqRenderingHandler)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default FAQ;
