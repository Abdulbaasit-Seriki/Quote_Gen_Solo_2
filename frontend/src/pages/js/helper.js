import Fuse from "fuse.js";
const allPRo = [
  { short: "QC", name: "Quebec" },
  { short: "QC", name: "Quebec" },
  { short: "QC", name: "Quebec" },
  { short: "QC", name: "Quebec" },
  { short: "QC", name: "Quebec" },
  { short: "ON", name: "Ontario" },
  { short: "NS", name: "Nova Scotia" },
  { short: "NB", name: "New Brunswick" },
  { short: "MB", name: "Manitoba" },
  { short: "BC", name: "British Columbia" },
  { short: "PE", name: "Prince Edward Island" },
  { short: "SK", name: "Saskatchewan" },
  { short: "AB", name: "Alberta" },
  { short: "NL", name: "Newfoundland and Labrador" },
  { short: "YT", name: "Yukon" },
  { short: "NU", name: "Nunavut" },
  { short: "NT", name: "Northwest Territories" },
];
const fuse = new Fuse(allPRo, { keys: ["short", "name"] });
const lead_1_keys = [
  "Move Date",
  "Type of Move",
  "Move Size",
  "Origin",
  "Destination",
  "Contact Preference",
  "First Name",
  "Last Name",
  "Email Address",
  "Phone",
  "Phone2",
];
const lead_2_keys = [
  "Name",
  "Phone",
  "Phone 2",
  "Email",
  "From",
  "To",
  "Move Size",
  "Move Date",
  "Flexible on Move Date",
  "Preferred Method of Contact",
  "Comments",
];
export const convertLead = (lead, type) => {
  switch (type) {
    case 1:
      return convertType1(lead);
    case 2:
      return convertType2(lead);
    default:
  }
};
const convertType1 = (lead) => {
  const string = lead
    .substring(lead.indexOf("Move Date"))
    .replace("CONTACT DETAILS", "");
  const finalData = convertToObject(string, lead_1_keys);
  const fromPro = getProFormAddress(finalData.origin);
  const toPro = getProFormAddress(finalData.destination);
  const fromCity = finalData.origin
    ? finalData.origin.trim().split(",")[0].trim().toUpperCase()
    : "";
  const toCity = finalData.destination
    ? finalData.destination.trim().split(",")[0].trim().toUpperCase()
    : "";
  const data = {
    fromPro,
    toPro,
    fromCity,
    toCity,
    from: finalData.origin,
    to: finalData.destination,
    ...finalData,
  };
  const { isOk, errors } = checkIfTrueLead1(data);
  const tableName1 =
    fromPro && fromPro === "BC" ? "BC -Cities" : fromPro + " - Cities";
  const tableName2 =
    toPro && toPro === "BC" ? "BC -Cities" : toPro + " - Cities";
  return {
    isOk,
    ...data,
    errors,
    tableName1,
    tableName2,
    name: finalData["first name"] ? finalData["first name"] : "",
  };
};

const convertType2 = (lead) => {
  const finalData = convertToObject(lead, lead_2_keys);
  if (!finalData) {
    return { isOk: false, errors: ["Invalid input"] };
  }
  const fromPro = getProFormAddressLead2(finalData.from);
  const toPro = getProFormAddressLead2(finalData.to);
  const fromCity = finalData.from
    ? finalData.from.trim().split(",")[0].trim().toUpperCase()
    : "";
  const toCity = finalData.to
    ? finalData.to.trim().split(",")[0].trim().toUpperCase()
    : "";
  const data = { ...finalData, fromPro, toPro, fromCity, toCity };
  const { isOk, errors } = checkIfTrueLead2(data);
  const tableName1 =
    fromPro && fromPro === "BC" ? "BC -Cities" : fromPro + " - Cities";
  const tableName2 =
    toPro && toPro === "BC" ? "BC -Cities" : toPro + " - Cities";
  return { isOk, ...data, errors, tableName1, tableName2 };
};

export const checkLeadType = (lead) => {
  if (lead.includes("iRelocate") || lead.includes("First Name")) {
    return 1;
  }
  return 2;
};

// function convertToObject(lead) {
//     const data = lead.split(/\r?\n/).map(elemnt => {
//         const obconst convertToObjectLead1 = leadject = elemnt.split(":")
//         if (object.length === 2) {
//             const key = object[0].replace(/\s+/g, ' ').trim().toLowerCase()
//             const value = object[1].replace(/\s+/g, ' ').trim()
//             return {
//                 [key]: value
//             }
//         }
//         return {}
//     })
//     const finalData = data.reduce(function (result, currentObject) {
//         for (var key in currentObject) {
//             if (currentObject.hasOwnProperty(key)) {
//                 result[key] = currentObject[key];
//             }
//         }
//         return result;
//     }, {})

//     return finalData
// }

function checkIfTrueLead1(object) {
  const errors = [];
  if (!object["first name"].replace(" ", "")) {
    errors.push("The first name is missing");
  }
  if (!object.to) {
    errors.push("The Destination is missing or misspelled");
  }
  if (!object.from) {
    errors.push("The Origin is missing or misspelled");
  }
  if (!object.toCity) {
    errors.push("The Destination city is missing");
  }
  if (!object.fromCity) {
    errors.push("The Origin city is missing");
  }
  if (!object.toPro) {
    errors.push("The Destination providence is missing");
  }
  if (!object.fromPro) {
    errors.push("The Origin providence is missing");
  }
  return { isOk: !errors.length, errors };
}

function checkIfTrueLead2(object) {
  const errors = [];
  if (!object.name) {
    errors.push("The name is missing");
  }
  if (!object.to) {
    errors.push("The Destination is missing");
  }
  if (!object.from) {
    errors.push("The Origin is missing");
  }
  if (!object.toCity) {
    errors.push("The Destination city is missing");
  }
  if (!object.fromCity) {
    errors.push("The Origin city is missing");
  }
  if (!object.toPro) {
    errors.push("The Destination providence is missing");
  }
  if (!object.fromPro) {
    errors.push("The Origin providence is missing");
  }
  return { isOk: !errors.length, errors };
}

const getProFormAddress = (address) => {
  if (!address) return [];
  const pro = address.split(",")[1];
  const item = allPRo.find((_) => pro.includes(_.short));
  return item ? item.short : "";
};

const convertToObject = (lead, cont_keys) => {
  let string = lead;
  cont_keys.forEach((key, index) => {
    if (index === 0) {
      string = string.replace(key + ":", `"${key}":"`);
    }
    string = string.replace(key + ":", `","${key}":"`);
  });
  const finalString =
    '{"frist":true,' + string.split(/\r?\n/).join("") + '","end":true}';
  try {
    var obj = JSON.parse(finalString.replace(/\t/g, ""));
  } catch (error) {
    return false;
  }
  var key,
    keys = Object.keys(obj);
  var n = keys.length;
  var newobj = {};
  while (n--) {
    key = keys[n];
    newobj[key.toLowerCase()] = obj[key];
  }
  return newobj;
};

const getProFormAddressLead2 = (address) => {
  const pro = address.split(",")[1];
  const result = fuse.search(pro);
  return result && result[0].item.short;
};

export const convertDataToHtml = (data, companyData) => {
  //   const { logo } = companyData;
  //   return `
  //<meta http-equiv="content-type" content="text/html; charset=utf-8">
  // ${logo && `<img src="${logo}" alt="LOgo">`}    <br />
  //   <span>Hi, ${data.name}</span>

  //   <br />
  //   <p>Thanks for your inquiry for your upcoming move from ${data.from} to ${
  //     data.to
  //   }.
  //   Please see below for pricing details. If you would like to discuss
  //  anything further in regards to the quote, the process, or anything else,
  //   we are more than happy to assist.</p>
  //   <span class="makeStyles-title-298">Pricing for your move is would be as follows:</span>
  //   <div class="MuiTableContainer-root">
  return `  <table class="MuiTable-root makeStyles-table-296" aria-label="a dense table">
    <thead class="MuiTableHead-root" style="background-color: rgb(156, 201, 243);">
      <tr class="MuiTableRow-root MuiTableRow-head">
        <th class="MuiTableCell-root MuiTableCell-head makeStyles-tableCell-299 MuiTableCell-alignCenter MuiTableCell-sizeSmall" scope="col">Charges</th>
        <th class="MuiTableCell-root MuiTableCell-head makeStyles-tableCell-299 MuiTableCell-alignCenter MuiTableCell-sizeSmall" scope="col">Price</th>
      </tr>
    </thead>
  <tbody class="MuiTableBody-root">
  <tr class="MuiTableRow-root">
  <td class="MuiTableCell-root MuiTableCell-body makeStyles-tableCell-299 MuiTableCell-sizeSmall">Minimum Charge (1,000 lbs):</td>
  <td class="MuiTableCell-root MuiTableCell-body makeStyles-tableCell-299 MuiTableCell-sizeSmall">$${
    data.minCharge ? data.minCharge : 0
  }</td>
  </tr>
  <tr class="MuiTableRow-root">
  <td class="MuiTableCell-root MuiTableCell-body makeStyles-tableCell-299 MuiTableCell-sizeSmall">Additional Weight :</td>
  <td class="MuiTableCell-root MuiTableCell-body makeStyles-tableCell-299 MuiTableCell-sizeSmall">$${
    data.addWeight ? data.addWeight : 0
  }/LBS</span></td>
  </tr>
  <tr class="MuiTableRow-root">
  <td class="MuiTableCell-root MuiTableCell-body makeStyles-tableCell-299 MuiTableCell-sizeSmall">Scaling Fee :</td>
  <td class="MuiTableCell-root MuiTableCell-body makeStyles-tableCell-299 MuiTableCell-sizeSmall">$${
    data.scale ? data.scale : 0
  }</td></tr>
  <tr class="MuiTableRow-root">
  <td class="MuiTableCell-root MuiTableCell-body makeStyles-tableCell-299 MuiTableCell-sizeSmall">Pickup/Delivery/Ferry Surcharge:</td>
  <td class="MuiTableCell-root MuiTableCell-body makeStyles-tableCell-299 MuiTableCell-sizeSmall">$${
    data.surcharge >= 0 ? parseFloat(data.surcharge).toFixed(2) : 0
  }</td>
  </tr>
  </tbody>
  </table><br/>
  ${companyData.template}`;
  //   </div>
  //   <div class="makeStyles-footer-300">
  //   <p>*Averages calculated based on client-submitted weight information*</p>
  // ${companyData.template}
  // </div>`;
};
