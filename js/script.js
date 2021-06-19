const groceryListData = {};
const myDOM = {
	// left section
	addEditSectionTitle: document.querySelector('#add-edit-item > h2'),
	addGroceryListBtn: document.querySelector('.grocery-btn'),
	// addWishListBtn: document.querySelector('.wishlist-btn'),
	form: {
		formElement: document.querySelector('form'),
		itemName: document.querySelector('#item-name'),
		itemQuantity: document.querySelector('#item-quantity'),
		itemUnit: document.querySelector('#item-unit'),
	},
	// right section
	listHeadGrocery: document.querySelector('.list-heading > h2:nth-child(1)'),
	// listHeadWishlist: document.querySelector('.list-heading > h2:nth-child(2)'),
	itemCounter: document.querySelector('#item-counter'),
	list: document.querySelector('.list'),
};

const resetForm = () => {
	myDOM.form.formElement.setAttribute('onsubmit', 'submitForm(event)');
	myDOM.form.itemName.value = '';
	myDOM.form.itemQuantity.value = '';
	myDOM.form.itemUnit.value = 'not-selected';
	myDOM.addEditSectionTitle.innerText = 'Add Item';
	myDOM.addGroceryListBtn.innerText = 'Add to Grocery List';
	// myDOM.addWishListBtn.innerText = 'Add to Wishlist';
};

const checkErrors = () => {
	const itemName = myDOM.form.itemName.value;
	const itemQuantity = myDOM.form.itemQuantity.value;
	const itemUnit = myDOM.form.itemUnit.value;

	if (itemName === '') {
		alert('Item name can not be empty!');
		return true;
	} else if (itemQuantity <= 0) {
		alert('Item quantity must be greater than 1');
		return true;
	} else if (itemUnit === 'not-selected') {
		alert('Please select unit for your item');
		return true;
	}

	return false;
};

function deleteItem(name) {
	groceryListData[name].element.remove();
	delete groceryListData[name];
	myDOM.itemCounter.innerText = Number(myDOM.itemCounter.innerText) - 1;
	resetForm();
}

// done
function getListItemHtml(name, quantity, unit) {
	return `<span class="list-item">
	<span class="list-item-name">${name}</span><span class="quantity-unit">${quantity} ${unit}</span>
</span>
	<!-- ! add icons -->
	<span class="list-action">
	<span class="done-btn" onClick="completedItem('${name}')">Done</span>
	<span class="edit-btn" onclick="renderEditItemForm('${name}')">Edit</span>
	<span class="del-btn" onclick="deleteItem('${name}')">Del</span>
	</span>
`;
}

async function editItem(event, prevName) {
	event.preventDefault();
	if (checkErrors()) {
		return;
	}

	const newName = myDOM.form.itemName.value;
	const newQuantity = myDOM.form.itemQuantity.value;
	const newUnit = myDOM.form.itemUnit.value;

	if (newName !== prevName) {
		if (groceryListData[newName]) {
			submitForm();
			deleteItem(prevName);
			return;
		}
		groceryListData[newName] = { ...groceryListData[prevName] };
		delete groceryListData[prevName];
		// myDOM.itemCounter.innerText = Number(myDOM.itemCounter.innerText) - 1;
	}
	groceryListData[newName].quantity = Number(newQuantity);
	groceryListData[newName].unit = newUnit;
	groceryListData[newName].element.innerHTML = getListItemHtml(
		newName,
		newQuantity,
		newUnit
	);
	// myDOM.itemCounter.innerText = Number(myDOM.itemCounter.innerText) + 1;
	resetForm();
}

const completedItem = (name) => {
	console.log(groceryListData[name].element);
	groceryListData[name].element.classList.toggle('done-overlay');
	groceryListData[name].isDone = !groceryListData[name].isDone;
	if (groceryListData[name].isDone)
		myDOM.itemCounter.innerText = Number(myDOM.itemCounter.innerText) - 1;
	else myDOM.itemCounter.innerText = Number(myDOM.itemCounter.innerText) + 1;
};

const renderEditItemForm = (name) => {
	myDOM.addEditSectionTitle.innerText = 'Edit Item';
	myDOM.addGroceryListBtn.innerText = 'Save to Grocery List';

	// populating with item data
	myDOM.form.itemName.value = name;
	myDOM.form.itemQuantity.value = groceryListData[name].quantity;
	myDOM.form.itemUnit.value = groceryListData[name].unit;
	myDOM.form.formElement.setAttribute('onsubmit', `editItem(event, '${name}')`);
};

// done (without inserting to map)
function createListItem(name, quantity, unit, isDone) {
	let listElement = document.createElement('li');
	if (isDone) listElement.classList.add('done-overlay');
	listElement.innerHTML = getListItemHtml(name, quantity, unit);
	groceryListData[name] = {
		quantity,
		unit,
		element: listElement,
		isDone,
	};
	return listElement;
}

async function submitForm(event) {
	if (event) event.preventDefault();
	if (checkErrors()) {
		return;
	}

	const name = myDOM.form.itemName.value;
	let quantity = myDOM.form.itemQuantity.value;
	const unit = myDOM.form.itemUnit.value;
	quantity = Number(quantity);
	if (groceryListData.hasOwnProperty(name)) {
		groceryListData[name].quantity += quantity;
		groceryListData[name].unit = unit;
		groceryListData[name].element.querySelector('.quantity-unit').innerText =
			groceryListData[name].quantity + ' ' + unit;
	} else {
		// domElements.groceryList.append(createListItem(name, quantity));
		myDOM.list.append(createListItem(name, quantity, unit));
		myDOM.itemCounter.innerText = Number(myDOM.itemCounter.innerText) + 1;
	}
	resetForm();
}

window.onload = () => {
	const loadedData = JSON.parse(localStorage.getItem('listItems'));
	let counter = 0;
	for (let name in loadedData) {
		myDOM.list.append(
			createListItem(
				name,
				loadedData[name].quantity,
				loadedData[name].unit,
				loadedData[name].isDone
			)
		);
		counter++;
	}
	myDOM.itemCounter.innerText = counter;
};

window.onbeforeunload = () => {
	const storeData = {};
	const orderedItemData = document.querySelectorAll('.list-item-name');
	orderedItemData.forEach((item) => {
		storeData[item.innerText] = {
			quantity: Number(groceryListData[item.innerText].quantity),
			unit: groceryListData[item.innerText].unit,
			isDone: groceryListData[item.innerText].isDone,
		};
	});

	localStorage.setItem('listItems', JSON.stringify(storeData));
};
