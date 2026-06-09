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
    todoListElement.innerHTML = ''; 

    todos.forEach(function(todo) {
        const newCard = document.createElement('div');
        
        const textSpan = document.createElement('span');
        textSpan.textContent = todo.text; 
        
        // 완료 버튼 먼저 만들기 (글자 이름을 바꿔주기 위해)
        const completeBtn = document.createElement('button');

        // ✨ 여기서부터 완료 상태에 따른 시각적 효과 강화 ✨
        if (todo.isCompleted === true) {
            textSpan.style.textDecoration = 'line-through';
            textSpan.style.color = '#aaa'; // 글자를 좀 더 연한 회색으로
            
            // 카드 전체의 디자인도 바꿈!
            newCard.style.backgroundColor = '#f8f9fa'; // 카드 배경을 연한 회색으로
            newCard.style.opacity = '0.6'; // 카드를 전체적으로 60% 정도 투명하게 만듦 (핵심!)
            
            completeBtn.textContent = '취소'; // 버튼 글자를 '취소'로 변경
        } else {
            // 완료가 안 된 상태일 때 (기본 상태)
            completeBtn.textContent = '완료'; 
        }

        // 완료 버튼 클릭 이벤트
        completeBtn.addEventListener('click', function() {
            todo.isCompleted = !todo.isCompleted; 
            saveTodos();    
            renderTodos();  
        });

        // 삭제 버튼 (이전과 동일)
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '삭제';
        deleteBtn.addEventListener('click', function() {
            if (confirm('정말 삭제하시겠습니까?')) {
                todos = todos.filter(function(t) {
                    return t.id !== todo.id; 
                });
                saveTodos();    
                renderTodos();  
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