import { typesList } from './types.js'; // Import the typesList from types.js

$(document).ready(function () {
    const $type = $("#type");
    const $newTask = $("#newTask");
    const $add = $("#add");
    const $table = $("#table");
    const $amount = $('#amount');
    const $orderedList = $('#orderedList');
    const $copyButton = $('#copyButton');
    const $order = $('#order');  // Corrected this line

    // Retrieve data from localStorage or initialize as empty arrays if not present
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let types = JSON.parse(localStorage.getItem("types")) || [];
    let amounts = JSON.parse(localStorage.getItem("amount")) || [];

    // Function to populate the select options from the typesList object
    const populateSelect = () => {
        $type.empty();  // Clear any existing options

        // Loop through the typesList object and add options to the select
        Object.keys(typesList).forEach((key) => {
            const option = $("<option></option>").val(key).text(typesList[key]);
            $type.append(option);  // Append the option to the select
        });

        // Add "אחר" option at the end of the dropdown
        const otherOption = $("<option></option>").val("other").text("אחר");
        $type.append(otherOption);
    };

    // Function to display tasks in the table
    const displayTasks = () => {
        $table.empty(); // Clear the table before displaying updated tasks

        // Loop through each task and create a new row
        tasks.forEach((task, index) => {
            const newRow = $("<tr></tr>");
            const checkbox = $("<input type='checkbox' class='task-checkbox'>").data("index", index);

            $("<td></td>").append(checkbox).appendTo(newRow);
            $("<td></td>").text(task).appendTo(newRow);
            $("<td></td>").text(types[index]).addClass("type-cell").appendTo(newRow); // Add class to type cell
            $("<td></td>").text(amounts[index]).appendTo(newRow);

            // Create a delete button with a click handler
            const deleteButton = $("<button>מחיקה</button>").on("click", function () {
                deleteTask(index);
            });

            // Create an actions column with the delete button
            const actionsCell = $("<td></td>").append(deleteButton);
            newRow.append(actionsCell);

            // Append the new row to the table
            $table.append(newRow);
        });
    };

    // Function to delete a task by index
    const deleteTask = (index) => {
        tasks.splice(index, 1); // Remove task from the array
        types.splice(index, 1); // Remove type from the array
        amounts.splice(index, 1); // Remove amount from the array

        // Save updated arrays to localStorage
        localStorage.setItem("tasks", JSON.stringify(tasks));
        localStorage.setItem("types", JSON.stringify(types));
        localStorage.setItem("amount", JSON.stringify(amounts));

        displayTasks(); // Update the table with the new data
    };

    // Function to sort tasks by type (A-Z)
    const sortTasksByType = () => {
        const sortedIndexes = types.map((type, index) => ({ type, index }))
            .sort((a, b) => a.type.localeCompare(b.type))
            .map(item => item.index);

        tasks = sortedIndexes.map(index => tasks[index]);
        types = sortedIndexes.map(index => types[index]);
        amounts = sortedIndexes.map(index => amounts[index]);

        localStorage.setItem("tasks", JSON.stringify(tasks));
        localStorage.setItem("types", JSON.stringify(types));
        localStorage.setItem("amount", JSON.stringify(amounts));

        displayTasks();
    };

    // Add the table headers once
    const addTableHeaders = () => {
        const headerRow = $("<tr></tr>");
        $("<th></th>").text("Select").appendTo(headerRow);
        $("<th></th>").text("Task").appendTo(headerRow);
        $("<th></th>").text("Type").appendTo(headerRow);
        $("<th></th>").text("Amount").appendTo(headerRow);
        $("<th></th>").text("Actions").appendTo(headerRow); // For the delete button
        $("#table").append(headerRow);
    };

    // Update the ordered list of selected tasks
    const updateOrderedTasks = () => {
        const selectedTasks = [];
        $(".task-checkbox:checked").each(function () {
            const index = $(this).data("index");
            selectedTasks.push({
                task: tasks[index],
                amount: amounts[index],
                type: types[index]
            });
        });

        // Display the ordered tasks
        if (selectedTasks.length > 0) {
            const type = selectedTasks[0].type;  // Assuming all selected tasks have the same type
            let listHtml = `<h3>${type}</h3><ul>`;
            selectedTasks.forEach(item => {
                listHtml += `<li>* ${item.task} - ${item.amount}</li>`;
            });
            listHtml += `</ul>`;
            $orderedList.html(listHtml);
        } else {
            $orderedList.html("<p>לא נבחרו מוצרים</p>");
        }
    };

    // Initialize the table and select options
    addTableHeaders();  // Add headers once when the page loads
    populateSelect();    // Populate the select dropdown with types
    displayTasks();      // Display tasks in the table

    // Add new task
    $add.on("click", function () {
        const task = $newTask.val().trim();
        let taskType = $type.val().trim();  // Get the selected type

        // If the type is "other", use the custom input value
        if (taskType === "other") {
            taskType = $type.siblings("input").val().trim();  // Get value from the input field
        }

        const taskAmount = $amount.val().trim();

        if (task && taskType && taskAmount) {
            tasks.push(task);
            types.push(taskType);
            amounts.push(taskAmount);

            // Save updated arrays to localStorage
            localStorage.setItem("tasks", JSON.stringify(tasks));
            localStorage.setItem("types", JSON.stringify(types));
            localStorage.setItem("amount", JSON.stringify(amounts));

            // Clear input fields
            $newTask.val("");
            $type.val("");  // Clear the select dropdown
            $amount.val("");
            sortTasksByType();
            displayTasks(); // Update the table with new data
        } else {
            alert("תמלא את כל השדות");
        }
    });

    // Button to order selected tasks
    $order.on("click", function () {
        updateOrderedTasks();
    });

    sortTasksByType();

    // Button to copy selected tasks to clipboard with title
    $copyButton.on("click", function () {
        const selectedTasks = [];
        $(".task-checkbox:checked").each(function () {
            const index = $(this).data("index");
            selectedTasks.push({
                task: tasks[index],
                amount: amounts[index],
                type: types[index]
            });
        });

        if (selectedTasks.length > 0) {
            const type = selectedTasks[0].type;  // Assuming all selected tasks have the same type
            let textToCopy = `${type}\n`;  // Add the title (type)

            selectedTasks.forEach(item => {
                textToCopy += `* ${item.task} - ${item.amount}\n`;  // Format as list item
            });

            // Copy to clipboard
            navigator.clipboard.writeText(textToCopy).then(() => {
                alert("Tasks copied to clipboard!");
            });
        } else {
            alert("No tasks selected to copy.");
        }
    });

    // Event listener to select all tasks of the same type when the type text is clicked
    $(document).on("click", ".type-cell", function() {
        const clickedType = $(this).text().trim();

        // Loop through all tasks and check checkboxes for those with the clicked type
        $("tr").each(function() {
            const rowType = $(this).find("td:eq(2)").text().trim();
            if (rowType === clickedType) {
                $(this).find(".task-checkbox").prop("checked", true);
            }
        });
    });

    // Event listener to switch from select dropdown to input field for "אחר"
    $type.on("change", function() {
        if ($(this).val() === "other") {
            $(this).hide();  // Hide the select dropdown
            const $input = $("<input type='text' id='customType' placeholder='Enter custom type'>");
            $(this).after($input);  // Append the input field after the select
        } else {
            $("#customType").remove();  // Remove the input field if it's not "other"
            $(this).show();  // Show the select dropdown again
        }
    });
});
