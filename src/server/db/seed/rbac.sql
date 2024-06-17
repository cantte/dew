-- Add roles, permissions and role_permission
-- Add roles
INSERT INTO "role" (id, name, created_at) VALUES ('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', 'admin', CURRENT_TIMESTAMP);
INSERT INTO "role" (id, name, created_at) VALUES ('520e0ad0-99a7-43b3-a739-d26823c99cb1', 'employee', CURRENT_TIMESTAMP);

-- Add permissions
INSERT INTO "permission" (id, name, created_at) VALUES ('37066bc8-f5e6-4c45-8a9c-a2648e606b22', 'cash_register:create', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES ('e712f3a7-7ef6-43db-a138-4e71e165368f', 'cash_register:view', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES ('893cd0a1-6880-497d-ab30-29074e8a7137', 'cash_register:update', CURRENT_TIMESTAMP);

INSERT INTO "permission" (id, name, created_at) VALUES ('1a6e4065-a562-4c3f-a802-149be1444bda', 'employee:create', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES ('a9fd2819-6624-4f28-85fa-3eaf24d044b3', 'employee:view', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES ('a8b1ba34-0006-4c85-bbe3-519faf86697f', 'employee:update', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES ('a0605cf5-eab8-4d7d-80ba-0d0b996bc980', 'employee:delete', CURRENT_TIMESTAMP);

INSERT INTO "permission" (id, name, created_at) VALUES ('c19d86ca-0ea8-4d2c-a3fc-44e13cb61120', 'inventory:view', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES ('3090a252-e405-4ffc-b9ee-7660caa94cb7', 'inventory:update', CURRENT_TIMESTAMP);

INSERT INTO "permission" (id, name, created_at) VALUES ('e6f4a421-a598-4ec2-ad46-61c61b4db3d7', 'order:create', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES ('e49d16a2-7b22-4fda-aec9-f01a49784b28', 'order:view', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES ('ff30ae83-2ff2-406b-8847-f364129f8b3f', 'order:update', CURRENT_TIMESTAMP);

INSERT INTO "permission" (id, name, created_at) VALUES ('3d478e22-8e70-4f7a-97ba-77bba7dfd4f5', 'product:create', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES ('53b7fe88-394d-4b1a-aa38-97a8aeecdd6f', 'product:view', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES ('66abbb98-f184-485a-a0c4-c186bc4da68d', 'product:update', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES ('c1536b9e-4085-4f1c-ac48-4a1ec9ebb0b7', 'product:delete', CURRENT_TIMESTAMP);

INSERT INTO "permission" (id, name, created_at) VALUES ('e6adc82e-6656-4788-a628-7611d33868bb', 'sale:create', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES ('e0ce69d0-fd84-48f1-9f04-2fcece54f63d', 'sale:view', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES ('91f85a6b-4ccf-45a9-bc85-2e682cb889f6', 'sale:update', CURRENT_TIMESTAMP);

INSERT INTO "permission" (id, name, created_at) VALUES ('52ddb354-61ff-4868-92fd-5ff44371f7ac', 'store:create', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES ('11184457-7946-466b-8f89-33a62dfc03e8', 'store:view', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES ('ca364668-2013-4912-8def-dfc3e030a01f', 'store:update', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES ('f7b0a81d-6940-411a-ae45-59b9402b441f', 'store:delete', CURRENT_TIMESTAMP);

-- Add role_permission
-- Admin
INSERT INTO "role_permission" (role_id, permission_id) VALUES 
('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', '37066bc8-f5e6-4c45-8a9c-a2648e606b22'),
('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', 'e712f3a7-7ef6-43db-a138-4e71e165368f'),
('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', '893cd0a1-6880-497d-ab30-29074e8a7137'),
('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', '1a6e4065-a562-4c3f-a802-149be1444bda'),
('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', 'a9fd2819-6624-4f28-85fa-3eaf24d044b3'),
('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', 'a8b1ba34-0006-4c85-bbe3-519faf86697f'),
('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', 'a0605cf5-eab8-4d7d-80ba-0d0b996bc980'),
('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', 'c19d86ca-0ea8-4d2c-a3fc-44e13cb61120'),
('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', '3090a252-e405-4ffc-b9ee-7660caa94cb7'),
('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', 'e6f4a421-a598-4ec2-ad46-61c61b4db3d7'),
('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', 'e49d16a2-7b22-4fda-aec9-f01a49784b28'),
('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', 'ff30ae83-2ff2-406b-8847-f364129f8b3f'),
('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', '3d478e22-8e70-4f7a-97ba-77bba7dfd4f5'),
('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', '53b7fe88-394d-4b1a-aa38-97a8aeecdd6f'),
('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', '66abbb98-f184-485a-a0c4-c186bc4da68d'),
('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', 'c1536b9e-4085-4f1c-ac48-4a1ec9ebb0b7'),
('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', 'e6adc82e-6656-4788-a628-7611d33868bb'),
('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', 'e0ce69d0-fd84-48f1-9f04-2fcece54f63d'),
('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', '91f85a6b-4ccf-45a9-bc85-2e682cb889f6'),
('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', '52ddb354-61ff-4868-92fd-5ff44371f7ac'),
('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', '11184457-7946-466b-8f89-33a62dfc03e8'),
('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', 'ca364668-2013-4912-8def-dfc3e030a01f'),
('4ac2ce47-a426-4ac1-ae1f-dd4c0b5f99a3', 'f7b0a81d-6940-411a-ae45-59b9402b441f');
-- Employee
INSERT INTO "role_permission" (role_id, permission_id) VALUES 
('520e0ad0-99a7-43b3-a739-d26823c99cb1', 'e712f3a7-7ef6-43db-a138-4e71e165368f'),
('520e0ad0-99a7-43b3-a739-d26823c99cb1', '893cd0a1-6880-497d-ab30-29074e8a7137'),
('520e0ad0-99a7-43b3-a739-d26823c99cb1', 'a9fd2819-6624-4f28-85fa-3eaf24d044b3'),
('520e0ad0-99a7-43b3-a739-d26823c99cb1', 'a8b1ba34-0006-4c85-bbe3-519faf86697f'),
('520e0ad0-99a7-43b3-a739-d26823c99cb1', 'c19d86ca-0ea8-4d2c-a3fc-44e13cb61120'),
('520e0ad0-99a7-43b3-a739-d26823c99cb1', '3090a252-e405-4ffc-b9ee-7660caa94cb7'),
('520e0ad0-99a7-43b3-a739-d26823c99cb1', 'e6f4a421-a598-4ec2-ad46-61c61b4db3d7'),
('520e0ad0-99a7-43b3-a739-d26823c99cb1', 'e49d16a2-7b22-4fda-aec9-f01a49784b28'),
('520e0ad0-99a7-43b3-a739-d26823c99cb1', 'ff30ae83-2ff2-406b-8847-f364129f8b3f'),
('520e0ad0-99a7-43b3-a739-d26823c99cb1', '53b7fe88-394d-4b1a-aa38-97a8aeecdd6f'),
('520e0ad0-99a7-43b3-a739-d26823c99cb1', '66abbb98-f184-485a-a0c4-c186bc4da68d'),
('520e0ad0-99a7-43b3-a739-d26823c99cb1', 'e6adc82e-6656-4788-a628-7611d33868bb'),
('520e0ad0-99a7-43b3-a739-d26823c99cb1', 'e0ce69d0-fd84-48f1-9f04-2fcece54f63d'),
('520e0ad0-99a7-43b3-a739-d26823c99cb1', '91f85a6b-4ccf-45a9-bc85-2e682cb889f6'),
('520e0ad0-99a7-43b3-a739-d26823c99cb1', '11184457-7946-466b-8f89-33a62dfc03e8'),
('520e0ad0-99a7-43b3-a739-d26823c99cb1', 'ca364668-2013-4912-8def-dfc3e030a01f');
