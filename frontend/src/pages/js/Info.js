import React from "react";

const Info = () => {
  return (
    <div style={{ width: "60%" }}>
      <h3>Welcome to Quote Generator Powered by ImMoving</h3>
      <ul>
        <p>Step 1: Select the type of lead you would like to input</p>
        <p>Step 2: Copy the lead from your email into the box below</p>
        <p>Step 3: Click generate!</p>
        <span style={{ color: "grey" }}>
          Your outgoing sales email with associated pricing structure will
          automatically be created.
          <br />
          Feel free to edit your email after it’s generated and when you’re
          satisfied, copy to clipboard and paste in your outgoing sales email.
        </span>
      </ul>
    </div>
  );
};

export default Info;
