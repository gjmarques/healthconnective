CREATE TABLE Users(
    id_user int NOT NULL AUTO_INCREMENT,
    email varchar(60),
    PRIMARY KEY (id_user)
);


CREATE TABLE Users_cal(
    id_user int,
    ics varchar(32) ,
    date_start char(20),
    etag varchar(254),
    PRIMARY KEY (id_user, ics),
    FOREIGN KEY (id_user) REFERENCES Users(id_user)
);
