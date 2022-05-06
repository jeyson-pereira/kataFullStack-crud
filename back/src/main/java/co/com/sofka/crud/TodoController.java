package co.com.sofka.crud;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class TodoController {
    @Autowired
    private TodoService service;

    @GetMapping("todos")
    public Iterable<Todo> list(){
        return service.list();
    }

    @PostMapping("todo")
    public Todo save(@RequestBody Todo todo){
        return service.save(todo);
    }

    @PutMapping("todo")
    public Todo update(@RequestBody Todo todo){
        if(todo.getId() != null){
            return service.save(todo);
        }
        throw new RuntimeException("No existe el id para actualizar");
    }

    @DeleteMapping("todo/{id}")
    public void delete(@PathVariable("id") Long id){
        service.delete(id);
    }

    @GetMapping("todo/{id}")
    public Todo get(@PathVariable("id") Long id){
        return service.get(id);
    }

    @PatchMapping("todo/{id}/completed")
    public Todo updateIsCompleted(@PathVariable("id") Long id, @RequestBody Todo todo){
        if(service.exist(id)){
            return service.updateIsCompleted(id, todo);
        }
        throw new RuntimeException("No existe el id para actualizar");
    }
}
