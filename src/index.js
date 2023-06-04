import "./styles/main.css";
import { format, compareAsc } from "date-fns";
import { sortByDates } from "./importFunc";
import { editContainer } from "./dom";
//dom elements
const projectContainerMid = document.getElementById("projectContainerMid");
const projectContainerTop = document.getElementById("projectContainerTop");
const titleContainer = document.getElementById("titleContainer");
const sideMenu = document.getElementById("sidebar");
const menuBttn = document.getElementById("menuBttn");
const addProject = document.getElementById("addProject");
const getInfo = document.getElementById("getInfo");
const submitProjectNew = document.getElementById("submitNewProject");
const projectName = document.getElementById("name");
const projectNameContainer = document.getElementById("projectNameContainer");
const viewProjectsButton = document.querySelector(".viewProjects");
const viewProjectsIcon = document.querySelector(".viewProjects i");

//class for project
const projectFactory = (name) => {
  const items = [];
  return { name, items };
};

//class for item in project
const itemFactory = (project, title, description, dueDate, priority) => {
  return { project, title, description, dueDate, priority };
};

//initialize project array
export let listOfProjects = [];

//get info from local storage and add to listOfProjects if it has not already been added
let currentView = "all";
localStorageAdd();
todoController();
dropDownProject();

//menu reveal/hide
menuBttn.addEventListener("click", function () {
  if (sideMenu.style.display !== "none") {
    sideMenu.style.display = "none";
  } else {
    sideMenu.style.display = "flex";
  }
});

//add button event to add new project
addProject.addEventListener("click", function () {
  getInfo.classList.add("getInfoVisible");
});

//add button event to add project from the submit form
submitProjectNew.addEventListener("click", function () {
  if (projectName.value !== "") {
    let tempProject = projectFactory(projectName.value);
    projectName.value = "";
    listOfProjects.push(tempProject);
    let listString = JSON.stringify(listOfProjects);
    localStorage.setItem("list", listString);
    dropDownProject();
    if (boolViewProjects === true) viewProjects();
  }
});
//view all projects button events in sidebar
let boolViewProjects = false;

viewProjectsButton.addEventListener("click", () => {
  if (boolViewProjects === false) {
    projectNameContainer.innerHTML = "";
    viewProjectsIcon.classList.toggle("fa-arrow-down-long");
    viewProjectsIcon.classList.toggle("fa-arrow-right-long");
    viewProjects();
  } else {
    projectNameContainer.innerHTML = "";
    viewProjectsIcon.classList.toggle("fa-arrow-down-long");
    viewProjectsIcon.classList.toggle("fa-arrow-right-long");
  }
  boolViewProjects === false
    ? (boolViewProjects = true)
    : (boolViewProjects = false);
});
//populate sidemenu with projects in projects array
function viewProjects() {
  projectNameContainer.innerHTML = "";
  for (let x = 0; x < listOfProjects.length; x++) {
    const projectContainer = document.createElement("div");
    projectContainer.classList.add("sideProjectContainer");
    const name = document.createElement("button");
    name.classList.add("projectClassSidebar");
    name.innerHTML = listOfProjects[x].name;
    const delte = document.createElement("button");
    delte.innerHTML = "X";
    delte.classList.add("deleteProject");
    delte.classList.add("projectList");
    projectContainer.appendChild(name);
    projectContainer.appendChild(delte);
    projectNameContainer.appendChild(projectContainer);
  }
  projectDeleteEvents();
  displayProject();
}
//delete project and update dom
function projectDeleteEvents() {
  const projectDeleteButtons = document.getElementsByClassName("deleteProject");
  for (let x = 0; x < projectDeleteButtons.length; x++) {
    projectDeleteButtons[x].addEventListener("click", () => {
      const title = projectDeleteButtons[x].parentElement.firstChild.innerHTML;
      deleteProject(title);
    });
  }
}
//display only items in chosen project using button
function displayProject() {
  const displayProject = document.getElementsByClassName("projectClassSidebar");
  for (let x = 0; x < displayProject.length; x++) {
    displayProject[x].addEventListener("click", () => {
      const title = displayProject[x].parentElement.firstChild.innerHTML;
      currentView = title;
      todoController();
    });
  }
}
//populate list for todo form, allows users to choose from available projects to add todo to
function dropDownProject() {
  const projectDropdown = document.getElementById("project");
  projectDropdown.innerHTML = "";
  for (let x = 0; x < listOfProjects.length; x++) {
    let choice = document.createElement("option");
    choice.innerHTML = listOfProjects[x].name;
    projectDropdown.appendChild(choice);
  }
}
//delete project
function deleteProject(title) {
  for (let x = 0; x < listOfProjects.length; x++) {
    if (listOfProjects[x].name === title) {
      console.log(listOfProjects[x].name);
      listOfProjects.splice(x, 1);
      updateLocalStorage();
      todoController();
      viewProjects();
      dropDownProject();
      break;
    }
  }
}
//add events for todo button
const addTodoSide = document.getElementById("addTodoSide");
addTodoSide.addEventListener("click", () => {
  const todoInfo = document.getElementById("todoInfo");
  todoInfo.classList.add("getInfoVisible");
});
//add event listener for submit button for adding todo item
const submitTodoButton = document.getElementById("submitTodo");
submitTodoButton.addEventListener("click", () => {
  checkForm() ? addTodo() : console.log("invalid entries");
});
//get all elements for form
let form = {
  priority: document.getElementById("priority"),
  project: document.getElementById("project"),
  todo: document.getElementById("todo"),
  dueDate: document.getElementById("dueDate"),
  description: document.getElementById("description"),
};
//check if todo form is filled out
function checkForm() {
  for (const x in form) {
    if (form[x].value === "") {
      return false;
    }
  }
  return true;
}
//function to add todo elements to dom
function addDateTitle() {
  let date = new Date();
  date = format(new Date(), "P");
  const today = document.createElement("h1");
  const dateInfo = document.createElement("h4");
  today.innerHTML = "Today   ";
  dateInfo.innerHTML = date;
  titleContainer.appendChild(today);
  titleContainer.appendChild(dateInfo);
  projectContainerTop.appendChild(titleContainer);
}
//add title to main container, showing which items are being shown
function addTitle(title) {
  const today = document.createElement("h1");
  const dateInfo = document.createElement("h4");
  today.innerHTML = title;
  titleContainer.appendChild(today);
  projectContainerTop.appendChild(titleContainer);
}
//sort each projects
//controller for deciding which items are shown
function todoController() {
  projectContainerMid.innerHTML = "";
  projectContainerTop.innerHTML = "";
  titleContainer.innerHTML = "";
  if (currentView === "today") {
    addDateTitle();
    todayItems("today");
  } else if (currentView === "all") {
    addTitle("All Items");
    all();
  } else if (currentView === "urgent") {
    addTitle("Urgent Items");
    urgent();
  } else if (currentView === "upcoming") {
    addTitle("Upcoming Items");
    upcoming();
  } else {
    addTitle(currentView);
    project(currentView);
  }
  deleteButton();
  editButtonFunc();
}
//function to display upcoming items
function upcoming() {
  const today = new Date();
  for (let x = 0; x < listOfProjects.length; x++) {
    for (let y = 0; y < listOfProjects[x].items.length; y++) {
      let tempDate = new Date(listOfProjects[x].items[y].dueDate);
      if (compareAsc(tempDate, today) === 1) {
        createTodoDiv(listOfProjects[x].items[y]);
      }
    }
  }
}
//function to get specific todos from single project
function project(projTitle) {
  for (let x = 0; x < listOfProjects.length; x++) {
    for (let y = 0; y < listOfProjects[x].items.length; y++) {
      if (listOfProjects[x].items[y].project === projTitle) {
        createTodoDiv(listOfProjects[x].items[y]);
      }
    }
  }
}
//function to filter and add only the high priority items to the dom
function urgent() {
  for (let x = 0; x < listOfProjects.length; x++) {
    for (let y = 0; y < listOfProjects[x].items.length; y++) {
      if (listOfProjects[x].items[y].priority === "high")
        createTodoDiv(listOfProjects[x].items[y]);
    }
  }
}
//add all todo items to container
function all() {
  let tempTodoContainer = [];
  for (let x = 0; x < listOfProjects.length; x++) {
    for (let y = 0; y < listOfProjects[x].items.length; y++) {
      tempTodoContainer.push(listOfProjects[x].items[y]);
    }
  }
  const todos = sortByDates(tempTodoContainer);
  for (let x = 0; x < todos.length; x++) {
    createTodoDiv(todos[x]);
  }
}

//add only todays items to container
function todayItems(choice) {
  for (let x = 0; x < listOfProjects.length; x++) {
    for (let y = 0; y < listOfProjects[x].items.length; y++) {
      const todoContainer = document.createElement("div");
      todoContainer.classList.add("todo");
      const todaysDate = format(new Date(), "MM/d/yyyy");
      if (
        todaysDate ===
        format(new Date(listOfProjects[x].items[y].dueDate), "MM/d/yyyy")
      ) {
        createTodoDiv(listOfProjects[x].items[y]);
      }
    }
  }
}
//creates todo div etc. and adds it to dom
function createTodoDiv(object) {
  const todoContainer = document.createElement("div");
  todoContainer.classList.add("todo");
  const title = document.createElement("div");
  title.classList.add("title");
  title.innerHTML = object.title;

  const dueDate = document.createElement("div");
  dueDate.innerHTML = object.dueDate;

  todoContainer.appendChild(dueDate);
  todoContainer.appendChild(title);
  const buttonContainer = document.createElement("div");
  const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");

  editButton.innerHTML = "edit";
  deleteButton.innerHTML = "X";

  editButton.classList.add("editButton");
  deleteButton.classList.add("deleteButton");
  buttonContainer.appendChild(editButton);
  buttonContainer.appendChild(deleteButton);

  todoContainer.appendChild(buttonContainer);

  if (object.priority === "low") {
    todoContainer.classList.add("low");
  } else if (object.priority === "medium") {
    todoContainer.classList.add("medium");
  } else {
    todoContainer.classList.add("high");
  }
  projectContainerMid.appendChild(todoContainer);
}

//add todo to chosen project
function addTodo() {
  const inputDate = new Date(form.dueDate.value.replace(/-/g, "/"));
  const tempTodo = itemFactory(
    form.project.value,
    form.todo.value,
    form.description.value,
    format(new Date(inputDate), "MM/d/yyyy"),
    form.priority.value
  );

  //finding project in array of projects and add todo to it
  for (let x = 0; x < listOfProjects.length; x++) {
    if (listOfProjects[x].name === form.project.value) {
      listOfProjects[x].items.push(tempTodo);
    }
  }
  const infoName = document.getElementById("description");
  infoName.value = "";
  const todoInfo = document.getElementById("todo");
  todoInfo.value = "";
  updateLocalStorage();
  todoController();
}
//function to update local storage
function updateLocalStorage() {
  localStorage.setItem("list", JSON.stringify(listOfProjects));
  let res = localStorage.getItem("list");
  res = JSON.parse(res);
  listOfProjects = res;
}
//function to initially load local storage list
function localStorageAdd() {
  if (!localStorage.getItem("list")) {
    localStorage.setItem("list", JSON.stringify(listOfProjects));
  } else {
    let res = localStorage.getItem("list");
    res = JSON.parse(res);
    listOfProjects = res;
  }
}

//today add event button. will add click event that displays all events due today
const todayButton = document.getElementById("today");
todayButton.addEventListener("click", () => {
  currentView = "today";
  todoController();
});
//future button, displays all items that are in the future
const upcomingButton = document.getElementById("upcoming");
upcomingButton.addEventListener("click", () => {
  currentView = "upcoming";
  todoController();
});
//main menu button
const mainMenu = document.getElementById("main");
mainMenu.addEventListener("click", () => {
  currentView = "all";
  todoController();
});
//urgent button, displays all the todos with high priority
const urgentButton = document.getElementById("urgent");
urgentButton.addEventListener("click", () => {
  currentView = "urgent";
  todoController();
});

//exit out of todo form
const exitButtonTodo = document.getElementById("exitButton");
exitButtonTodo.addEventListener("click", () => {
  todoInfo.classList.remove("getInfoVisible");
});
//exit button for project form
const projectExit = document.getElementById("exitButtonProject");
projectExit.addEventListener("click", () => {
  getInfo.classList.remove("getInfoVisible");
});

//submit button for edit form
function editButtonEvents(x, y) {
  const editSubmitButton = document.getElementsByClassName("editSubmitButton");
  for (let q = 0; q < editSubmitButton.length; q++) {
    editSubmitButton[q].addEventListener("click", () => {
      openEdit = false;
      const editedTodo = itemFactory(
        document.getElementById("projectList").value,
        document.getElementById("todoEdit").value,
        document.getElementById("descriptionEdit").value,
        format(
          new Date(
            new Date(
              document.getElementById("dueDateEdit").value.replace(/-/g, "/")
            )
          ),
          "MM/d/yyyy"
        ),
        document.getElementById("priorityEdit").value
      );
      for (let z = 0; z < listOfProjects.length; z++) {
        if (listOfProjects[z].name === editedTodo.project) {
          listOfProjects[x].items.splice(y, 1);
          listOfProjects[z].items.push(editedTodo);
          updateLocalStorage();
          todoController();
          return;
        }
      }
    });
  }
  const editCancelButton = document.getElementsByClassName("editCancelButton");
  for (let x = 0; x < editCancelButton.length; x++) {
    editCancelButton[x].addEventListener("click", () => {
      openEdit = false;
      todoController();
    });
  }
}

//delete todo
function deleteButton() {
  const deleteTodo = document.getElementsByClassName("deleteButton");
  for (let x = 0; x < deleteTodo.length; x++) {
    deleteTodo[x].addEventListener("click", () => {
      const title =
        deleteTodo[x].parentElement.parentElement.getElementsByClassName(
          "title"
        )[0].innerHTML;
      for (let x = 0; x < listOfProjects.length; x++) {
        for (let y = 0; y < listOfProjects[x].items.length; y++) {
          if (listOfProjects[x].items[y].title === title) {
            listOfProjects[x].items.splice(y, 1);
            updateLocalStorage();
            todoController();
          }
        }
      }
    });
  }
}
//function for edit button, will expand todo item and allow user to update the localstorage with new todo
//value determines whether or not editor is allowed to open, only allowed if another editor is not already open
let openEdit = false;
function editButtonFunc() {
  const editTodo = document.getElementsByClassName("editButton");
  for (let x = 0; x < editTodo.length; x++) {
    editTodo[x].addEventListener("click", () => {
      if (openEdit == false) {
        const title =
          editTodo[x].parentElement.parentElement.getElementsByClassName(
            "title"
          )[0].innerHTML;
        const todoBox = editTodo[x].parentElement.parentElement;
        for (let x = 0; x < listOfProjects.length; x++) {
          for (let y = 0; y < listOfProjects[x].items.length; y++) {
            if (listOfProjects[x].items[y].title === title) {
              const outputX = x;
              const outputY = y;
              editContainer(todoBox, outputX, outputY);
              updateLocalStorage();
              break;
            }
          }
        }
      }
    });
  }
}

//create elements for todo edit

/*
      const project = document.createElement("div");
      project.innerHTML = listOfProjects[x].items[y].project;
      todoContainer.appendChild(project);
      const description = document.createElement("div");
      description.innerHTML = listOfProjects[x].items[y].description;
      todoContainer.appendChild(description);

            const priority = document.createElement("div");
      priority.innerHTML = listOfProjects[x].items[y].priority;
            todoContainer.appendChild(priority);
      */
