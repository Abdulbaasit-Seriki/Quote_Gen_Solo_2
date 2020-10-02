import React from "react";
import "../css/404.css";
const NotFound = ({ history }) => {
  return (
    <div className="main">
        <div className="row">
          <div className="xs-12 md-6 mx-auto">
            <div id="content">
              <div className="number" data-count="404">
                404
              </div>
              <div className="text">Page not found</div>
              <div className="text" onClick={() => history.goBack()}>
                <u>
                  <b>Click here to Go Back</b>
                </u>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default NotFound;
