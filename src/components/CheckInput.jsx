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
// import { NumericTextBox } from "@progress/kendo-react-inputs";
import { Checkbox } from "@progress/kendo-react-inputs";

const CheckInput = (props) => {
  const field = props.field || "";
  const handleChange = (e) => {
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
  const [val, setVal] = React.useState(props.dataItem[field]);
  React.useEffect(() => {
    console.log("val = ", val);
  }, [val]);

  // const handleBlur = (e) => {

  // }
  return (
    <Checkbox
      checked={currentLinksArr?.includes(props.dataItem.uid)}
      onChange={async (e) => {
        if (e.value) {
          console.log(e);
          await setLinksReq({
            id: "",
            ProductScu: priceRecordId,
            Product1c: props.dataItem.uid,
          }).unwrap();
          props.onChange({
            dataItem: props.dataItem,
            field: props.field,
            syntheticEvent: e.syntheticEvent,
            value: "",
          });
          setCurrentLinksArr([...currentLinksArr, props.dataItem.uid]);
          // exec();
        } else {
          console.log(e);
          const res = await removeSingle(props.dataItem.linkId).unwrap();
          setCurrentLinksArr(
            currentLinksArr.filter((item) => item !== props.dataItem.uid)
          );
          if (linksArr) setQueryInfo(queryInfo);
        }
      }}
    />
  );
};

export default CheckInput;

// setCurrentLinksArr(
//     currentLinksArr.filter(
//       (item) => item !== props.dataItem.uid
//     )
//   );
//   if (linksArr) setQueryInfo(queryInfo);
