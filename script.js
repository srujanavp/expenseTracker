const API_URL = "https://crudcrud.com/api/c01e97ae923c4b889ed60bc52e7ae345/appointmentdata";

function addExpense() {
  const expense = document.getElementById("expense").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;

  if (expense !== "") {
    const expenseItem = { expense, description, category };

    axios.post(API_URL, expenseItem)
      .then(response => {
        console.log(response.data);
        displayExpenses(); // Refresh the list after adding
      })
      .catch(error => {
        console.error('Error adding expense:', error);
      });
  } else {
    alert("Please enter an expense amount.");
  }
}

function displayExpenses() {
  const expenseList = document.getElementById("expenseList");
  expenseList.innerHTML = "";

  axios.get(API_URL)
    .then(response => {
      const expenses = response.data;
      const categories = {
        Electronics: [],
        Food: [],
        SkinCare: [],
      };

      expenses.forEach((expense, index) => {
        categories[expense.category].push({ index, ...expense });
      });

      for (const category in categories) {
        if (
          categories.hasOwnProperty(category) &&
          categories[category].length > 0
        ) {
          const categoryHeader = document.createElement("h2");
          categoryHeader.textContent = category;
          expenseList.appendChild(categoryHeader);

          const categoryList = document.createElement("ul");
          categoryList.className = "list-group";

          categories[category].forEach((item) => {
            const listItem = document.createElement("li");
            listItem.className = "list-group-item";
            listItem.innerHTML = `
              ${item.expense}-${item.description}
              <button type="button" class="btn btn-danger btn-sm float-right" onclick="deleteExpense(${item.index})">Delete</button>
              <button type="button" class="btn btn-secondary btn-sm float-right mr-2" onclick="editExpense(${item.index})">Edit</button>
            `;
            categoryList.appendChild(listItem);
          });

          expenseList.appendChild(categoryList);
        }
      }
    })
    .catch(error => {
      console.error('Error fetching expenses:', error);
    });
}

function deleteExpense(index) {
  axios.delete(`${API_URL}/${index}`)
    .then(response => {
      console.log(response.data);
      displayExpenses(); // Refresh the list after deletion
    })
    .catch(error => {
      console.error('Error deleting expense:', error);
    });
}

function editExpense(index) {
  axios.get(API_URL)
    .then(response => {
      const expenses = response.data;
      const editedExpense = expenses[index];
      const newExpense = prompt("Enter new expense amount:", editedExpense.expense);
      if (newExpense !== null) {
        editedExpense.expense = newExpense;

        axios.put(`${API_URL}/${index}`, editedExpense)
          .then(response => {
            console.log(response.data);
            displayExpenses(); // Refresh the list after editing
          })
          .catch(error => {
            console.error('Error updating expense:', error);
          });
      }
    })
    .catch(error => {
      console.error('Error fetching expenses:', error);
    });
}

// Display existing expenses on page load
displayExpenses();
