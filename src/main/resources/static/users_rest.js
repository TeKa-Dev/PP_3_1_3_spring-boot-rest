'use strict';

// offline test entities
let testUser = {
    id: '1',
    username: 'Admin-test',
    lastname: 'Adminov-test',
    age: '32',
    email: 'admin-test@email',
    roles: [{id: '1', name: 'ADMIN-test'}, {id: '1', name: 'USER-test'}],
};
let testUsers = [{
    id: '1',
    username: 'Admin-test',
    lastname: 'Adminov-test',
    age: '32',
    email: 'admin-test@email',
    roles: [{id: '1', name: 'ADMIN-test'}, {id: '1', name: 'USER-test'},],
}, {
    id: '2',
    username: 'User-test',
    lastname: 'Userov-test',
    age: '22',
    email: 'user-test@email',
    roles: [{id: '1', name: 'USER-test'},],
}, {
    id: '3',
    username: 'Ghost-test',
    lastname: 'Ghostov-test',
    age: '12',
    email: 'ghost-test@email',
    roles: [],
},];
let testRoles = [{id: '1', name: 'ADMIN-test'}, {id: '1', name: 'USER-test'}];


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
    document.getElementById('header-roles').textContent = currentUserRoles;
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
            })
            .catch(error => {
                console.warn('Error when fetch roles: ' + error);
                allRoles = testRoles;
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
    buildNewUserForm();
}

function buildNewUserForm() {
    let addForm = userToForm('add-form');
    addForm.addEventListener('submit', event => {
        event.preventDefault();
        createRequest(addForm);
    });
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
    user = user ?? {roles: allRoles};
    for (const field in user) {
        if (Array.isArray(user[field])) {
            let fields = isDelete ? user[field] : allRoles;
            form[field].innerHTML = '';
            form[field].disabled = isDelete;
            for (const prop of fields) {
                let option = document.createElement('option');
                option.value = JSON.stringify(prop, ['id', 'name']);
                option.textContent = prop.name;
                option.selected = isDelete;
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
    let form = userToForm('modal-form', user, isDelete);
    document.getElementById('modal-title').textContent = title;
    document.getElementById('password-label').style.display = isDelete ? 'none' : '';
    form.elements.password.value = '';
    form.elements.id.readOnly = true;
    modal.show();
    form.addEventListener('submit', modalFormHandler);

    function modalFormHandler(event) {
        event.preventDefault();
        createRequest(form, isDelete);
        modal.hide();
        form.removeEventListener('submit', modalFormHandler);
    }
}

function createRequest(form, isDelete) {
    let user = {};
    let fields = form.elements;
    for (const field in fields) {
        if (isNaN(field) && fields[field].value) {
            if (fields[field].tagName === 'INPUT') {
                user[field] = fields[field].value;
            } else if (fields[field].tagName === 'SELECT') {
                user[field] = Array.from(fields[field].selectedOptions).map(option => JSON.parse(option.value));
            }
        }
    }
    startRequest(isDelete, user)
}

function startRequest(isDelete, user) {
    let fetchData = {
        method: (isDelete ? 'DELETE' : 'POST'),
        body: JSON.stringify(user),
        headers: {'Content-Type': 'application/json;charset=utf-8'}
    }
    console.info(fetchData.body);
    console.info(fetchData.method);

    fetch(URL + '/admin/api', fetchData)
        .then(resp => resp.text())
        .then(data => {
            if (data === 'success') {
                loadAllUsers();
            }
        })
        .catch(error => {
            console.warn('Error when fetch request: ' + error);
        });
}

