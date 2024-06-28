INSERT INTO "menu_item" (id, title, href, icon, priority, parent_id) VALUES 
    ('d1b228de-b103-4793-a86b-82b864f09623', 'Panel de control', '/dashboard', 'home', 10, NULL),
    ('6c8181e3-1dcb-4392-a4e7-275c3d2e6ac8', 'Productos', '/dashboard/products', 'shopping-basket', 9, NULL),
    ('a3c5b460-636f-4bdb-9372-74cbf4cb5850', 'Ventas', '/dashboard/sales', 'shopping-cart', 8, NULL),
    ('91fd5da2-4cee-441a-af46-c293b7e25566', 'Ordenes', '/dashboard/orders', 'package', 7, NULL),
    ('f2effea2-23e2-4360-8a1d-29999cd8b813', 'Caja registradora', '/dashboard/cash', 'coins', 6, NULL),
    ('3215a491-958b-43f9-80b6-b60b7c99b83e', 'Tiendas', '/dashboard/stores', 'store', 5, NULL),
    ('68bc02cf-c9de-46b6-ae7f-583d951906f8', 'Empleados', '/dashboard/employees', 'users', 4, NULL);

INSERT INTO "role_menu_item" (role_id, menu_item_id) VALUES
    ('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', 'd1b228de-b103-4793-a86b-82b864f09623'),
    ('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', '6c8181e3-1dcb-4392-a4e7-275c3d2e6ac8'),
    ('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', 'a3c5b460-636f-4bdb-9372-74cbf4cb5850'),
    ('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', '91fd5da2-4cee-441a-af46-c293b7e25566'),
    ('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', 'f2effea2-23e2-4360-8a1d-29999cd8b813'),
    ('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', '3215a491-958b-43f9-80b6-b60b7c99b83e'),
    ('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', '68bc02cf-c9de-46b6-ae7f-583d951906f8');

INSERT INTO "role_menu_item" (role_id, menu_item_id) VALUES
    ('520e0ad0-99a7-43b3-a739-d26823c99cb1', 'd1b228de-b103-4793-a86b-82b864f09623'),
    ('520e0ad0-99a7-43b3-a739-d26823c99cb1', '6c8181e3-1dcb-4392-a4e7-275c3d2e6ac8'),
    ('520e0ad0-99a7-43b3-a739-d26823c99cb1', 'a3c5b460-636f-4bdb-9372-74cbf4cb5850'),
    ('520e0ad0-99a7-43b3-a739-d26823c99cb1', '91fd5da2-4cee-441a-af46-c293b7e25566'),
    ('520e0ad0-99a7-43b3-a739-d26823c99cb1', 'f2effea2-23e2-4360-8a1d-29999cd8b813');