INSERT INTO users (email, password_hash, role, class, display_name)
VALUES
    ('admin@edugrade.com',   '__HASH__', 'admin',   NULL,   'Admin'),
    ('larare@edugrade.com',  '__HASH__', 'teacher', NULL,   'Lärare'),
    ('elev@edugrade.com',    '__HASH__', 'student', 'net25','Elev');

INSERT INTO rooms (room_number, type, capacity, location, floor_number) VALUES
                                                                            ('1', 'lab',        16, 'Lintjärn',     1),
                                                                            ('2', 'classroom',  22, 'Lillfjärden',  1),
                                                                            ('3', 'publicarea', 10, 'Personalrummet', 1),
                                                                            ('4', 'classroom',  24, 'Dellen',       1),
                                                                            ('5', 'lab',        16, 'Kopparlab',    1),
                                                                            ('6', 'lab',        20, 'Fiberlab',     1);

INSERT INTO room_assets (room_id, asset) VALUES
                                             (1, 'Whiteboard'),
                                             (1, 'TV'),
                                             (1, 'Nätverksutrustning'),

                                             (2, 'Whiteboard'),
                                             (2, 'Projektor'),

                                             (4, 'TV'),
                                             (4, 'Projektor'),
                                             (4, 'Whiteboard'),

                                             (5, 'Projektor'),
                                             (5, 'Whiteboard'),
                                             (5, 'Fiberutrustning'),

                                             (6, 'Projektor'),
                                             (6, 'Whiteboard'),
                                             (6, 'Fiberutrustning');