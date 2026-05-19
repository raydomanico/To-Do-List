const timerDpEl=document.getElementById("timer-dp");
const addNewTaskEl=document.getElementById("add-newtask");
const taskFormEl=document.getElementById("task-form");
const taskDescriptionEl=document.getElementById("task-description");
const todoListEl=document.getElementById("todo-list");
const timeDurationEl=document.getElementById("time-duration");
const dateTimeDueEl=document.getElementById("date-time-due");
const currentTasksDpEl=document.getElementById("current-tasks-dp");
const doneListEl=document.getElementById("done-list");
const editTaskel=document.getElementById("edit-task");

const eTaskNameEl=document.getElementById("edit-task-name");
const eTimeDurationEl=document.getElementById("edit-time-duration");
const eDateTimeDueEl=document.getElementById("edit-date-time");
const eTaskDescriptionEl=document.getElementById("edit-task-description");






document.getElementById("add-newtask-btn").addEventListener("click", addNewTask);
document.getElementById("cancel-newtask-btn").addEventListener("click", closeNewTask);
document.getElementById("confirm-newtask-btn").addEventListener("click", confirmNewTask);

document.getElementById("cancel-edit-btn").addEventListener("click", closeNewTask);
document.getElementById("confirm-edit-btn").addEventListener("click", confirmEditTask);

const appState={
    editingTaskId:null,
    taskTimer:0,
    taskDescription:null,
    currentTasks:[],
    todoTasks:[],   
    doneTasks:[]
}

function addNewTask(){
    if(addNewTaskEl.value==""){

        return;
    }
document.getElementById("task-form").showModal();

};

function closeNewTask(){
document.getElementById("task-form").close();
document.getElementById("edit-task").close();
};

function confirmNewTask()
{
    const newTask={
        id:appState.todoTasks.length + 1,
        name:addNewTaskEl.value,
        description:taskDescriptionEl.value,
        timeDuration:timeDurationEl.value,
        dateTimeDue:dateTimeDueEl.value

    }
    appState.todoTasks.push(newTask);
    console.log(appState.todoTasks);
    document.getElementById("task-form").close();
    renderUI();
}

function startTask(event){
    const taskId = event.target.dataset.id;
    for(let i=0;i<appState.todoTasks.length;i++){
if(taskId==appState.todoTasks[i].id){
          const newTaskInfo=appState.todoTasks[i];
         
appState.currentTasks.push(newTaskInfo)  ;
appState.todoTasks.splice(i, 1);        

renderUI();
    }
}
}

function doneTask(event){
    for(let i=0;i<appState.currentTasks.length;i++){
  const taskId = event.target.dataset.id;
    if(taskId==appState.currentTasks[i].id){
        const newCurrentTaskInfo=appState.currentTasks[i];

appState.doneTasks.push(newCurrentTaskInfo);
appState.currentTasks.splice(i,1);  
renderUI();
    }
}
}

function editTask(event){
       document.getElementById("edit-task").showModal();
for(let i=0; i<appState.todoTasks.length; i++){
   const taskId = event.target.dataset.id;

if(taskId==appState.todoTasks[i].id){

eTaskDescriptionEl.value=appState.todoTasks[i].description;
eTaskNameEl.value=appState.todoTasks[i].name;
eDateTimeDueEl.value=appState.todoTasks[i].dateTimeDue;
eTimeDurationEl.value=appState.todoTasks[i].timeDuration;
appState.editingTaskId=taskId
}
}
};

function confirmEditTask(){
const taskId=appState.editingTaskId;
for(let i=0; i <appState.todoTasks.length;i++){
    if(taskId==appState.todoTasks[i].id){
        appState.todoTasks[i].name=eTaskNameEl.value;
         appState.todoTasks[i].description=eTaskDescriptionEl.value;
          appState.todoTasks[i].dateTimeDue=eDateTimeDueEl.value;
           appState.todoTasks[i].timeDuration=eTimeDurationEl.value;

    }

}
console.log(taskDescriptionEl.value)
    closeNewTask();
        renderUI();
}

function deleteTask(event){
    const taskId = event.target.dataset.id;
    for(let i=0;i<appState.todoTasks.length;i++){
        if(taskId==appState.todoTasks[i].id){

         appState.todoTasks.splice(i,1);
         renderUI();
        }
    }

      for(let i=0;i<appState.currentTasks.length;i++){
        if(taskId==appState.currentTasks[i].id){

         appState.currentTasks.splice(i,1);
         renderUI();
        }
    }

}


function renderUI(){
 

    todoListEl.textContent="";

    for(let i=0; i<appState.todoTasks.length;i++){
    const newTask=appState.todoTasks[i].name;
    const li=document.createElement("li");
    const buttonStart=document.createElement("button");
    const buttonDel=document.createElement("button");
    const buttonEdit=document.createElement("button");
    
    buttonStart.addEventListener("click", startTask)
    buttonDel.addEventListener("click", deleteTask)
    buttonEdit.addEventListener("click", editTask)

    buttonStart.textContent="+"; 
    buttonDel.textContent="-"; 
    buttonEdit.textContent="edit";

    buttonStart.dataset.id=appState.todoTasks[i].id;
    buttonDel.dataset.id=appState.todoTasks[i].id;
    buttonEdit.dataset.id=appState.todoTasks[i].id;

    li.textContent=newTask;
    console.log(appState.todoTasks.length);
    todoListEl.appendChild(li); 
    li.appendChild(buttonStart); 
    li.appendChild(buttonDel); 
    li.appendChild(buttonEdit);

    }
currentTasksDpEl.textContent="";
for(let i=0;i<appState.currentTasks.length;i++){

    const buttonStart=document.createElement("button");
    const buttonDel=document.createElement("button");

    buttonStart.addEventListener("click", doneTask);
    buttonDel.addEventListener("click", deleteTask);

    buttonStart.dataset.id=appState.currentTasks[i].id;
    buttonDel.dataset.id=appState.currentTasks[i].id;

    buttonStart.textContent="+"; 
    buttonDel.textContent="-"; 

    const li=document.createElement("li")  
    newCurrentTask=appState.currentTasks[i].name;
    li.textContent=newCurrentTask;
    
    li.appendChild(buttonStart);
    li.appendChild(buttonDel);
 
    currentTasksDpEl.appendChild(li);
    
}
    addNewTaskEl.value="";
    taskDescriptionEl.value="";
    timeDurationEl.value="";
    dateTimeDueEl.value="";
}

renderUI();
