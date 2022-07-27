'use strict';

// without server test entities
let testUser = {
    id: '1',
    username: 'Admin-test',
    lastname: 'Adminov-test',
    age: '32',
    email: 'admin-test@email',
    roles: [{id: '1', name: 'ADMIN-test'}, {id: '2', name: 'USER-test'}],
};
let testUsers = [{
    id: '1',
    username: 'Admin-test',
    lastname: 'Adminov-test',
    age: '32',
    email: 'admin-test@email',
    roles: [{id: '1', name: 'ADMIN-test'}, {id: '2', name: 'USER-test'},],
}, {
    id: '2',
    username: 'User-test',
    lastname: 'Userov-test',
    age: '22',
    email: 'user-test@email',
    roles: [{id: '2', name: 'USER-test'},],
}, {
    id: '3',
    username: 'Ghost-test',
    lastname: 'Ghostov-test',
    age: '12',
    email: 'ghost-test@email',
    roles: [{id: '3', name: 'GHOST-test'},],
},];
let testRoles = [{id: '1', name: 'ADMIN-test'}, {id: '2', name: 'USER-test'},{id: '3', name: 'GHOST-test'},];


const URL = 'http://localhost:8080';
let allRoles;
loadCurrentUser();

function loadCurrentUser() {
    fetch(URL + '/current-user')
        .then(resp => resp.json())
        .then(user => {
            buildUserPage(user);
        })
        .catch(error => {
            console.warn('Error when fetch current user: ' + error);
            buildUserPage(testUser);
        });
}

function buildUserPage(user) {
    let currentUserTable = document.getElementById('current-user-tbody');
    let currentUserRoles = userToTable(currentUserTable, user).children.roles.textContent;
    document.getElementById('header-roles').textContent = ' with roles: ' + currentUserRoles;
    document.getElementById('header-email').textContent = user.email;
    showRelatedPage(currentUserRoles.includes('ADMIN'));
}

function showRelatedPage(isAdmin) {
    let adminBtn = document.getElementById('admin-btn');
    if (isAdmin) {
        adminBtn.hidden = false;
        adminBtn.classList.add('active');
        document.getElementById('admin-panel').className += ' show active';
        loadAllRoles();
        loadAllUsers();
    } else {
        document.getElementById('admin-btn').style.display = 'none';
        document.getElementById('user-btn').classList.add('active');
        document.getElementById('user-page').className += ' show active';
    }
}

function loadAllRoles() {
    if (allRoles === undefined) {
        fetch(URL + '/admin/api/roles')
            .then(resp => resp.json())
            .then(roles => {
                allRoles = roles
                buildNewUserForm();
            })
            .catch(error => {
                console.warn('Error when fetch roles: ' + error);
                allRoles = testRoles;
                buildNewUserForm();
            });
    }
}

function loadAllUsers() {
    fetch(URL + '/admin/api')
        .then(resp => resp.json())
        .then(users => {
            buildAdminPanel(users);
        })
        .catch(error => {
            console.warn('Error when fetch all users: ' + error);
            buildAdminPanel(testUsers);
        });
}

function buildAdminPanel(users) {
    let tbody = document.getElementById('users-tbody');
    tbody.innerHTML = '';
    for (const user of users) {
        let tr = userToTable(tbody, user);
        addButtonPairs(tr, user);
        tbody.appendChild(tr);
    }
}

function buildNewUserForm() {
    let newUserForm = userToForm('add-form', {roles: []});
    newUserForm.addEventListener('submit', addFormListener);
    function addFormListener(event) {
        event.preventDefault();
        createRequest(newUserForm);
        document.getElementById('new-user-btn').classList.remove('active');
        document.getElementById('new-user').classList.remove('show');
        document.getElementById('new-user').classList.remove('active');
        document.getElementById('user-table-btn').classList.add('active');
        document.getElementById('user-table').classList.add('show');
        document.getElementById('user-table').classList.add('active');
        newUserForm.reset();
    }
}

function userToTable(tbody, user) {
    let tr = document.createElement('tr');
    tr.id = user.id;
    for (const field in user) {
        let td = document.createElement('td');
        if (Array.isArray(user[field])) {
            td.setAttribute('name', field);
            td.textContent = user[field].map(prop => ' ' + prop.name);
        } else if (typeof user[field] !== 'object') {
            td.textContent = user[field];
        }
        tr.appendChild(td);
    }
    tbody.appendChild(tr);
    return tr;
}

function userToForm(formId, user, isDelete) {
    let form = document.getElementById(formId);
    for (const field in user) {
        if (Array.isArray(user[field])) {
            let fields = isDelete ? user[field] : allRoles;
            form[field].innerHTML = '';
            form[field].disabled = isDelete;
            for (const prop of fields) {
                let option = document.createElement('option');
                option.value = JSON.stringify(prop, ['id', 'name']);
                option.textContent = prop.name;
                // option.selected = isDelete;
                form[field].appendChild(option);
            }
        } else {
            form.elements[field].value = user[field];
            form.elements[field].readOnly = isDelete;
        }
    }
    return form;
}

function addButtonPairs(tr, user) {
    let tdEdit = document.createElement('td');
    let tdDelete = document.createElement('td');
    tdEdit.appendChild(createActionButton(user, 'Edit', 'btn btn-primary'));
    tdDelete.appendChild(createActionButton(user, 'Delete', 'btn btn-danger'));
    tr.appendChild(tdEdit);
    tr.appendChild(tdDelete);
}

function createActionButton(user, name, classNames) {
    let actionBtn = document.createElement('button');
    let modalBtn = document.getElementById('modal-btn');
    actionBtn.textContent = name;
    actionBtn.className = classNames;
    actionBtn.addEventListener('mousedown', () => {
        getModal(name + ' user', user, name === 'Delete');
        modalBtn.textContent = name;
        modalBtn.className = classNames;
    });
    return actionBtn;
}

function getModal(title, user, isDelete) {
    let modal = new bootstrap.Modal(document.getElementById('modal'));
    let modalForm = userToForm('modal-form', user, isDelete);
    document.getElementById('modal-title').textContent = title;
    document.getElementById('password-label').style.display = isDelete ? 'none' : '';
    modalForm.elements.password.required = !isDelete;
    modalForm.elements.roles.required = !isDelete;
    modalForm.elements.id.readOnly = true;
    modal.show();
    modalForm.addEventListener('submit', modalListener);
    modalForm.addEventListener('reset', () => modal.hide());

    function modalListener(event) {
        event.preventDefault();
        createRequest(modalForm, isDelete);
        modal.hide();
        modalForm.reset();
        modalForm.removeEventListener('submit', modalListener);
    }
}

function createRequest(form, isDelete) {
    let user = {id: null ,username: null,lastname: null,age: null,email: null, password: '.',roles: [],};
    for (const field in user) {
        if (Array.isArray(user[field])) {
            user[field] = Array.from(form.elements[field].selectedOptions).map(option => JSON.parse(option.value));
        } else {
            user[field] = form.elements[field].value;
        }
    }
    startRequest(user, isDelete)
}

function startRequest(user, isDelete) {
    let fetchData = {
        method: (isDelete ? 'DELETE' : 'POST'),
        body: JSON.stringify(user),
        headers: {'Content-Type': 'application/json;charset=utf-8'}
    }
    console.info(fetchData.method);
    console.info(fetchData.body);

    fetch(URL + '/admin/api', fetchData)
        .then(resp => resp.text())
        .then(result => {
            if (result === 'success') {
                loadAllUsers();
            }
        })
        .catch(error => {
            console.warn('Error when fetch request: ' + error);
        });
}

