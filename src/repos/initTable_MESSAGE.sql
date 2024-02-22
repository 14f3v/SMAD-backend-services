CREATE TABLE
    IF NOT EXISTS MESSAGES (
        username TEXT NOT NULL,
        to_username TEXT NOT NULL,
        message TEXT NOT NULL
    );