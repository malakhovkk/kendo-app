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
    // props.onChange({
    //   dataItem: props.dataItem,
    //   field: props.field,
    //   syntheticEvent: e.syntheticEvent,
    //   value: e.target.value,
    // });
    props.dataItem[props.field] = e.target.value;
    props.saveChanges(props.dataItem);
    // console.log(props.dataItem[props.field]);
  };

  return (
    <td>
      <NumericTextBox
        value={props.dataItem[props.field]}
        onChange={handleChange}
        // format={this.props.format}
        // max={this.props.max}
        // min={this.props.min}
      />
    </td>
  );
};

export default NumInput;
