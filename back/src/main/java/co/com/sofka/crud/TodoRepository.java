package co.com.sofka.crud;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface TodoRepository  extends CrudRepository<Todo, Long> {
    @Modifying
    @Query(value = "update Todo todo set todo.isCompleted = :completed where todo.id = :id")
    public void updateIsCompleted(@Param(value = "id") Long id, @Param(value = "completed") Boolean completed);
}
