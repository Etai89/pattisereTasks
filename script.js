// script.js
import { typesList } from './types.js'; // Import the typesList from types.js

$(document).ready(function() {
    const $type = $("#type");
    const $newTask = $("#newTask");
    const $add = $("#add");
    const $table = $("#table");
    const $amount = $('#amount');

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
    };

    // Function to display tasks in the table
    const displayTasks = () => {
        $table.empty(); // Clear the table before displaying updated tasks

        // Loop through each task and create a new row
        tasks.forEach((task, index) => {
            const newRow = $("<tr></tr>");
            $("<td></td>").text(task).appendTo(newRow);
            $("<td></td>").text(types[index]).appendTo(newRow);
            $("<td></td>").text(amounts[index]).appendTo(newRow);

            // Create a delete button with a click handler
            const deleteButton = $("<button>Delete</button>").on("click", function() {
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

    // Add the table headers once
    const addTableHeaders = () => {
        const headerRow = $("<tr></tr>");
        $("<th></th>").text("Task").appendTo(headerRow);
        $("<th></th>").text("Type").appendTo(headerRow);
        $("<th></th>").text("Amount").appendTo(headerRow);
        $("<th></th>").text("Actions").appendTo(headerRow); // For the delete button
        $("#table").append(headerRow);
    };

    // Initialize the table and select options
    addTableHeaders();  // Add headers once when the page loads
    populateSelect();    // Populate the select dropdown with types
    displayTasks();      // Display tasks in the table

    // Add new task
    $add.on("click", function() {
        const task = $newTask.val().trim();
        const taskType = $type.val().trim();  // Get the selected type
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

            displayTasks(); // Update the table with new data
        } else {
            alert("Please fill in all fields.");
        }
    });
});
 