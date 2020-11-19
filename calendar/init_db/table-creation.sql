CREATE TABLE Users(
    id_user int NOT NULL AUTO_INCREMENT,
    email varchar(60),
    PersonName varchar (60) NOT NULL,
    PRIMARY KEY (id_user)
);


CREATE TABLE Users_cal(
    id_user int,
    ics varchar(32) ,
    date_start char(16),
    etag varchar(32),
    PRIMARY KEY (id_user, ics),
    FOREIGN KEY (id_user) REFERENCES Users(id_user)
);
