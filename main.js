let menuIcon = document.querySelector(".all-lists .menu-icon");
let listContainer = document.querySelector(".all-lists .lists");
let newListInput = document.querySelector("form .list");
let newListBtn = newListInput.previousElementSibling;
let deleteListBtn = document.querySelector(".delete .btn.all");
let deleteCompleteBtn = document.querySelector(".delete > .btn.completed");
let lists = JSON.parse(localStorage.getItem("toDoAppLists")) || [];
let activeListId = localStorage.getItem("toDoAppActiveListId") || "null";
let toDoList = document.querySelector(".todo-list");
let toDoListName = document.querySelector(".todo-list .list-title");
let toDoListTaskCount = document.querySelector(".todo-list .task-count");
let todoListTasks = document.querySelector(".todo-list .tasks");
let taskTemplate = document.getElementById("task-template");
let newTaskBtn = document.querySelector(".task-creator .btn.create");
let newTaskInput = document.querySelector(".task-creator .task");

//open and close side list in mobile screens
menuIcon.parentElement.addEventListener("click", (ev) => {
  if (ev.target === menuIcon) {
    menuIcon.parentElement.classList.toggle("active");
  }
  ev.stopPropagation();
});
document.addEventListener("click", (ev) => {
  if (menuIcon.parentElement.classList.contains("active")) {
    menuIcon.parentElement.classList.remove("active");
  }
});

render();

// create new list
newListBtn.addEventListener("click", (ev) => {
  ev.preventDefault();
  let listInput = newListInput.value.trim();
  if (listInput && !isDuplicate(listInput, listContainer.children)) {
    let newList = CreateListItem(listInput);
    lists.push(newList);
    activeListId = newList.id;
    saveToLS();
    render();
    newListInput.value = "";
  } else {
    listInput
      ? window.alert("this list already exists")
      : window.alert("enter the list name");
  }
});

// on clicking on list Item
listContainer.addEventListener("click", (ev) => {
  if (ev.target.nodeName === "LI") {
    activeListId = ev.target.dataset.listId;
    saveToLS();
    render();
  }
});

// delete list on delete-list-button click
deleteListBtn.addEventListener("click", () => {
  lists = lists.filter((list) => {
    return list.id !== activeListId;
  });
  activeListId = lists.length > 0 ? lists[0].id : "null";
  saveToLS();
  render();
});

// delete completed tasks on delete-completed-tasks-button click
deleteCompleteBtn.addEventListener("click", (ev) => {
  let activeList = lists.find((list) => list.id === activeListId);
  activeList.tasks = activeList.tasks.filter((task) => !task.complete);
  saveToLS();
  render();
});

// create new task
newTaskBtn.addEventListener("click", (ev) => {
  ev.preventDefault();
  let taskInput = newTaskInput.value.trim();
  if (
    taskInput &&
    !isDuplicate(taskInput, todoListTasks.querySelectorAll("label"))
  ) {
    let newTask = CreateTaskItem(taskInput);
    let activeList = lists.find((list) => list.id === activeListId);
    activeList.tasks.push(newTask);
    saveToLS();
    render();
    newTaskInput.value = "";
  } else {
    taskInput
      ? window.alert("this list already exists")
      : window.alert("enter the list name");
  }
});

// on clicking on task Item
todoListTasks.addEventListener("click", (ev) => {
  if (ev.target.tagName.toLowerCase() == "input") {
    let activeList = lists.find((list) => list.id === activeListId);
    let activeTask = activeList.tasks.find((task) => task.id === ev.target.id);
    activeTask.complete = ev.target.checked;
    saveToLS();
    changeTasksCount(activeList);
  }
});

// function to render lists and tasks
function render() {
  renderLists();
  renderTasks();
}

// a function to build all the main lists
function renderLists() {
  clearElement(listContainer);
  lists.forEach((list) => {
    let listElement = document.createElement("li");
    listElement.innerText = list.name;
    listElement.dataset.listId = list.id;
    if (list.id === activeListId) {
      listElement.classList.add("active");
    }
    listContainer.appendChild(listElement);
  });
}

// a function to build tasks
function renderTasks() {
  let activeList = lists.find((list) => list.id === activeListId);
  if (activeListId === "null") {
    toDoList.style.setProperty("display", "none");
  } else {
    toDoList.style.setProperty("display", "");
    // update list name
    toDoListName.textContent = activeList.name;
    // update remaining tasks
    changeTasksCount(activeList);
    // clear current tasks and building new ones
    clearElement(todoListTasks);
    activeList.tasks.forEach((task) => {
      let taskElement = document.importNode(taskTemplate.content, true);
      let taskInput = taskElement.querySelector("[type]");
      let taskLabel = taskElement.querySelector("label");
      taskInput.id = task.id;
      taskInput.checked = task.complete;
      taskLabel.htmlFor = task.id;
      taskLabel.textContent = task.name;
      todoListTasks.appendChild(taskElement);
    });
  }
}
// a function to change the count of remaining tasks
function changeTasksCount(list) {
  let taskCount = list.tasks.filter((task) => !task.complete).length;
  toDoListTaskCount.textContent = `${taskCount} ${
    taskCount == 1 ? "task" : "tasks"
  } remaining`;
}
// a function to save data to local storage
function saveToLS() {
  localStorage.setItem("toDoAppLists", JSON.stringify(lists));
  localStorage.setItem("toDoAppActiveListId", activeListId);
}

// function to clear all children of an element
function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// function to check if new entry already exists
function isDuplicate(newest, current) {
  let currentArr = Array.from(current);
  return currentArr.some(
    (ele) => ele.innerHTML.toLowerCase() === newest.toLowerCase()
  );
}

// function to create a new list item
function CreateListItem(value) {
  return {
    id: Date.now().toString(),
    name: value,
    tasks: [],
  };
}

// function to create a new task item
function CreateTaskItem(value) {
  return {
    id: Date.now().toString(),
    name: value,
    complete: false,
  };
}
