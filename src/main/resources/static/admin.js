//CRUD:
//Делаем GET-запрос (на всех юзеров, на авторизированного юзера)
async function getResponse() {
    //Получаем ВСЕХ юзеров:
    let response = await fetch('http://localhost:8080/he/all', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    let allUsers = await response.json(); // читаем ответ в формате JSON

    //Делаем заполнение таблицы:
    let rows = document.querySelector("tbody");
    allUsers.forEach(user => {
        //Добавляем полученных User-ов в таблицу
        rows.append(row(user));
    });

    //___________________________________________________________________________
    //Получаем АВТОРИЗИРОВАННОГО юзера:
    const respAuth = await fetch("http://localhost:8080/he/userAuth", {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    });
    let oneUser = await respAuth.json(); // читаем ответ в формате JSON

    //Делаем заполнение титула верхнего:
    let tit = document.querySelector("h");
    tit.append(titul(oneUser));

    //Делаем заполнение титула верхнего ролями:
    let titRole = document.getElementById("authRoleAdmin");
    titRole.append(titulRole(oneUser));

    //Делаем заполнение "userSite" вошедшего, если у него 2 роли:
    if (oneUser.roles.length > 1) {
        let x = document.getElementById("tbodyUserTable")
        x.append(rowUser(oneUser));
    } else {
        hide_msgdiv() //Иначе скрываем кнопку
    }
}

//Запускаем функцию:
getResponse()

//Делаем GET-запрос (на возврат одного юзера по id)
async function getUser(id) {
    const response = await fetch("http://localhost:8080/he/" + id, {
        method: "GET",
        headers: {"Accept": "application/json"}
    });
    const user = await response.json();

    //Вставляем полученные данные в формы модального окна:
    const form = document.forms["formEditUser"]

    form.elements["id"].value = user.id;
    form.elements["name"].value = user.name;
    form.elements["lastname"].value = user.lastname;
    form.elements["age"].value = user.age;
    form.elements["email"].value = user.username;

    //Кнопка отправки формы (EDIT)
    document.forms["formEditUser"].addEventListener("submit", e => {
        e.preventDefault();

        let newOldId = form.elements["id"].value
        let newName = form.elements["name"].value
        let newLastname = form.elements["lastname"].value
        let newAge = form.elements["age"].value
        let newUsername = form.elements["email"].value
        let newPassword = form.elements["password"].value

        let selected = Array
            .from(rolesE.options)
            .filter(option => option.selected)
            .map(option => option.value)

        let newRoles = ""
        if (selected[0] == 1 && selected[1] == 2) {
            newRoles = [{"id": 1, "name": "ROLE_ADMIN"}, {"id": 2, "name": "ROLE_USER"}];
        } else if (selected[0] == 2) {
            newRoles = [{"id": 2, "name": "ROLE_USER"}];
        } else {
            newRoles = [{"id": 1, "name": "ROLE_ADMIN"}];
        }

        editUser(newOldId, newName, newLastname, newAge, newUsername, newPassword, newRoles)
        $('#modalEdit').modal('hide')
        $('.nav-tabs a[href="#home"]').tab('show')
    });
}

//Делаем POST-запрос на добавление юзера:
async function createUser(userName, userLastName, userAge, userUserName, userPassword, userRoles) {

    const response = await fetch("http://localhost:8080/he", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: userName,
            lastname: userLastName,
            age: parseInt(userAge, 10),
            username: userUserName,
            password: userPassword,
            roles: userRoles
        })
    });
    let userNew = await response.json();

    //Очищаем формы:
    const form = document.forms["newUserForm"];
    form.reset();

    //Добавляем в таблицу только что созданного юзера:
    document.querySelector("tbody").append(row(userNew));
}

//Кнопка отправки формы (СОЗДАТЬ)
document.forms["newUserForm"].addEventListener("submit", e => {
    e.preventDefault();
    const form = document.forms["newUserForm"];
    const name = form.elements["nameNew"].value;
    const lastname = form.elements["Last_nameNew"].value;
    const age = form.elements["ageNew"].value;
    const username = form.elements["emailNew"].value;
    const password = form.elements["passwordNew"].value;

    //С помощью нижеследующего можно выбрать несколько строк в selecte наконец-то:
    let selected = Array
        .from(rolesNew.options)
        .filter(option => option.selected)
        .map(option => option.value)

    //Представляем запись ролей в нужном для JSON формате:
    let roles = ""
    if (selected[0] == 1 && selected[1] == 2) {
        roles = [{"id": 1, "name": "ROLE_ADMIN"}, {"id": 2, "name": "ROLE_USER"}];
    } else if (selected[0] == 2) {
        roles = [{"id": 2, "name": "ROLE_USER"}];
    } else {
        roles = [{"id": 1, "name": "ROLE_ADMIN"}];
    }

    //Вызываем функцию создания юзера:
    createUser(name, lastname, age, username, password, roles);

    //Возвращаемся на стартовую страницу:
    $('.nav-tabs a[href="#home"]').tab('show')
});

//Делаем PATCH-запрос на изменение юзера:
async function editUser(userId, userName, userLastName, userAge, userUserName, userPassword, userRoles) {
    let s = JSON.stringify({
        id: userId,
        name: userName,
        lastname: userLastName,
        age: parseInt(userAge, 10),
        username: userUserName,
        password: userPassword,
        roles: userRoles
    });
    const response = await fetch("http://localhost:8080/he/" + userId, {
        method: "PATCH",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: s
    });
    let updatedUser = await response.json();
    console.log(updatedUser)

    //Очищаем формы:
    const form = document.forms["formEditUser"];
    form.reset();

    //Изменяем строку в нашей таблице (вывод строки):
    document.querySelector("tr[data-rowid='" + updatedUser.id + "']").replaceWith(row(updatedUser));
}

//Возвращаем юзера, чтобы удалить его:
async function deleteUser(id) {
    const responseDel = await fetch("http://localhost:8080/he/" + id, {
        method: "GET",
        headers: {"Accept": "application/json"}
    });
    const user = await responseDel.json();

    //Вставляем в формы модального окна:
    const form = document.forms["formDeleteUser"]

    form.elements["idDel"].value = user.id;
    form.elements["nameDel"].value = user.name;
    form.elements["Last_nameDel"].value = user.lastname;
    form.elements["ageDel"].value = user.age;
    form.elements["emailDel"].value = user.username;

    //Кнопка отправки формы (DELETE)
    document.forms["formDeleteUser"].addEventListener("submit", e => {
        e.preventDefault();
        deleteUser2(id)

        $('#modalDelete').modal('hide')
        $('.nav-tabs a[href="#home"]').tab('show')
    })
}

//Делаем DELETE-запрос на удаление юзера:
async function deleteUser2(id) {
    const response = await fetch("http://localhost:8080/he/" + id, {
        method: "DELETE",
        headers: {"Accept": "application/json"}
    });
    const user = await response.json();

    //Удаляем из нашей таблицы строку юзера:
    document.querySelector("tr[data-rowid='" + user + "']").remove();
}


//ОФОРМЛЕНИЕ:
//Функция скрытия кнопки страницы userSite, если у вошедшего только одна роль (Admin)
function hide_msgdiv() {
    let currentmenu = document.getElementById("skrtTab");
    currentmenu.style.visibility = 'hidden';
}

//Функция заполнения таблицы (с кнопками "Удалить", "Изменить")
function row(user) {

    const tr = document.createElement("tr");
    tr.setAttribute("data-rowid", user.id);

    const idTd = document.createElement("td");
    idTd.append(user.id);
    tr.append(idTd);

    const nameTd = document.createElement("td");
    nameTd.append(user.name);
    tr.append(nameTd);

    const lastnameTd = document.createElement("td");
    lastnameTd.append(user.lastname);
    tr.append(lastnameTd);

    const ageTd = document.createElement("td");
    ageTd.append(user.age);
    tr.append(ageTd);

    const usernameTd = document.createElement("td");
    usernameTd.append(user.username);
    tr.append(usernameTd);

    const roleTd = document.createElement("td");
    roleTd.append((user.roles[0].name).replace("ROLE_", ""));
    if (user.roles.length > 1) roleTd.append(", " + (user.roles[1].name).replace("ROLE_", ""));
    tr.append(roleTd);

    //Кнопка в строчке на изменение:
    const linksTd = document.createElement("td");
    const editLink = document.createElement("button");
    editLink.setAttribute("class", "btn btn-primary");
    editLink.setAttribute("data-id", user.id);
    editLink.setAttribute("style", "cursor:pointer;");
    editLink.append("Edit");
    editLink.addEventListener("click", e => {
        e.preventDefault();
        //Открываем модальное окно изменения юзера:
        $('#modalEdit').modal('show')
        //Вызываем функцию, которая вернет нам выбранного юзера для изменения:
        getUser(user.id);
    });
    linksTd.append(editLink);
    tr.appendChild(linksTd);

    //Кнопка в строчке на удаление:
    const linksTdforDel = document.createElement("td");
    const removeLink = document.createElement("button");
    removeLink.setAttribute("class", "btn btn-danger");
    removeLink.setAttribute("data-id", user.id);
    removeLink.setAttribute("style", "cursor:pointer;");
    removeLink.append("Delete");
    removeLink.addEventListener("click", e => {
        e.preventDefault();
        $('#modalDelete').modal('show')
        deleteUser(user.id);
    });
    linksTdforDel.append(removeLink);
    tr.appendChild(linksTdforDel);

    return tr;
}

//Функция заполнения таблицы во вкладке "User" (без кнопок "Удалить", "Изменить")
function rowUser(user) {

    const tr = document.createElement("tr");
    tr.setAttribute("data-rowid", user.id);

    const idTd = document.createElement("td");
    idTd.append(user.id);
    tr.append(idTd);

    const nameTd = document.createElement("td");
    nameTd.append(user.name);
    tr.append(nameTd);

    const lastnameTd = document.createElement("td");
    lastnameTd.append(user.lastname);
    tr.append(lastnameTd);

    const ageTd = document.createElement("td");
    ageTd.append(user.age);
    tr.append(ageTd);

    const usernameTd = document.createElement("td");
    usernameTd.append(user.username);
    tr.append(usernameTd);

    const roleTd = document.createElement("td");
    roleTd.append((user.roles[0].name).replace("ROLE_", ""));
    if (user.roles.length > 1) roleTd.append(", " + (user.roles[1].name).replace("ROLE_", ""));
    tr.append(roleTd);

    return tr;
}

//Функция, которая выводит Email юзера в верхний черный титул:
function titul(user) {
    const h = document.createElement("h");
    h.setAttribute("authEmailAdmin", user.id);
    h.append(user.username);
    return h;
}

//Функция, которая выводит Roles юзера в верхний черный титул:
function titulRole(user) {
    const h = document.createElement("h");
    h.setAttribute("authRoleAdmin", user.id);
    h.append((user.roles[0].name).replace("ROLE_", ""));
    if (user.roles.length > 1) h.append(", " + (user.roles[1].name).replace("ROLE_", ""));
    return h;
}


//ВЫХОД:
//Кнопка выхода:
document.forms["logout"].addEventListener("submit", e => {
    logout()
});

//Функция, которая отправит POST запрос на сервер и сделает logout
async function logout() {
    const response = await fetch("http://localhost:8080/logout", {
        method: "POST",
    });
}