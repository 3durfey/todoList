import {
  listOfProjects,
  openEdit,
  todoController,
  itemFactory,
  updateLocalStorage,
} from "./index";
import { format, compareAsc } from "date-fns";

function editContainer(todoBox, x, y) {
  todoBox.style.height = "400px";
  todoBox.innerHTML = "";
  todoBox.classList.add("editTodo");
  const todo = document.createElement("input");
  todo.id = "todoEdit";
  todo.value = listOfProjects[x].items[y].title;

  const dueDate = document.createElement("input");
  dueDate.id = "dueDateEdit";
  dueDate.type = "date";
  dueDate.valueAsDate = new Date(listOfProjects[x].items[y].dueDate);

  const priority = document.createElement("select");
  priority.id = "priorityEdit";
  const choice1 = document.createElement("option");
  choice1.innerHTML = "low";
  const choice2 = document.createElement("option");
  choice2.innerHTML = "medium";
  const choice3 = document.createElement("option");
  choice3.innerHTML = "high";
  priority.appendChild(choice1);
  priority.appendChild(choice2);
  priority.appendChild(choice3);
  priority.value = listOfProjects[x].items[y].priority;

  const projectList = document.createElement("select");
  projectList.id = "projectList";
  for (let x = 0; x < listOfProjects.length; x++) {
    let choice = document.createElement("option");
    choice.innerHTML = listOfProjects[x].name;
    projectList.appendChild(choice);
  }
  projectList.value = listOfProjects[x].items[y].project;

  const descriptionEdit = document.createElement("textarea");
  descriptionEdit.id = "descriptionEdit";
  const editListTop = document.createElement("div");
  editListTop.classList.add("editListTop");
  descriptionEdit.value = listOfProjects[x].items[y].description;

  editListTop.appendChild(priority);
  editListTop.appendChild(projectList);

  const submitButton = document.createElement("button");
  submitButton.classList.add("formButton");
  submitButton.classList.add("editSubmitButton");
  submitButton.innerHTML = "Submit";

  const cancelButton = document.createElement("button");
  cancelButton.classList.add("formButton");
  cancelButton.classList.add("editCancelButton");

  cancelButton.innerHTML = "Cancel";
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("getInfoButtonContainer");
  buttonContainer.appendChild(submitButton);
  buttonContainer.appendChild(cancelButton);

  todoBox.appendChild(editListTop);
  todoBox.appendChild(todo);
  todoBox.appendChild(dueDate);
  todoBox.appendChild(descriptionEdit);
  todoBox.appendChild(buttonContainer);
  editButtonEvents(x, y);
  openEdit.value = true;
}
//submit button for edit form
function editButtonEvents(x, y) {
  const editSubmitButton = document.getElementsByClassName("editSubmitButton");
  for (let q = 0; q < editSubmitButton.length; q++) {
    editSubmitButton[q].addEventListener("click", () => {
      openEdit.value = false;
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
      openEdit.value = false;
      todoController();
    });
  }
}
export { editContainer };
