INSERT INTO department (name)

VALUES
    ('Development'),
    ('Marketing'),
    ('Sales');


INSERT INTO roles (title, salary, department_id)
VALUES
    ('Engineer', 100000, 1),
    ('Marketing Analyst', 90000, 2),
    ('Sales Representative', 75000, 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES
    ('Isaias', 'Moraza', 1),
    ('Samantha', 'Orangeseed', 3),
    ('John', 'Appleseed', 2),
    ('Wilma', 'Orangeseed', 1),
    ('Jimmy', 'Appleseed', 3),
    ('Dimaris', 'Orangeseed', 2);