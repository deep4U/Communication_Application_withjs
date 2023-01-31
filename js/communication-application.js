// hideModal hides a modal with given id
// it also changes background color of the add-button according to modal visibility
function hideModal(id) {
    let modal = document.getElementById(id);
    modal.style.visibility = "hidden";
    let button = document.getElementById("add-button");
    if (button)
        button.style.backgroundColor = "#66FFFF";
}

// deleteDocs deletes the document with documentID
function deleteDocs(documentId) {
    let documents = localStorage.getItem('uploads') ? JSON.parse(localStorage.getItem('uploads')) : [];
    // go through all the documents in uploads localStorage
    for (const [index, documentItem] of documents.entries()) {
        if (documentId == documentItem.id) {
            documents.splice(index, 1);
            break;
        }
    }
    localStorage.setItem('uploads', JSON.stringify(documents));
    location.reload();
}

// showModal presents the modal as per modalId and changes okButton border and onclick as per the inputs
function showModal(modalId, targetId, documentsOrUsers) {
    let modal = document.getElementById(modalId);
    // delete User logic
    if (modalId == "delete" && !documentsOrUsers) {
        let okButton = document.getElementById('ok-button-users');
        if (okButton) {
            okButton.style.borderColor = "blue";
            okButton.style.borderWidth = "3px";
            // onclick should remove user with targetId
            okButton.onclick = () => deleteUser(`${targetId}`);
        }
    }
    // delete document logic
    if (modalId == "delete" && documentsOrUsers) {
        let okButton = document.getElementById('ok-button-docs');
        if (okButton) {
            okButton.style.borderColor = "blue";
            okButton.style.borderWidth = "3px";
            // onclick should remove document with targetId
            okButton.onclick = () => deleteDocs(targetId);
        }
    }
    // Edit document
    if (modalId == 'edit') {
        let documents = localStorage.getItem('uploads') ? JSON.parse(localStorage.getItem('uploads')) : [];
        let documentFound = {};
        // loop through documents in uploads localStorage
        for (let documentItem of documents) {
            if (targetId == documentItem.id) {
                documentFound = documentItem;
                break;
            }
        }
        if (document.getElementById('labelEdit')) {
            // label should show current value of document by default
            document.getElementById('labelEdit').value = documentFound.label;
            // save button should update document label
            document.getElementById('save').onclick = () => {
                documentFound.label = document.getElementById('labelEdit').value;
                // if no label is given give alert
                if (!document.getElementById('labelEdit').value) {
                    alert('label is mandatory!');
                    return false;
                }
                localStorage.setItem('uploads', JSON.stringify(documents));
                hideModal("edit");
                location.reload();
            }
        }
    }
    if (modal) {
        // show modal
        modal.style.visibility = "visible";
    }
    let button = document.getElementById("add-button");
    if (button != null)
        // when modal is visible then add-button should be white
        button.style.backgroundColor = "white";
}

// Jumpt to welcome page once login is successful 
function goWelcome() {
    window.location.href = "../html/login-success.html";
}

// getNavCol creates navigation button with given className, 
// navId for id of element, navHref for redirection onclick, navTxt 
// for innerhtml and navTr for navigation row to insert button into
function getNavCol(className, navId, navHref, navTxt, navTr) {
    // create column for button and button itself
    let navTd = document.createElement('td');
    let navButton = document.createElement('button');
    navButton.className = className;
    // for logout button remove loggedin storage and redirect
    if (navId == 'logout') {
        navButton.onclick = () => {
            localStorage.removeItem('loggedin');
            location.href = navHref;
        }
    } else { // for other buttons just redirect
        navButton.onclick = () => {
            location.href = navHref;
        }
    }
    // set text content, element id, class
    navButton.innerHTML = navTxt;
    navButton.id = navId;
    navButton.className = className;
    // add elements to row and column
    navTd.appendChild(navButton);
    navTr.appendChild(navTd);
}
function checkLogin() {
    // load loggedin storage data
    loggedin = localStorage.getItem('loggedin') ? JSON.parse(localStorage.getItem('loggedin')) : location.href = './welcome.html';
    // check if user is logged in or not
    // if not redirect to welcome (loggedin storage does not exist or is empty)
    let count = 0;
    if (loggedin) {
        for (let key in loggedin) {
            count++;
            break;
        }
    }
    if (count == 0) {
        location.href('./welcome.html');
    }
}

// add navigation pane to html page dynamically
function addNav(current) {
    // create table with 1 row
    let table = document.createElement('table');
    table.className = "nav-bar";
    let tbody = document.createElement('tbody');
    tbody.className = "nav-bar-body";
    let navTr = document.createElement('tr');
    // get navigation buttons created and appended
    getNavCol("nav-button", "chat", "./chat.html", 'Group Chat', navTr);
    getNavCol("nav-button", "users-list", "./users-list.html", 'Manage Users', navTr);
    getNavCol("nav-button", "documents-list", "./documents-list.html", 'Manage Documents', navTr);
    getNavCol("nav-button", "logout", "./logout.html", 'Logout', navTr);
    // append tbody to table, row to tbody and table to html body
    table.appendChild(tbody);
    tbody.appendChild(navTr);
    document.getElementById('body').appendChild(table);
    // for current page make the nav button white
    if (current) {
        let currentBars = document.getElementById(current);
        currentBars.style.backgroundColor = "white";
    }
}

// get user name printed in chat page
function getUserName() {
    // load loggedin storage and read name of user
    let name = localStorage.getItem('loggedin') ? JSON.parse(localStorage.getItem('loggedin')).name : '';
    document.write(name);
    return name;
}

// get current user's email id for welcome page
function getCurrentUser() {
    // load loggedin storage and read email of user
    let userEmail = localStorage.getItem('loggedin') ? JSON.parse(localStorage.getItem('loggedin')).email : '';
    document.write(userEmail);
    return userEmail;
}

// check password and email id against storage for login
function checkPassword(email, password, storageMap) {
    for (let user of storageMap) {
        if (user.email == email) {
            if (user.password == password) {
                // if credentials match then store in loggedin
                let {password,confirmPassword, ...logged_user} = user;
                localStorage.setItem('loggedin', JSON.stringify(logged_user));
                return true;
            }
            else {
                return "Wrong Email or Password";
            }
        }
    }
    return "Wrong Email or Password";
}

// deleteUser with given deleteId
function deleteUser(deleteId) {
    // load users uploads and chat storage
    let users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
    let uploads = localStorage.getItem('uploads') ? JSON.parse(localStorage.getItem('uploads')) : [];
    let chatObjList = localStorage.getItem('chats') ? JSON.parse(localStorage.getItem('chats')) : [];
    // find indices to delete in docs and chat storage for that user
    let deleteIndexDocs = [];
    for (const [index, upload] of uploads.entries()) {
        if (upload.userId == deleteId) {
            deleteIndexDocs.push(index);
        }
    }
    let deleteIndexChat = []
    for (const [index, chatObj] of chatObjList.entries()) {
        if (chatObj.id == deleteId) {
            deleteIndexChat.push(index);
        }
    }
    // delete elements in docs and chat that belong to given user
    while (deleteIndexDocs.length) {
        uploads.splice(deleteIndexDocs.pop(), 1);
    }
    while (deleteIndexChat.length) {
        chatObjList.splice(deleteIndexChat.pop(), 1);
    }
    localStorage.setItem('chats', JSON.stringify(chatObjList));
    localStorage.setItem('uploads', JSON.stringify(uploads));
    // find user's index in localStorage of users and delete user from there
    for (const [index, user] of users.entries()) {
        if (user.id == deleteId) {
            let deletedUser = users.splice(index, 1);
            localStorage.setItem('users', JSON.stringify(users));
            // hide modal as operation is done
            hideModal('delete');
            // reload page to reflect the change
            location.reload();
            return true;
        }
    }
}

// edit user email and name from input elements
function editUser() {
    // get id of user to be editted from searchparams
    const querry = window.location.search;
    const urlParams = new URLSearchParams(querry);
    let id = urlParams.get('id');
    // load users and loggedin storage
    let users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
    let loggedin = localStorage.getItem('loggedin') ? JSON.parse(localStorage.getItem('loggedin')) : [];
    // get new email id and name from edit text inputs boxes
    let email = document.getElementById('email').value;
    let name = document.getElementById('name').value;
    // validate email and name formats send some dummy password
    if (!validateData(email, name, 'password', 'password')) {
        return false;
    }
    else {
        // go through all users and find the user to be modefied
        for (let user of users) {
            if (user.id == id) {
                if (user.email != email) {
                    // email should not be already in use
                    if (validateEmail(email, users)) {
                        alert("User already exists");
                        return false;
                    }
                    user.email = email;
                }
                // change user's email and name and store in localstorage
                user.name = name;
                localStorage.setItem('users', JSON.stringify(users));
                // if loggedin user was changed then loggedin localstorage needs to be modefied too
                if (user.id == loggedin.id) {
                    let {password,confirmPassword, ...logged_user} = user;
                    localStorage.setItem('loggedin', JSON.stringify(logged_user));
                }
                return true;
            }
        }
    }
}

function loginForm() {
    // load users localStorage
    let users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    // validate data from user send dummy name
    if (!validateData(email, 'name', password, password)) {
        return false;
    }
    // check credentials if they match the localstorage then login the user
    if (ret = checkPassword(email, password, users)) {
        if (typeof (ret) == "string") {
            alert(ret);
            return false;
        }
        else
            return ret;
    }

}

// check if email exists already in users storage
function validateEmail(email, storageMap) {
    for (userObject of storageMap) {
        if (userObject.email == email) {
            return true;
        }
    }
    return false;
}

function getDocuments() {
    // fill document table from uploads storage dynamically
    let documents = localStorage.getItem('uploads') ? JSON.parse(localStorage.getItem('uploads')) : [];
    let docsTable = document.getElementById('docs-table');
    // loop through documents and add into docs-table
    for (let documentItem of documents) {
        // get document id and label from lacalStorage
        let row = document.createElement('tr');
        let cellLabel = document.createElement('td');
        cellLabel.appendChild(document.createTextNode(documentItem.label));
        let cellName = document.createElement('td');
        cellName.appendChild(document.createTextNode(documentItem.fileName));
        let cellOptions = document.createElement('td');
        let editButton = document.createElement('button');
        editButton.className = "transparent-button";
        editButton.innerHTML = 'Edit';
        editButton.value = documentItem.id;
        editButton.id = 'edit' + String(documentItem.id);
        // onclick and id should be as per that particular document id
        editButton.onclick = () => showModal("edit", documentItem.id, true);
        cellOptions.appendChild(editButton);
        cellOptions.appendChild(document.createTextNode(' | '));
        let deleteButton = document.createElement('button');
        deleteButton.className = "transparent-button";
        deleteButton.value = documentItem.id;
        deleteButton.id = 'delete' + String(documentItem.id);
        // onclick and id should be as per that particular document id
        deleteButton.onclick = () => showModal("delete", documentItem.id, true);
        deleteButton.innerHTML = 'Delete';
        cellOptions.appendChild(deleteButton);
        row.appendChild(cellLabel);
        row.appendChild(cellName);
        row.appendChild(cellOptions);
        docsTable.appendChild(row);
    }
    // add-button is used for adding new documents add this in 
    // first col of last empty row of table
    let addRow = document.createElement('tr');
    let addButton = document.createElement('button');
    addButton.className = 'add-button';
    // add onclick shows upload modal
    addButton.onclick = () => showModal('upload', null);
    addButton.innerHTML = "+ Add Upload";
    let addButtonCol = document.createElement('td');
    addRow.appendChild(addButtonCol);
    addButtonCol.appendChild(addButton);
    addRow.appendChild(document.createElement('td'));
    addRow.appendChild(document.createElement('td'));
    docsTable.appendChild(addRow);
    addButton.style.backgroundColor = "#66FFFF";
}

// generate users table dynamically
function generateUsersTable() {
    // load users localstorage
    let users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
    for (let user of users) {
        // load user data and fill into table
        let row = document.createElement('tr');
        let cellName = document.createElement('td');
        cellName.appendChild(document.createTextNode(user.name));
        let cellEmail = document.createElement('td');
        cellEmail.appendChild(document.createTextNode(user.email));
        let cellOptions = document.createElement('td');
        let editText = document.createElement('a');
        // editUrl shall be passed with id
        let editUrl = new URL(window.location.pathname.split('/').slice(0, -1).join('/') + "/edit-users.html", window.location.origin);
        editUrl.searchParams.append('id', user.id);
        editText.href = editUrl;
        editText.innerHTML = 'Edit';
        cellOptions.appendChild(editText);
        cellOptions.appendChild(document.createTextNode(' | '));
        // delete button should not be visible for current user
        let deleteButton = document.createElement('button');
        if (user.id == JSON.parse(localStorage.getItem('loggedin')).id) {
            deleteButton.style.visibility = 'hidden';
        }
        // delete button shall open up delete user modal
        deleteButton.className = "transparent-button";
        deleteButton.value = user.id;
        deleteButton.onclick = () => showModal("delete", user.id, false);
        deleteButton.innerHTML = 'Delete';
        cellOptions.appendChild(deleteButton);
        row.appendChild(cellName);
        row.appendChild(cellEmail);
        row.appendChild(cellOptions);
        document.getElementById('user-table-body').appendChild(row);
    }
}

// validate form data format and validity
function validateData(email, name, password, confirmPassword) {
    if (name == "") {
        alert("Please enter name");
        return false;
    }
    else if (email == "") {
        alert("Please enter email");
        return false;
    }
    else if (!email.includes('@') || !email.includes('.')) {
        alert("Please enter valid email");
        return false;
    } else if (password == "") {
        alert("Please enter password");
        return false;
    }
    else if (confirmPassword == "") {
        alert("Please enter confirm password");
        return false;
    }
    if (password != confirmPassword) {
        alert("password and confirm password are not same!");
        return false;
    }
    else if (password.length < 8) {
        alert("Password too short! Min 8 characters are required!");
        return false;
    }
    return true;
}

// register the user with given data
function registerUser() {
    // load users storage
    let users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
    // get data from form inputs
    let email = document.getElementById('email').value;
    let password = document.getElementById('pass').value;
    let name = document.getElementById('name').value;
    let confirmPassword = document.getElementById('confirmPass').value;
    // validate data
    if (!validateData(email, name, password, confirmPassword)) {
        return false;
    }
    // validate email does not already exist in localstorage of users
    if (validateEmail(email, users)) {
        alert("User already exists");
        return false;
    }
    // add new user to localstorage
    let newUser = {
        id: Number(new Date()),
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword
    };
    users.push(newUser);
    let usersString = JSON.stringify(users);
    localStorage.setItem('users', usersString);
    return true;
}

// get full name and email id of given user for edit modal
function getFullNameEmail(users, id) {
    for (let user of users) {
        if (user.id == id) {
            return [user.name, user.email];
        }
    }
    return false;
}

// users table for edit page
function getEditTable() {
    // get user id from sear params
    const querry = window.location.search;
    const urlParams = new URLSearchParams(querry);
    let id = urlParams.get('id');
    // get full name and email and save button for 
    // that user and add in form table
    const users = JSON.parse(localStorage.getItem('users'));
    let retNameEmail = getFullNameEmail(users, id)
    let fullNameRow = document.createElement('tr');
    let fullNameTxtCol = document.createElement('td');
    fullNameTxtCol.className = 'text-col';
    fullNameTxtCol.style.fontWeight = 'bold';
    let fullNameCol = document.createElement('td');
    let fullNameInput = document.createElement('input');
    fullNameInput.className = 'text-box';
    fullNameInput.type = 'text';
    fullNameInput.name = 'name';
    fullNameInput.id = 'name';
    fullNameInput.value = retNameEmail[0];
    fullNameTxtCol.appendChild(document.createTextNode('Full Name'));
    fullNameCol.appendChild(fullNameInput);
    fullNameRow.appendChild(fullNameTxtCol);
    fullNameRow.appendChild(fullNameCol);
    fullNameRow.appendChild(document.createElement('br'));
    document.getElementById('form-table').appendChild(fullNameRow);
    let emailRow = document.createElement('tr');
    let emailTxtCol = document.createElement('td');
    emailTxtCol.className = 'text-col';
    emailTxtCol.style.fontWeight = 'bold';
    let emailCol = document.createElement('td');
    let emailInput = document.createElement('input');
    emailInput.className = 'text-box';
    emailInput.type = 'text';
    emailInput.name = 'email';
    emailInput.id = 'email';
    emailInput.value = retNameEmail[1];
    emailTxtCol.appendChild(document.createTextNode('Email'));
    emailCol.appendChild(emailInput);
    emailRow.appendChild(emailTxtCol);
    emailRow.appendChild(emailCol);
    emailRow.appendChild(document.createElement('br'));
    let submitRow = document.createElement('tr');
    let submitDiv = document.createElement('div');
    submitDiv.className = 'submit-button-div';
    let submitCol = document.createElement('td');
    let submitInput = document.createElement('input');
    submitInput.type = 'submit';
    submitInput.name = 'save';
    submitInput.className = 'submit-button';
    submitRow.appendChild(document.createElement('td'));
    submitRow.appendChild(submitDiv);
    submitDiv.appendChild(submitCol);
    submitCol.append(submitInput);
    document.getElementById('form-table').appendChild(emailRow);
    document.getElementById('form-table').appendChild(submitRow);
}

function getChatData() {
    // load chat data from local storage and display in chat-div
    let chatObjList = localStorage.getItem('chats') ? JSON.parse(localStorage.getItem('chats')) : [];
    let chatDiv = document.getElementById('chat-div');
    for (let chatObj of chatObjList) {
        chat = chatObj.text;
        chatDiv.appendChild(document.createTextNode(chat));
        chatDiv.appendChild(document.createElement('br'));
    }
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

function dateFormatter(dateObj) {
    // format date for chat storage
    return `[${dateObj.toISOString().slice(0, 10)} ${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}]`;
}

function setGroupChat() {
    // add message to group chat
    let chatObjList = localStorage.getItem('chats') ? JSON.parse(localStorage.getItem('chats')) : [];
    let message = document.getElementById('message').value;
    if (message == '' || !message) {
        alert("message is a mandatory feild!");
        return false;
    }
    let name = localStorage.getItem('loggedin') ? JSON.parse(localStorage.getItem('loggedin')).name : '';
    let dateObj = new Date();
    let date = dateFormatter(dateObj);
    let chatObj = {
        id: JSON.parse(localStorage.getItem('loggedin')).id,
        name: JSON.parse(localStorage.getItem('loggedin')).name,
        email: JSON.parse(localStorage.getItem('loggedin')).email,
        text: `${date} ${name} : ${message}`
    };
    chatObjList.push(chatObj);
    localStorage.setItem('chats', JSON.stringify(chatObjList));
    location.reload();
}

// upload new document
function uploadDocument() {
    // get inputs from input text box and file input
    let label = document.getElementById('label').value;
    let file = document.getElementById('file').files[0].name;
    // validation of data
    if (!label || !file) {
        alert('label and file are mandatory fields!');
        return false;
    }
    // load loggedin and uploads storage
    let userId = localStorage.getItem('loggedin') ? JSON.parse(localStorage.getItem('loggedin')).id : '';
    let documents = localStorage.getItem('uploads') ? JSON.parse(localStorage.getItem('uploads')) : [];
    documents.push({
        id: Number(new Date()),
        userId: userId,
        label: label,
        fileName: file
    });
    localStorage.setItem('uploads', JSON.stringify(documents));
    location.reload();
    return true;
}