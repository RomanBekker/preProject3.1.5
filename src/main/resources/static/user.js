//ГЛАВНАЯ:
//Делаем GET-запрос (на авторизированного юзера), вызываем функцию заполнения таблицы и заполнения титулов в шапке
async function getUser() {
    const response = await fetch("http://localhost:8080/api/userAuth", {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    });
    let oneUser = await response.json(); // читаем ответ в формате JSON

    //Делаем заполнение таблицы: (querySelector() - возвращает первый элемент, соответствующий данному селектору "tbody"
    //(удобно, т.к. таблица у нас одна, если элементов много, то обращаемся к ним по id)
    let rows = document.querySelector("tbody");
    rows.append(rowUser(oneUser));

    //Делаем заполнение титула верхнего:
    let tit = document.querySelector("h");
    tit.append(titul(oneUser));

    //Делаем заполнение титула верхнего (ролями)
    //getElementById() - если у элемента есть атрибут id, то мы можем получить его вызовом этого метода:
    let titRole = document.getElementById("authRole");
    titRole.append(titulRole(oneUser));

}

//Запускаем функцию:
getUser()


//ОФОРМЛЕНИЕ:
//Функция заполнения таблицы
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
    h.setAttribute("authEmail", user.id);
    h.append(user.username);
    return h;
}

//Функция, которая выводит Roles юзера в верхний черный титул:
function titulRole(user) {
    const h = document.createElement("h");
    h.setAttribute("authRole", user.id);
    h.append((user.roles[0].name).replace("ROLE_", ""));
    if (user.roles.length > 1) h.append(", " + (user.roles[1].name).replace("ROLE_", ""));
    return h;
}


//ВЫХОД:
//Кнопка Logout
document.forms["logout"].addEventListener("submit", e => {
    logout()
});

//Функция, которая отправит POST запрос на сервер и сделает logout
async function logout() {
    const response = await fetch("http://localhost:8080/logout", {
        method: "POST",
    });
}