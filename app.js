let section = document.querySelector('section');
let add = document.querySelector('form button');
add.addEventListener('click', e => {
    e.preventDefault();

    // get the input value
    let form = e.target.parentElement;
    let todoText = form.children[0].value;
    let month = form.children[1].value;
    let day = form.children[2].value;
    /** test console
     * console.log(todotext);
     * console.log(month);
     * console.log(day);
    */

    if (todoText === '') {
        alert('Please input todo text!');
        return;
    }

    // create a todo
    let todo = document.createElement('div');
    todo.classList.add('todo');
    let text = document.createElement('p');
    text.classList.add('todo-text')
    text.innerText = todoText;
    let time = document.createElement('p');
    time.classList.add('todo-time');
    time.innerText = month + ' / ' + day;
    todo.appendChild(text);
    todo.appendChild(time);

    // create check icon
    let completeButton = document.createElement('button');
    completeButton.classList.add('complete');
    completeButton.innerHTML = '<i class="fas fa-check"></i>';
    completeButton.addEventListener('click', e => {
        // console.log(e.target.parentElement);
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle('done');
    })

    // create trash icon
    let trashButton = document.createElement('button');
    trashButton.classList.add('trash');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>'
    trashButton.addEventListener('click', e => {
        let todoItem = e.target.parentElement;
        todoItem.addEventListener('animationend', () => {
            todoItem.remove(); // will wait animation end
            // remove from localstorage
            let text = todoItem.children[0].innerText;
            let myListArray = JSON.parse(localStorage.getItem('list'));
            myListArray.forEach((item, index) => {
                if (item.todoText == text) {
                    myListArray.splice(index, 1);
                    localStorage.setItem('list', JSON.stringify(myListArray));
                }
            })
        })
        todoItem.style.animation = 'scaleDown 0.5s forwards'
    })

    // button add
    todo.appendChild(completeButton);
    todo.appendChild(trashButton);

    // todo adding animation
    todo.style.animation = 'scaleUp 0.5s forwards';

    // create an object
    let newTodo = {
        todoText: todoText,
        todoMonth: month,
        todoDay: day
    }

    // store data into an array of objects
    let myList = localStorage.getItem('list');
    if (myList == null) {
        localStorage.setItem('list', JSON.stringify([newTodo]));
    } else {
        let myListArray = JSON.parse(myList);
        myListArray.push(newTodo);
        localStorage.setItem('list', JSON.stringify(myListArray));
    }

    // todo add
    section.appendChild(todo);

    // reset
    form.children[0].value = "";
})


loadData();
// load local storage
function loadData() {
    let myList = localStorage.getItem('list');
    if (myList !== null) {
        let myListArray = JSON.parse(myList);
        myListArray.forEach(item => {
            let todo = document.createElement('div');
            todo.classList.add('todo');
            let text = document.createElement('p');
            text.classList.add('todo-text');
            text.innerText = item.todoText;
            let time = document.createElement('p');
            time.classList.add('todo-time');
            time.innerText = item.todoMonth + ' / ' + item.todoDay;
            todo.appendChild(text);
            todo.appendChild(time);

            // create check icon
            let completeButton = document.createElement('button');
            completeButton.classList.add('complete');
            completeButton.innerHTML = '<i class="fas fa-check"></i>';
            completeButton.addEventListener('click', e => {
            // console.log(e.target.parentElement);
            let todoItem = e.target.parentElement;
            todoItem.classList.toggle('done');
        })

        // create trash icon
        let trashButton = document.createElement('button');
        trashButton.classList.add('trash');
        trashButton.innerHTML = '<i class="fas fa-trash"></i>'
        trashButton.addEventListener('click', e => {
            let todoItem = e.target.parentElement;
            todoItem.addEventListener('animationend', () => {
                todoItem.remove(); // will wait animation end
                // remove from localstorage
                let text = todoItem.children[0].innerText;
                let myListArray = JSON.parse(localStorage.getItem('list'));
                myListArray.forEach((item, index) => {
                    if (item.todoText == text) {
                        myListArray.splice(index, 1);
                        localStorage.setItem('list', JSON.stringify(myListArray));
                    }
                })
            })
            todoItem.style.animation = 'scaleDown 0.5s forwards'
        })

        // button add
        todo.appendChild(completeButton);
        todo.appendChild(trashButton);

        // todo adding animation
        todo.style.animation = 'scaleUp 0.5s forwards';

        section.appendChild(todo);
        })
        }
}


function mergeTime(arr1, arr2) {
    let result = [];
    let i = 0;
    let j = 0;

    while (i < arr1.length && j < arr2.length) {
        if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
            result.push(arr2[j]);
            j++;
        } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
            result.push(arr1[i]);
            i++;
        } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
            if (Number(arr1[i].todoDay) > Number(arr2[j].todoDay)) {
                result.push(arr2[j]);
                j++;
            } else {
                result.push(arr1[i]);
                i++;
            }
        }
    }

    while (i < arr1.length) {
        result.push(arr1[i]);
        i++;
    }
    while (j < arr2.length) {
        result.push(arr2[j]);
        j++;
    }

    return result;
}

function mergeSort(arr) {
    if (arr.length === 1) {
        return arr;
    } else {
        let middle = Math.floor(arr.length / 2);
        let right = arr.slice(0, middle);
        let left = arr.slice(middle, arr.length);
        return mergeTime(mergeSort(right), mergeSort(left));
    }
}



// sort button
let sortButton = document.querySelector('div.sort button')
sortButton.addEventListener('click', () => {
    // sort data
    let sortedArray = mergeSort(JSON.parse(localStorage.getItem('list')));
    localStorage.setItem('list', JSON.stringify(sortedArray));

    // remove data
    let len = section.children.length;
    for (let i = 0; i < len; i++) {
        section.children[0].remove();
    }

    // load data
    loadData();
})