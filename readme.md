## Overview

The Chemical Supplies web application is designed to manage and maintain a database of chemical supplies. It allows users to perform various operations such as adding, editing, deleting, and organizing entries in a table format.

### Features

- Add new chemical entries.
- Edit existing entries.
- Delete entries.
- Move entries up or down in the list.
- Sort entries by various fields.
- Refresh the list to the last saved state.

## Application Structure

### 1. HTML Structure

The application is structured using HTML5, including:

- A **header** with buttons for actions.
- A **form** for adding or editing chemical entries.
- A **main section** that displays a table of chemical supplies.

### 2. CSS Styles

CSS styles define the visual aspects of the application, including layout and colors, using variables for consistency and easily manageable themes.

### 3. JavaScript Functionality

The JavaScript code manages interactions, data manipulation, and UI updates. Below is a detailed explanation of key functionalities:

#### Constants and Selectors

- **Constants** define URLs and select DOM elements needed for manipulation.
- **State Variables** track current data, last saved state, and unsaved changes.

#### Functions Overview

1. **Data Fetching**
    
    - The `fetchData(url)` function retrieves chemical supplies data from a given URL in JSON format. If there's an error, it logs the issue and returns an empty array.

2. **Data Management**
    
    - Functions like `getUIDataItemIndex(id)` help manage and manipulate the UI data array.
    - `saveData()` and `refreshUIData()` handle saving the last populated data and refreshing the UI data from the last saved state.

3. **Sorting and Rendering**
    
    - `sortUIData(property, dir, type)` enables sorting of the chemical entries based on specified properties (e.g., name, density).
    - The `renderTableUI(data)` function updates the displayed table with the current set of data.

4. **Row Management**
    
    - Functions to manage row selection and modification:
        - `selectRow(row)`: Selects a specific row and highlights it.
        - `deleteRow()`: Deletes the selected row and updates the data array accordingly.
        - `moveRowUp()` and `moveRowDown()`: Adjust the position of selected rows up or down in the list.

5. **Form Handling**
    
    - The form submission process is managed by listening for the `submit` event and dynamically updating the UI based on whether a new entry is being added or an existing one is being edited. The function handles data extraction from the form and updates the appropriate arrays.

6. **Event Listeners**
    
    - The application sets up event listeners for user interactions. Buttons for editing, adding, refreshing, and deleting entries call their respective functions.

7. **Observer for Unsaved Changes**
    
    - A `MutationObserver` monitors changes in the table and marks the state as unsaved if any changes occur, prompting users to confirm before refreshing the page.

### Initialization

- Initially, the application fetches data, populates the UI with the chemical supplies, and sets up necessary event listeners, ensuring a seamless experience from the start.

## Conclusion

The Chemical Supplies web app offers a robust interface for managing chemical supply data with diverse functionalities, ensuring efficient data handling and user interaction.

### Contributions

Help improve this project by contributing on GitHub with pull requests or reporting any issues encountered. Your feedback is valuable for future enhancements!

## Acknowledgments

I would like to acknowledge the following resources that greatly aided in the development of this web application:

- **Mozilla Developer Network (MDN)** for providing the documentation on web technologies and best practices.
- **React Icons** from [react-icons.github.io](https://react-icons.github.io/react-icons/) for icons
- **ChatGPT** for assisting in the creation of this documentation