 
document.addEventListener('DOMContentLoaded', () => {
  // Load items and history when the page is loaded
  loadItems();
  loadHistory();
});

// Function to add an item
function addItem() {
 
  const itemName = document.getElementById('itemName').value.trim();
  const quantity = document.getElementById('quantity').value.trim();

   
  if (!itemName || isNaN(quantity) || quantity <= 0) {
      alert('Please enter valid data.');
      return;
  }

   
  const newItem = {
      name: itemName,
      quantity: parseInt(quantity),
      date: new Date().toLocaleString()
  };

   
  const items = getItems();

 
  items.push(newItem);

  // Update the items in local storage
  localStorage.setItem('items', JSON.stringify(items));

  // Add the item addition to the history
  addToHistory(`Added ${quantity} ${itemName}(s)`);

 
  loadItems();

 
  clearInputs();
}


function clearAll() {
   
  localStorage.clear();

  
  loadItems();
  loadHistory();
}

// Function to add an action to the history
function addToHistory(action) {
 
  const history = getHistory();

 
  history.push({ action, date: new Date().toLocaleString() });

   
  localStorage.setItem('history', JSON.stringify(history));

  
  loadHistory();
}

 
function exportHistory() {
  
  const history = getHistory();

   
  const csvContent = history.map(entry => `${entry.action}, ${entry.date}`).join('\n');

  
  const blob = new Blob([csvContent], { type: 'text/csv' });

  
  const url = URL.createObjectURL(blob);

 
  const a = document.createElement('a');
  a.href = url;
  a.download = 'history.csv';

   
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Function to load items and update the displayed list
function loadItems() {
  const itemList = document.getElementById('itemList');
  itemList.innerHTML = '';

  
  const items = getItems();

   
  items.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `${item.name}: ${item.quantity}`;
      itemList.appendChild(li);
  });
}

// Function to load history and update the displayed list
function loadHistory() {
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = '';

   
  const history = getHistory();

  
  history.forEach(entry => {
      const li = document.createElement('li');
      li.innerHTML = `${entry.action} - ${entry.date}`;
      historyList.appendChild(li);
  });
}

 
function getItems() {
  return JSON.parse(localStorage.getItem('items')) || [];
}
 
function getHistory() {
  return JSON.parse(localStorage.getItem('history')) || [];
}

// Function to clear input fields
function clearInputs() {
  document.getElementById('itemName').value = '';
  document.getElementById('quantity').value = '';
}
function handleListClick(event) {
  const target = event.target;

  // Check if the click was on a remove button
  if (target.classList.contains('remove-btn')) {
    const itemName = target.dataset.itemName;
    removeItem(itemName);
  }

  // Check if the click was on an item for editing
  if (target.classList.contains('edit-btn')) {
    const itemName = target.dataset.itemName;
    editItem(itemName);
  }
}

// Function to remove an item
function removeItem(itemName) {
  const items = getItems();

  // Find the index of the item to remove
  const index = items.findIndex(item => item.name === itemName);

  if (index !== -1) {
    // Remove the item from the array
    const removedItem = items.splice(index, 1)[0];

    // Update the items in local storage
    localStorage.setItem('items', JSON.stringify(items));

    // Add the item removal to the history
    addToHistory(`Removed ${removedItem.quantity} ${removedItem.name}(s)`);
    
    // Reload the items
    loadItems();
  }
}

// Function to edit an item
function editItem(itemName) {
  const items = getItems();

  // Find the index of the item to edit
  const index = items.findIndex(item => item.name === itemName);

  if (index !== -1) {
    const editedItem = items[index];

    // Prompt the user to enter new quantity
    const newQuantity = prompt(`Enter new quantity for ${itemName}:`, editedItem.quantity);

    // Check if the user provided a valid quantity
    if (!isNaN(newQuantity) && newQuantity > 0) {
      // Update the quantity of the item
      editedItem.quantity = parseInt(newQuantity);

      // Update the items in local storage
      localStorage.setItem('items', JSON.stringify(items));

      // Add the item edit to the history
      addToHistory(`Edited ${itemName} to ${newQuantity} ${itemName}(s)`);

      // Reload the items
      loadItems();
    } else {
      alert('Please enter a valid quantity.');
    }
  }
}

// Function to load items and update the displayed list
function loadItems() {
  const itemList = document.getElementById('itemList');
  itemList.innerHTML = '';

  const items = getItems();

  items.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `${item.name}: ${item.quantity} 
                    <button class="remove-btn" data-item-name="${item.name}">Remove</button>
                    <button class="edit-btn" data-item-name="${item.name}">Edit</button>`;
    itemList.appendChild(li);
  });
}