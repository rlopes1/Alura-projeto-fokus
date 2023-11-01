const taskListContainer = document.querySelector('.app__section-task-list')

const formTask = document.querySelector('.app__form-add-task');
const toggleFormTaskBtn = document.querySelector('.app__button--add-task');
const formLabel = document.querySelector('.app__form-label');

const textArea= document.querySelector('.app__form-textarea');

const formCancelBt = document.querySelector('.app__form-footer__button--cancel');

const deletarBt = document.querySelector('.app__form-footer__button--delete');

const taskActiveDescription = document.querySelector('.app__section-active-task-description');

const localStorageTarefas = localStorage.getItem('tarefas')

const deletarTarefasConcluidasBt = document.querySelector('#btn-remover-concluidas')
const deletarTodasTarefas = document.querySelector('#btn-remover-todas');


let tarefas = localStorageTarefas? JSON.parse(localStorageTarefas) : [];


const taskIconSvg = `<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="12" cy="12" r="12" fill="#FFF" />
<path
    d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
    fill="#01080E" />
</svg>`;

let tarefaSelecionada = null;
let itemTarefaSelecionada = null;

let tarefaEmEdicao = null
let paragraphEmEdicao = null

const selecionaTarefa = (tarefa, li)=> {

    if(tarefa.concluida){
        return
    }

    let ativaSelecao = document.querySelectorAll('.app__section-task-list-item-active')
    ativaSelecao.forEach(function(button){
        button.classList.remove('app__section-task-list-item-active')

    })

   

    if (tarefaSelecionada == tarefa) {
        taskActiveDescription.textContent = null
        itemTarefaSelecionada = null
        tarefaSelecionada = null
        return
    }
    
    tarefaSelecionada = tarefa
    itemTarefaSelecionada = li
    
    li.classList.add('app__section-task-list-item-active')
    taskActiveDescription.textContent = tarefa.descricao


}


const limparForm = () => {
   tarefaEmEdicao = null
   paragraphEmEdicao = null   
    textArea.value = '';
    formTask.classList.add('hidden');
}

const selecionaTarefaParaEditar = (tarefa, elemento) => {
    if (tarefaEmEdicao == tarefa){
        limparForm()
        return
    }

    formLabel.textContent = 'Editando Tarefa'
    tarefaEmEdicao = tarefa
    paragraphEmEdicao = elemento
    textArea.value = tarefa.descricao
    formTask.classList.remove('hidden')


    }

    




function createTask(tarefa){
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item')

    const svgIcon = document.createElement('svg');
    svgIcon.innerHTML = taskIconSvg

    const paragraph = document.createElement('p');
    paragraph.classList.add('app__section-task-list-item-description');

    const button = document.createElement('button')

    const editIcon = document.createElement('img')
    editIcon.src = "./imagens/edit.png"
    
    

    button.classList.add('app_button-edit')

    paragraph.textContent = tarefa.descricao;

    li.onclick = () => {
        selecionaTarefa(tarefa, li)
    }
    
    svgIcon.addEventListener('click', (event) => {
        if(tarefa == tarefaSelecionada){
       
        console.log(event)
        event.stopPropagation()
        li.classList.add('app__section-task-list-item-complete')
        button.setAttribute('disabled', true);
        tarefaSelecionada.concluida = true
        updateLocalStorage()
        }
        
    })

    button.addEventListener('click', function (evento){
        evento.stopPropagation()
        selecionaTarefaParaEditar(tarefa, paragraph)
        


    })

    if(tarefa.concluida){
        button.setAttribute('disabled', true)
        li.classList.add('app__section-task-list-item-complete')
    }


    button.appendChild(editIcon)
    li.appendChild(svgIcon)
    li.appendChild(paragraph)
    li.appendChild(button)
    

    

    return li

}

tarefas.forEach(task => { 
    const taskItem = createTask(task)
    taskListContainer.appendChild(taskItem)
    
})

deletarBt.addEventListener('click', ()=>{
    if(tarefaSelecionada){
        const index = tarefas.indexOf(tarefaSelecionada)

        if(index !== -1){
            tarefas.splice(index, 1)
        }
        itemTarefaSelecionada.remove()
        tarefas.filter(t=> t!= tarefaSelecionada)
        console.log(tarefas)
        itemTarefaSelecionada = null
        tarefaSelecionada = null
    }
    updateLocalStorage()
    limparForm()

})




toggleFormTaskBtn.addEventListener('click', ()=>{
    formLabel.textContent = 'Adicionando Tarefa'
    formTask.classList.toggle('hidden')

})

const updateLocalStorage = () => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

formTask.addEventListener('submit',(evento)=>{
    evento.preventDefault();
    if(tarefaEmEdicao){
        tarefaEmEdicao.descricao = textArea.value
        paragraphEmEdicao.textContent = textArea.value
    } else {

    const task ={
        descricao: textArea.value,
        concluida: false
    }
    tarefas.push(task)
    const taskItem = createTask(task);
    taskListContainer.appendChild(taskItem);

    }
    updateLocalStorage()
    limparForm()

})

formCancelBt.addEventListener('click',()=>{
       limparForm()

} )

document.addEventListener('TarefaFinalizada', function (e){
    if(tarefaSelecionada){
        tarefaSelecionada.concluida = true
        itemTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        itemTarefaSelecionada.querySelector('button').setAttribute('disabled', true)
        updateLocalStorage()
    }

})

deletarTarefasConcluidasBt.addEventListener('click', () =>{
    const itensComplets = document.querySelectorAll('.app__section-task-list-item-complete')
     
    tarefas = tarefas.filter(e =>  !e.concluida);  
    
    itensComplets.forEach(function(e){
        e.remove()
    })

    updateLocalStorage()
    taskActiveDescription.textContent = ""

    })

    deletarTodasTarefas.addEventListener('click',() => {
        const tarefasItens = document.querySelectorAll('.app__section-task-list-item')

        tarefasItens.forEach((e) => e.remove() )
        tarefas = []
        updateLocalStorage()
        taskActiveDescription.textContent = ""
        



    })

    

    





