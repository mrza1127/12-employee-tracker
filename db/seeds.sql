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

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Isaias', 'Moraza', 1, null),
    ('Samantha', 'Orangeseed', 3, null),
    ('John', 'Appleseed', 2, null),
    ('Wilma', 'Orangeseed', 1, null),
