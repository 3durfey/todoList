import {
  todoController,
  currentView,
  addTodo,
  listOfProjects,
  projectFactory,
} from ".";

function RunEventListeners() {
  //today add event button. will add click event that displays all events due today
  const todayButton = document.getElementById("today");
  todayButton.addEventListener("click", () => {
    currentView.value = "today";
    todoController();
  });
  //future button, displays all items that are in the future
  const upcomingButton = document.getElementById("upcoming");
  upcomingButton.addEventListener("click", () => {
    currentView.value = "upcoming";
    todoController();
  });
  //main menu button
  const mainMenu = document.getElementById("main");
  mainMenu.addEventListener("click", () => {
    currentView.value = "all";
    todoController();
  });
  //urgent button, displays all the todos with high priority
  const urgentButton = document.getElementById("urgent");
  urgentButton.addEventListener("click", () => {
    currentView.value = "urgent";
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

  const editCancelButton = document.getElementsByClassName("editCancelButton");
  for (let x = 0; x < editCancelButton.length; x++) {
    editCancelButton[x].addEventListener("click", () => {
      openEdit.value = false;
      todoController();
    });
  }
  //add button event to add new project
  const addProject = document.getElementById("addProject");
  addProject.addEventListener("click", function () {
    getInfo.classList.add("getInfoVisible");
  });
  //add button event to add project from the submit form
  const submitProjectNew = document.getElementById("submitNewProject");
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
  const viewProjectsIcon = document.querySelector(".viewProjects i");
  const viewProjectsButton = document.querySelector(".viewProjects");
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
  //menu reveal/hide
  const menuBttn = document.getElementById("menuBttn");
  const sideMenu = document.getElementById("sidebar");
  menuBttn.addEventListener("click", function () {
    if (sideMenu.style.display !== "none") {
      sideMenu.style.display = "none";
    } else {
      sideMenu.style.display = "flex";
    }
  });
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
}
//check if todo form is filled out
function checkForm() {
  for (const x in form) {
    if (form[x].value === "") {
      return false;
    }
  }
  return true;
}
//get all elements for form
let form = {
  priority: document.getElementById("priority"),
  project: document.getElementById("project"),
  todo: document.getElementById("todo"),
  dueDate: document.getElementById("dueDate"),
  description: document.getElementById("description"),
};
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
const projectName = document.getElementById("name");
function displayProject() {
  const displayProject = document.getElementsByClassName("projectClassSidebar");
  for (let x = 0; x < displayProject.length; x++) {
    displayProject[x].addEventListener("click", () => {
      const title = displayProject[x].parentElement.firstChild.innerHTML;
      currentView.value = title;
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
export { RunEventListeners, form, dropDownProject };
