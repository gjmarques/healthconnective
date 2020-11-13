CREATE TABLE Users(
    email varchar(60),
    PersonName varchar (60) NOT NULL,
    PRIMARY KEY (email)
);


CREATE TABLE Users_cal(
    email varchar(60),
    ics varchar(30) ,
    date_start char(16),
    etag varchar(10),
    PRIMARY KEY (email, ics),
    FOREIGN KEY (email) REFERENCES Users(email)
);
