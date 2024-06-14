-- Add roles, permissions and role_permission
-- Add roles
INSERT INTO "role" (id, name, created_at) VALUES (uuid_generate_v4(), 'admin', CURRENT_TIMESTAMP);
INSERT INTO "role" (id, name, created_at) VALUES (uuid_generate_v4(), 'employee', CURRENT_TIMESTAMP);

-- Add permissions

INSERT INTO "permission" (id, name, created_at) VALUES (uuid_generate_v4(), 'cash_register_create', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES (uuid_generate_v4(), 'cash_register_view', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES (uuid_generate_v4(), 'cash_register_update', CURRENT_TIMESTAMP);

INSERT INTO "permission" (id, name, created_at) VALUES (uuid_generate_v4(), 'employee_create', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES (uuid_generate_v4(), 'employee_view', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES (uuid_generate_v4(), 'employee_update', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES (uuid_generate_v4(), 'employee_delete', CURRENT_TIMESTAMP);

INSERT INTO "permission" (id, name, created_at) VALUES (uuid_generate_v4(), 'inventory_view', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES (uuid_generate_v4(), 'inventory_update', CURRENT_TIMESTAMP);

INSERT INTO "permission" (id, name, created_at) VALUES (uuid_generate_v4(), 'order_create', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES (uuid_generate_v4(), 'order_view', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES (uuid_generate_v4(), 'order_update', CURRENT_TIMESTAMP);

INSERT INTO "permission" (id, name, created_at) VALUES (uuid_generate_v4(), 'product_create', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES (uuid_generate_v4(), 'product_view', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES (uuid_generate_v4(), 'product_update', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES (uuid_generate_v4(), 'product_delete', CURRENT_TIMESTAMP);

INSERT INTO "permission" (id, name, created_at) VALUES (uuid_generate_v4(), 'sale_create', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES (uuid_generate_v4(), 'sale_view', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES (uuid_generate_v4(), 'sale_update', CURRENT_TIMESTAMP);

INSERT INTO "permission" (id, name, created_at) VALUES (uuid_generate_v4(), 'store_create', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES (uuid_generate_v4(), 'store_view', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES (uuid_generate_v4(), 'store_update', CURRENT_TIMESTAMP);
INSERT INTO "permission" (id, name, created_at) VALUES (uuid_generate_v4(), 'store_delete', CURRENT_TIMESTAMP);
