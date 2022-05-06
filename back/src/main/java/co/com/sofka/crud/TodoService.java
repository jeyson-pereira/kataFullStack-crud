package co.com.sofka.crud;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TodoService {
    @Autowired
    private TodoRepository repository;

    public Iterable<Todo> list(){
        return repository.findAll();
    }

    public Todo save(Todo todo){
        return repository.save(todo);
    }

    public void delete(Long id){
        repository.delete(get(id));
    }

    public Todo get(Long id){
        return repository.findById(id).orElseThrow();
    }

    @Transactional
    public Todo updateIsCompleted(Long id, Todo todo) {
        repository.updateIsCompleted(id, todo.isCompleted());
        return get(id);
    }

    public boolean exist(Long id){
        return repository.existsById(id);
    }

}
