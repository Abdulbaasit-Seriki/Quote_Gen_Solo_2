import React, { useState, useRef, useEffect } from "react";
import { Box, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import JoditEditor from "jodit-react";
import { convertDataToHtml } from "../pages/js/helper";
import XLSX from "xlsx";
import { toast } from "react-toastify";
import copy from "copy-to-clipboard";

const Template = ({ lead = {}, companyData = {}, ...props }) => {
  const editor = useRef(null);
  const [data, setData] = useState({});
  const [db, setDb] = useState({});
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (db.Rates) {
      const row = db.Rates.elements.find((row) => {
        return (
          row["FROM PROVINCEE"].trim() === lead.fromPro &&
          row["TO PROVINCE"].trim() === lead.toPro
        );
      });
      !row &&
        toast.error(
          `Please make sure that you typed ${lead.fromPro} and ${lead.toPro} correctly `,
          {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      const rowSub1 =
        db[lead.tableName1] &&
        db[lead.tableName1].elements.find((row) => {
          return row["City"].toUpperCase() === lead.fromCity;
        });
      const rowSub2 =
        db[lead.tableName2] &&
        db[lead.tableName2].elements.find((row) => {
          return row["City"].toUpperCase() === lead.toCity;
        });
      if (!rowSub1) {
        toast.error(
          `${lead.fromCity.charAt(0).toUpperCase() + lead.fromCity.slice(1)}, ${lead.fromPro
          }  is not on the prices sheet`,
          {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        return;
      }
      if (!rowSub2) {
        toast.error(
          `${lead.toCity.charAt(0).toUpperCase() + lead.toCity.slice(1)}, ${lead.toPro
          }  is not on the prices sheet`,
          {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        return;
      }
      if (row) {
        (!row || !row["WEIGHT RATE"]) &&
          toast.warn(
            `Please check that you fill all the prices on the prices sheet `,
            {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            }
          );
      }
      setData({
        ...lead,
        minCharge: row && row["MINIMUM CHARGE "],
        addWeight: row && row["WEIGHT RATE"],
        scale: db.Rates.elements[0]["SCALE FEE (CONSTANT)"],
        surcharge:
          (rowSub1.Surcharge
            ? parseFloat(rowSub1.Surcharge.toString().replace("$", ""))
            : 0) +
          (rowSub2.Surcharge
            ? parseFloat(rowSub2.Surcharge.toString().replace("$", ""))
            : 0),
        from:
          lead.fromCity.charAt(0).toUpperCase() +
          lead.fromCity.toLowerCase().slice(1) +
          " " +
          lead.fromPro,
        to:
          lead.toCity.charAt(0).toUpperCase() +
          lead.toCity.toLowerCase().slice(1) +
          " " +
          lead.toPro,
        name: lead.name.split(" ").find((word) => word),
      });
      const htmlData = {
        ...lead,
        minCharge: row && row["MINIMUM CHARGE "],
        addWeight: row && row["WEIGHT RATE"],
        scale: db.Rates.elements[0]["SCALE FEE (CONSTANT)"],
        surcharge:
          (rowSub1.Surcharge
            ? parseFloat(rowSub1.Surcharge.toString().replace("$", ""))
            : 0) +
          (rowSub2.Surcharge
            ? parseFloat(rowSub2.Surcharge.toString().replace("$", ""))
            : 0),
        from:
          lead.fromCity.charAt(0).toUpperCase() +
          lead.fromCity.toLowerCase().slice(1) +
          ", " +
          lead.fromPro,
        to:
          lead.toCity.charAt(0).toUpperCase() +
          lead.toCity.toLowerCase().slice(1) +
          ", " +
          lead.toPro,
        name: lead.name.split(" ").find((word) => word),
      };
      setContent(convertDataToHtml(htmlData, companyData));
    }
    // eslint-disable-next-line
  }, [lead, db]);
  useEffect(() => {
    async function fetch() {
      const db = {};
      let url = companyData.prices;     
      let req = new XMLHttpRequest();
      req.open("GET", url, true);
      req.responseType = "arraybuffer";
      req.onload = function (e) {
        try {
          let data = new Uint8Array(req.response);
          let workbook = XLSX.read(data, { type: "buffer" });
          var sheet_name_list = workbook.SheetNames;
          sheet_name_list.forEach((name) => {
            db[name] = {
              elements: XLSX.utils.sheet_to_json(workbook.Sheets[name], {
                raw: true,
                defval: null,
              }),
            };
          });
          setDb(db);
        } catch (err) {
        }
      };
      req.send();
    }
    setLoading(true);
    if (companyData.prices) {
      fetch();
    } else {
      toast.error(`This company didn't upload the price sheet`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    setLoading(false);
    // eslint-disable-next-line
  }, []);
  const classes = useStyles();
  // const handleSendEmail = async () => {
  //   const token = localStorage.getItem("token");
  //   const res = await sendEmail(
  //     { lead: content, emailTo: data.emailTo },
  //     token
  //   );
  //   if (res.data.done) {
  //     toast.success("Email has been sent", {
  //       position: "bottom-right",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //     });
  //   }
  //   setData({});
  //   setLoading(false);
  // };

  // Copy to clipboard function
  const copyToClipBoard = () => {
    copy(content);
    window.$('[data-toggle="popover"]').popover();
  };

  return (
    <div>
      {Object.keys(data).length > 0 && (
        <Box m={2} className={classes.right}>
          {!loading ? (
            <>
              <Box p={1.5} className={classes.email}>
                <JoditEditor
                  ref={editor}
                  value={content}
                  config={{ readonly: false }}
                  tabIndex={1}
                  onBlur={(newContent) => {
                    setContent(newContent);
                  }}
                  onChange={(newContent) => { }}
                />
              </Box>
              <Box mt={1} className={classes.sendPart}></Box>
              <button
                style={{
                  marginTop: "2rem",
                  backgroundColor: "#7EAFDC",
                  color: "black",
                  fontSize: "0.9375rem",
                }}
                type="button"
                class="btn btn-secondary"
                data-container="body"
                data-toggle="popover"
                data-placement="right"
                data-content="“Successfully copied to clipboard"
                onClick={copyToClipBoard}
              >
                COPY TO CLIPBOARD
              </button>
            </>
          ) : (
              <CircularProgress />
            )}
        </Box>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  email: {
    width: "90%",
    minHeight: "70vh",
    borderRadius: "4px",
    backgroundColor: "#f3f3f3",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    fontFamily: "sans-serif",
  },
  right: {
    display: "flex",
    flexDirection: "column",
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  emailBody: {
    textAlign: "left",
    width: "100%",
    lineHeight: "20px",
  },
  table: {
    minWidth: "50%",
    width: "70%",
  },
  name: {
    width: "100%",
    marginBottom: "5px",
    textAlign: "left",
  },
  title: {
    // color: "#7BA1CC",
    fontStyle: "italic",
    width: "100%",
    marginBottom: "5px",
    textAlign: "left",
  },
  tableCell: {
    border: "1px solid",
  },
  footer: {
    width: "100%",
    textAlign: "left",
  },
  sendPart: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
  },
  error: {
    color: "red",
  },
}));

export default Template;
