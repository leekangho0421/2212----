const inputElement = document.getElementById('todo-input');
const buttonElement = document.getElementById('add-btn');
const todoListElement = document.getElementById('todo-list');

// 1. 우리의 진짜 데이터 그릇 (할 일 목록 배열)
let todos = [];

// 2. 창고(로컬 스토리지)에 데이터를 저장하는 함수
function saveTodos() {
    // 배열(todos)을 문자열로 바꿔서 'myTodos'라는 이름표를 붙여 저장합니다.
    localStorage.setItem('myTodos', JSON.stringify(todos));
}

// 3. 화면을 그리는 함수 (배열에 있는 데이터를 바탕으로 카드를 만듭니다)
function renderTodos() {
    todoListElement.innerHTML = ''; // 화면이 중복해서 그려지지 않게 일단 싹 비웁니다.

    // 배열(todos) 안에 있는 각각의 할 일(todo)마다 카드를 만듭니다.
    todos.forEach(function(todo) {
        const newCard = document.createElement('div');
        
        const textSpan = document.createElement('span');
        textSpan.textContent = todo.text; // 사용자가 입력했던 글자
        
        // 데이터의 isCompleted가 true라면 취소선을 긋습니다.
        if (todo.isCompleted === true) {
            textSpan.style.textDecoration = 'line-through';
            textSpan.style.color = 'gray';
        }

        // 완료 버튼
        const completeBtn = document.createElement('button');
        completeBtn.textContent = '완료';
        completeBtn.addEventListener('click', function() {
            todo.isCompleted = !todo.isCompleted; // 완료 상태를 반대로 뒤집습니다 (true <-> false)
            saveTodos();    // 데이터가 바뀌었으니 창고에 다시 저장!
            renderTodos();  // 바뀐 데이터를 바탕으로 화면 다시 그리기!
        });

        // 삭제 버튼
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '삭제';
        deleteBtn.addEventListener('click', function() {
            if (confirm('정말 삭제하시겠습니까?')) {
                // 삭제할 카드만 쏙 빼고 배열을 새로 만듭니다 (filter 기능)
                todos = todos.filter(function(t) {
                    return t.id !== todo.id; 
                });
                saveTodos();    // 삭제된 배열을 창고에 덮어쓰기!
                renderTodos();  // 화면 다시 그리기!
            }
        });

        newCard.appendChild(textSpan);
        newCard.appendChild(completeBtn);
        newCard.appendChild(deleteBtn);
        todoListElement.appendChild(newCard);
    });
}

// 4. '추가하기' 버튼을 눌렀을 때
buttonElement.addEventListener('click', function() {
    const inputValue = inputElement.value;
    if (inputValue === '') {
        alert('할 일을 입력해주세요!');
        return;
    }

    // 새로운 할 일 '객체' 데이터 만들기
    const newTodo = {
        id: Date.now(), // 카드를 구별하기 위한 고유 번호 (현재 시간을 밀리초로 사용)
        text: inputValue,
        isCompleted: false
    };

    todos.push(newTodo); // 1. 배열에 데이터 밀어 넣기
    saveTodos();         // 2. 창고에 저장하기
    renderTodos();       // 3. 화면 다시 그리기

    inputElement.value = '';
});

// 5. 프로그램이 맨 처음 시작될 때 실행되는 부분 (초기화)
function loadTodos() {
    const savedData = localStorage.getItem('myTodos'); // 창고에서 데이터 꺼내기
    
    if (savedData !== null) { // 창고에 저장된 데이터가 있다면?
        todos = JSON.parse(savedData); // 문자열을 다시 배열로 풀어서 todos 그릇에 담기
        renderTodos(); // 불러온 데이터를 바탕으로 화면 그리기
    }
}

// 브라우저를 켜자마자 가장 먼저 저장된 데이터를 불러옵니다.
loadTodos();