import React, { useEffect } from "react";
import Navbar from "../../components/NavBar";
import { validate } from "../../services/auth";
import { resendValidateEmail } from "../../services/company";
import queryString from "query-string";
import CardTitle from "../../components/CardTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@material-ui/core";
const Validate = ({ location, history, ...props }) => {
  const { token, id } = queryString.parse(location.search);
  if (!localStorage.getItem("email")) {
     localStorage.setItem("email", location.state.email);
  }
  const email = localStorage.getItem("email");
  useEffect(() => {
    async function validateFun() {
      await validate({ token, id });
    }
    if (token && id) {
      validateFun();
    }
  }, [token, id]);

  const handleResendEmail = async () => {
    const token = localStorage.getItem("token");

    await resendValidateEmail(token);
  };
  return (
    <>
      <Navbar history={history} show={false} />
      {token && id ? (
        <CardTitle
          body={
            <>
              <FontAwesomeIcon icon="check-circle" color="#6DB65B" size="5x" />
              <p>Success!</p>
              <p>You’re ready to use Quote Generator.</p>
              <p>Follow the link below to continue.</p>
              <Button
                variant="contained"
                color="primary"
                style={{ color: "#FFFFFF" }}
                onClick={() => window.location.reload(false)}
              > Proceed
              </Button>
            </>
          }
        />
      ) : (
        <CardTitle
          title="Please Confirm your email address"
          body={
            <>
              <p>
                You’re almost there! We just need to make sure it’s you. You are
                almost there!
              </p><br></br>
              <p>
                We have sent an email to
                <i>
                  {" "}
                  <strong>{email}</strong>
                </i>
              </p>
              <p style={{ textAlign: "center" }}>
                Please check your inbox for confirmation email. Click the link
                in your email to complete your verification.
              </p>
              <p> After you verify, return to this page to continue </p>
              <p>
                Didn't receive the email?{" "}
                <span
                  style={{
                    color: "#7EAFDC",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={handleResendEmail}
                >
                  Send it again
                </span>
              </p>
            </>
          }
        />
      )}
    </>
  );
};

export default Validate;
