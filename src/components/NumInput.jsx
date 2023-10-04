// import React from "react";
// import PropTypes from "prop-types";
// import { NumericTextBox } from "@progress/kendo-react-inputs";
// import { GridCell } from "@progress/kendo-react-grid";

// class NumInput extends GridCell {
//   constructor(props) {
//     super(props);
//   }

//   handleChange = (e) => {
//     this.props.onChange({
//       dataItem: this.props.dataItem,
//       field: this.props.field,
//       syntheticEvent: e.syntheticEvent,
//       value: e.target.value,
//     });
//   };

//   render() {
//     return (
//       <td>
//         <NumericTextBox
//           value={this.props.dataItem[this.props.field]}
//           onChange={this.handleChange}
//           format={this.props.format}
//           max={this.props.max}
//           min={this.props.min}
//         />
//       </td>
//     );
//   }
// }

// NumInput.propTypes = {
//   dataItem: PropTypes.object.isRequired,
//   field: PropTypes.string.isRequired,
//   onChange: PropTypes.func.isRequired,
//   min: PropTypes.number,
//   max: PropTypes.number,
// };

// export default NumInput;

import React from "react";
import { NumericTextBox } from "@progress/kendo-react-inputs";

const NumInput = (props) => {
  const handleChange = (e) => {
    // console.log({
    //   dataItem: props.dataItem,
    //   field: props.field,
    //   syntheticEvent: e.syntheticEvent,
    //   value: e.target.value,
    // });
    //if (e.target.value > props.dataItem.quant) return;
    console.log(props);
    if (e.target.value === "") {
      props.onChange({
        dataItem: props.dataItem,
        field: props.field,
        syntheticEvent: e.syntheticEvent,
        value: 0,
      });
      return;
    }
    console.log({
      dataItem: props.dataItem,
      field: props.field,
      syntheticEvent: e.syntheticEvent,
      value:
        e.target.value > props.dataItem.quant
          ? props.dataItem.quant
          : e.target.value,
    });
    props.onChange({
      dataItem: props.dataItem,
      field: props.field,
      syntheticEvent: e.syntheticEvent,
      value:
        e.target.value > props.dataItem.quant
          ? props.dataItem.quant
          : e.target.value,
    });
    // props.dataItem[props.field] = e.target.value;

    // props.saveChanges({
    //   dataItem: props.dataItem,
    //   orderQuant: e.target.value,
    // });

    // console.log(props.dataItem[props.field]);
  };
  const [val, setVal] = React.useState(0);
  return (
    <td>
      <NumericTextBox
        // value={props.dataItem[props.field]}
        // onChange={handleChange}
        value={val}
        onChange={(e) => {
          if (e.target.value <= props.dataItem.quant) setVal(e.target.value);
        }}
        // format={this.props.format}
        max={props.dataItem.quant}
        min={0}
      />
    </td>
  );
};

export default NumInput;
