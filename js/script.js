// alert('ok');

const groceryListData = {};
// const domElements = {
// 	groceryList: document.querySelector('#groceryList'),
// 	submitFormButton: document.querySelector('form button'),
// 	form: document.querySelector('form'),
// 	formNameInput: document.querySelector('#nameInput'),
// 	formQuantityInput: document.querySelector('#quantityInput'),
// 	formTitle: document.querySelector('#formTitle'),
// };
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
	list: document.querySelector('.list'),
};

// done
// function resetForm() {
// 	domElements.form.setAttribute('onsubmit', 'submitForm(event)');
// 	domElements.formNameInput.value = '';
// 	domElements.formQuantityInput.value = '';
// 	domElements.submitFormButton.innerText = 'Add';
// 	domElements.formTitle.innerText = 'Add Item';
// }
const resetForm = () => {
	myDOM.form.formElement.setAttribute('onsubmit', 'submitForm(event)');
	myDOM.form.itemName.value = '';
	myDOM.form.itemQuantity.value = '';
	myDOM.form.itemUnit.value = 'not-selected';
	myDOM.addEditSectionTitle.innerText = 'Add Item';
	myDOM.addGroceryListBtn.innerText = 'Add to Grocery List';
	// myDOM.addWishListBtn.innerText = 'Add to Wishlist';
};

// function checkErrors(event) {
// 	let error = false;
// 	if (event.target[0].value.length === 0) {
// 		document.querySelector('#nameError').innerText = 'Enter item name';
// 		error = true;
// 	} else {
// 		document.querySelector('#nameError').innerText = '';
// 	}

// 	if (event.target[1].value <= 0) {
// 		document.querySelector('#quantityError').innerText =
// 			'Enter quantity more than 0';
// 		error = true;
// 	} else {
// 		document.querySelector('#quantityError').innerText = '';
// 	}
// 	return error;
// }
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

// ! TODO
function deleteItem(name) {
	groceryListData[name].element.remove();
	delete groceryListData[name];
	resetForm();
}

// done
function getListItemHtml(name, quantity, unit) {
	return `<span class="list-item">
	<span class="list-item-name">${name}</span><span class="quantity-unit">${quantity} ${unit}</span>
</span>
<span class="list-action">
	<!-- ! add icons -->
	<span>Done</span>
	<span onclick="renderEditItemForm('${name}')">Edit</span>
	<span onclick="deleteItem('${name}')">Del</span>
</span>`;
}

// ! TODO
async function editItem(event, prevName) {
	event.preventDefault();
	if (checkErrors(event)) {
		return;
	}
	console.warn('IN EDITITEM FUNCTION', event.target);
	const newName = myDOM.form.itemName.value;
	const newQuantity = myDOM.form.itemQuantity.value;
	const newUnit = myDOM.form.itemUnit.value;

	if (newName !== prevName) {
		groceryListData[newName] = { ...groceryListData[prevName] };
		delete groceryListData[prevName];
	}
	groceryListData[newName].quantity = Number(newQuantity);
	groceryListData[newName].unit = newUnit;
	groceryListData[newName].element.innerHTML = getListItemHtml(
		newName,
		newQuantity,
		newUnit
	);
	resetForm();
}

// done
// function renderEditItemForm(name) {
// domElements.formTitle.innerText = 'Edit Item';
// domElements.submitFormButton.innerText = 'Edit';
// domElements.formNameInput.value = name;
// domElements.formQuantityInput.value = groceryListData[name].quantity;
// 	domElements.form.setAttribute('onsubmit', `editItem(event, '${name}')`);
// }
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
function createListItem(name, quantity, unit) {
	let listElement = document.createElement('li');
	listElement.innerHTML = getListItemHtml(name, quantity, unit);
	groceryListData[name] = {
		quantity,
		unit,
		element: listElement,
	};
	return listElement;
}

// merged in below function

// function addItemToList(name, quantity) {
// 	quantity = Number(quantity);
// 	if (groceryListData.hasOwnProperty(name)) {
// 		groceryListData[name].quantity += quantity;
// 		groceryListData[name].element.querySelector('.listItemQuantity').innerText =
// 			groceryListData[name].quantity;
// 	} else {
// 		domElements.groceryList.append(createListItem(name, quantity));
// 	}
// }

async function submitForm(event) {
	console.log('enter submit form');
	event.preventDefault();
	if (checkErrors()) {
		return;
	}

	// addItemToList(event.target[0].value, event.target[1].value);
	console.warn('IN SUBMITFORM FUNCTION', event.target);
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
	}
	resetForm();
}

window.onload = () => {
	const loadedData = JSON.parse(localStorage.getItem('listItems'));
	for (let name in loadedData) {
		myDOM.list.append(
			createListItem(name, loadedData[name].quantity, loadedData[name].unit)
		);
	}
};

window.onbeforeunload = () => {
	const storeData = {};
	const orderedItemData = document.querySelectorAll('.list-item-name');
	orderedItemData.forEach((item) => {
		storeData[item.innerText] = {
			quantity: Number(groceryListData[item.innerText].quantity),
			unit: groceryListData[item.innerText].unit,
		};
	});
	// for (let name in groceryListData) {
	//     storeData[name] = Number(groceryListData[name].quantity);
	// }
	localStorage.setItem('listItems', JSON.stringify(storeData));
};
