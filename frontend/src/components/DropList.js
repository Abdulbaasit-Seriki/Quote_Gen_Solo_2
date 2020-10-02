import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { InputLabel, FormControl, Select, MenuItem } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: "90%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
const DropList = ({
  options = [],
  label = "Lead Type",
  onChange = () => {},
  hasNone = false,
  value = "",
}) => {
  const classes = useStyles();
  const [selected, setSelected] = React.useState(value);
  const handleChange = (event) => {
    setSelected(event.target.value);
    onChange(event.target.value);
  };
  return (
    <FormControl
      variant="filled"
      className={classes.formControl}
      style={{ marginTop: "5rem" }}
    >
      <InputLabel id="demo-simple-select-filled-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-filled-label"
        id="demo-simple-select-filled"
        value={selected}
        onChange={handleChange}
      >
        {hasNone && (
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
        )}
        {options.length > 0 &&
          options.map((option, index) => (
            <MenuItem key={index} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default DropList;
