import "./styles/main.css";
import { format, compareAsc } from "date-fns";
import { sortByDates } from "./importFunc";
import { editContainer } from "./dom";
import { RunEventListeners, form, dropDownProject } from "./eventListener";
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";

library.add(faCheck);
dom.watch();

//dom elements
const projectContainerMid = document.getElementById("projectContainerMid");
const projectContainerTop = document.getElementById("projectContainerTop");
const titleContainer = document.getElementById("titleContainer");
const getInfo = document.getElementById("getInfo");
const projectNameContainer = document.getElementById("projectNameContainer");

//class for project
const projectFactory = (name) => {
  const items = [];
  return { name, items };
};

//class for item in project
const itemFactory = (
  project,
  title,
  description,
  dueDate,
  priority,
  completed
) => {
  return { project, title, description, dueDate, priority, completed };
};

//initialize project array
let listOfProjects = [];
let openEdit = {
  value: false,
};
let currentView = {
  value: "all",
};
//get info from local storage and add to listOfProjects if it has not already been added
localStorageAdd();
todoController();
dropDownProject();
RunEventListeners();

//delete project
function deleteProject(title) {
  for (let x = 0; x < listOfProjects.length; x++) {
    if (listOfProjects[x].name === title) {
      listOfProjects.splice(x, 1);
      updateLocalStorage();
      todoController();
      viewProjects();
      dropDownProject();
      break;
    }
  }
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
  if (currentView.value === "today") {
    addDateTitle();
    todayItems("today");
  } else if (currentView.value === "all") {
    addTitle("All Items");
    all();
  } else if (currentView.value === "urgent") {
    addTitle("Urgent Items");
    urgent();
  } else if (currentView.value === "upcoming") {
    addTitle("Upcoming Items");
    upcoming();
  } else {
    addTitle(currentView.value);
    project(currentView.value);
  }
  deleteButton();
  editButtonFunc();
  checkmark();
}
//function to check if checkmark is checked to signify completed
function checkmark() {
  let checked;
  let item;
  const checkmarks = document.getElementsByClassName("checkbox");
  for (let x = 0; x < checkmarks.length; x++) {
    checkmarks[x].addEventListener("change", () => {
      if (checkmarks[x].checked) {
        checked = true;
      } else {
        checked = false;
      }
      let title =
        checkmarks[x].parentElement.parentElement.getElementsByClassName(
          "title"
        )[0].innerHTML;
      for (let x = 0; x < listOfProjects.length; x++) {
        for (let y = 0; y < listOfProjects[x].items.length; y++) {
          if (listOfProjects[x].items[y].title === title) {
            listOfProjects[x].items[y].completed = checked;
            item = listOfProjects[x].items[y];
            updateLocalStorage();
            todoController();
          }
        }
      }
    });
  }
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
    console.log(todos[x]);
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
  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";

  const todoContainer = document.createElement("div");
  todoContainer.classList.add("todo");

  const title = document.createElement("div");
  title.classList.add("title");
  title.innerHTML = object.title;

  checkBox.classList.add("checkbox");
  const dueDate = document.createElement("div");
  dueDate.innerHTML = object.dueDate;

  const dateCheckbox = document.createElement("div");
  dateCheckbox.classList.add("dateCheckbox");
  dateCheckbox.appendChild(checkBox);
  dateCheckbox.appendChild(dueDate);

  todoContainer.appendChild(dateCheckbox);
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
  if (object.completed === true) {
    dueDate.classList.add("strike");
    title.classList.add("strike");
    checkBox.checked = true;
    todoContainer.classList.add("backgroundChecked");
  }
  if (object.completed === true) {
  }
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
    form.priority.value,
    false
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
function editButtonFunc() {
  const editTodo = document.getElementsByClassName("editButton");
  for (let x = 0; x < editTodo.length; x++) {
    editTodo[x].addEventListener("click", () => {
      if (openEdit.value == false) {
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
              console.log("open");

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
//run event listeners
export {
  listOfProjects,
  openEdit,
  addTodo,
  todoController,
  itemFactory,
  updateLocalStorage,
  currentView,
  projectFactory,
};
