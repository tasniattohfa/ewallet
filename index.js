
// UI
document.querySelector('#ewallet-form').addEventListener('submit', function (e) {
    e.preventDefault();
    console.log('submitted');

    const type = document.querySelector('.add__type').value;
    const desc = document.querySelector('.add__description').value;
    const value = document.querySelector('.add__value').value;
    const currentTime = getCurrentTimeFormatted();

    if (desc.length > 0 && value.length > 0) {
        addItems(type, desc, value, currentTime);
        resetForm();
        saveToLocalStorage(type, desc, value, currentTime);
    }
});

function addItems(type, desc, value, currentTime) {
    const newHtml = `
      <div class="item">
        <div class="item-description-time">
          <div class="item-description">
            <p>${desc}</p>
          </div>
          <div class="item-time">
            <p>${currentTime}</p>
          </div>
        </div>
        <div class="item-amount ${type === '+' ? 'income-amount' : 'expense-amount'}">
          <p>${type}$${sep(value)}</p>
        </div>
      </div>`;

    const collection = document.querySelector('.collection');
    collection.insertAdjacentHTML('afterbegin', newHtml);

    // Calculate and update totals
    updateTotals();
}

function saveToLocalStorage(type, desc, value, currentTime) {
    // Retrieve existing stored items from local storage
    const storedItems = localStorage.getItem('items');

    // Parse stored items as JSON or create an empty array if no items exist
    const items = storedItems ? JSON.parse(storedItems) : [];

    // Create a new item object with the input values
    const newItem = {
        type,
        desc,
        value,
        currentTime
    };

    // Add the new item to the items array
    items.push(newItem);

    // Store the updated items array back to local storage
    localStorage.setItem('items', JSON.stringify(items));

    // Calculate and update totals
    updateTotals();
}

function resetForm() {
    document.querySelector('.add__type').value = '+';
    document.querySelector('.add__description').value = '';
    document.querySelector('.add__value').value = '';
}

function getCurrentTimeFormatted() {
    const currentDate = new Date();
    const options = {
        day: '2-digit',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    };

    return currentDate.toLocaleString('en-US', options);
}

// Display stored items from local storage on page load
window.addEventListener('DOMContentLoaded', function () {
    displayStoredItems();
});

function displayStoredItems() {
    // Retrieve stored items from local storage
    const storedItems = localStorage.getItem('items');

    // Check if there are any stored items
    if (storedItems) {
        // Parse stored items as JSON
        const items = JSON.parse(storedItems);

        // Get the collection container element
        const collection = document.querySelector('.collection');

        // Iterate over the items and generate HTML for each item
        items.forEach(function (item) {
            const newHtml = `
          <div class="item">
            <div class="item-description-time">
              <div class="item-description">
                <p>${item.desc}</p>
              </div>
              <div class="item-time">
                <p>${item.currentTime}</p>
              </div>
            </div>
            <div class="item-amount ${item.type === '+' ? 'income-amount' : 'expense-amount'}">
              <p>${item.type}$${sep(item.value)}</p>
            </div>
          </div>`;

            // Add the generated HTML to the collection container
            collection.insertAdjacentHTML('afterbegin', newHtml);
        });

        // Calculate and update totals
        updateTotals();
    }
}

function updateTotals() {
    // Retrieve stored items from local storage
    const storedItems = localStorage.getItem('items');

    // Check if there are any stored items
    if (storedItems) {
        // Parse stored items as JSON
        const items = JSON.parse(storedItems);

        // Calculate total income and total expense
        let totalIncome = 0;
        let totalExpense = 0;

        items.forEach(function (item) {
            if (item.type === '+') {
                totalIncome += parseInt(item.value);
            } else if (item.type === '-') {
                totalExpense += parseInt(item.value);
            }
        });
        // document.getElement('totalIncome').textContent = `${totalIncome}`;
        // document.getElement('totalExpense').textContent = `${totalExpense}`;
        document.querySelector('.income__amount').textContent = `$${totalIncome}`;
        document.querySelector('.expense__amount').textContent = `$${totalExpense}`;
        // Calculate and update the total balance
        const Balance = totalIncome - totalExpense;
        const totalBalance = Balance.toLocaleString();

        document.querySelector('.balance__amount').textContent = `$${totalBalance}`;
        // document.getElementById('totalBalance').textContent = totalBalance;

        if(Balance > 0)
        {
            document.querySelector('header').className ='green';
        }
        else{
            document.querySelector('header').className ='red';

        }


    }
}

function sep(amount){
    amount=parseInt(amount);

    return amount.toLocaleString();
}

// filter reduce o use kora jay parse int er okhane