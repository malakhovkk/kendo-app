import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  useAddContactMutation,
  useEditVendorContactsMutation,
} from "../features/apiSlice";
import { Window } from "@progress/kendo-react-dialogs";
import Select from "react-select";
function PopUpContactVendors({
  showContactVisibility,
  closeEditDialog,
  idContact,
  contactType,
  initialValue,
}) {
  console.log(initialValue);

  const [editContactData, setEditContactData] = React.useState();
  React.useEffect(() => {
    setEditContactData(initialValue);
  }, [initialValue]);
  const [editContact] = useEditVendorContactsMutation();
  const [addContact] = useAddContactMutation();

  const saveEdit = () => {
    editContact(editContactData);
    closeEditDialog();
    setEditContactData({});
  };
  const saveContact = () => {
    addContact({ body: { ...editContactData, vendorId: idContact, id: "" } });
    setEditContactData({});
    closeEditDialog();
  };
  console.log("PopUpContactVendors");
  return (
    (showContactVisibility === 1 || showContactVisibility === 3) && (
      <Window
        title={"User"}
        onClose={() => {
          closeEditDialog();
          setEditContactData({});
        }}
        initialHeight={350}
      >
        <form className="k-form">
          <fieldset>
            <legend>Edit contact</legend>

            <label className="k-form-field">
              <span>Имя</span>
              <input
                className="k-input"
                value={editContactData.name}
                onChange={(e) =>
                  setEditContactData({
                    ...editContactData,
                    name: e.target.value,
                  })
                }
                placeholder="Name"
              />
            </label>
            <label className="k-form-field">
              <span>Контакт</span>
              <input
                className="k-input"
                value={editContactData.contact}
                onChange={(e) =>
                  setEditContactData({
                    ...editContactData,
                    contact: e.target.value,
                  })
                }
                placeholder="Contact"
              />
            </label>
            <Select
              options={contactType}
              onChange={(e) => {
                console.log(e.value);
                // onSelectFilter(e, idx);
                setEditContactData({ ...editContactData, type: e.value });
              }}
              placeholder={"Тип"}
            />
          </fieldset>

          <div className="text-right">
            <button
              type="button"
              className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
              onClick={() => {
                closeEditDialog();
                setEditContactData({});
              }}
            >
              Cancel
            </button>
            {showContactVisibility === 1 && (
              <button
                type="button"
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                onClick={saveEdit}
              >
                Submit
              </button>
            )}
            {showContactVisibility === 3 && (
              <button
                type="button"
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                onClick={saveContact}
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </Window>
    )
  );
}

export default PopUpContactVendors;
