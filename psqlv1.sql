CREATE TABLE userinfo
(
    "USER_ID"           BIGSERIAL NOT NULL,
    "NAME"              VARCHAR(100),
    "SUB"               VARCHAR(150),
    "CREATED_ON"        DATE,
    CONSTRAINT "User_PK" PRIMARY KEY ( "USER_ID" )
);

CREATE TABLE wishlist
(
    "WISHLIST_ID"   BIGSERIAL NOT NULL,
    "USER_ID"       BIGINT NOT NULL,
    "DATE"          date NOT NULL,
    "SYMBOL"        VARCHAR(100) NOT NULL,
    "EXCHANGE"      VARCHAR(100),
    "PRICE"         DECIMAL NOT NULL,
    CONSTRAINT "Wishlist_PK" PRIMARY KEY ( "WISHLIST_ID" ),
    CONSTRAINT "Wishlist_FK" FOREIGN KEY ( "USER_ID" ) REFERENCES "userinfo" ( "USER_ID" )
);

CREATE TABLE holdings
(
    "HOLDINGS_ID"   BIGSERIAL NOT NULL,
    "USER_ID"       BIGINT NOT NULL,
    "DATE"          DATE NOT NULL,
    "SYMBOL"        VARCHAR(100) NOT NULL,
    "EXCHANGE"      VARCHAR(100),
    "QUANTITY"      INT NOT NULL,
    "PRICE"         DECIMAL NOT NULL,
    "SOLD"          BOOLEAN NOT NULL,
    CONSTRAINT "Holdings_PK" PRIMARY KEY ( "HOLDINGS_ID" ),
    CONSTRAINT "Holdings_FK" FOREIGN KEY ( "USER_ID" ) REFERENCES "userinfo" ( "USER_ID" )
);

CREATE TABLE sold
(
    "SOLD_ID"       BIGSERIAL NOT NULL,
    "USER_ID"       BIGINT NOT NULL,
    "HOLDINGS_ID"   BIGINT NOT NULL,
    "DATE"          DATE NOT NULL,
    "QUANTITY"      INT NOT NULL,
    "PRICE"         DECIMAL NOT NULL,
    "EARNED"        DECIMAL NOT NULL,
    CONSTRAINT "Solds_PK" PRIMARY KEY ( "SOLD_ID" ),
    CONSTRAINT "Solds_FK" FOREIGN KEY ( "USER_ID" ) REFERENCES "userinfo" ( "USER_ID" ),
    CONSTRAINT "Solds_FK1" FOREIGN KEY ( "HOLDINGS_ID" ) REFERENCES "holdings" ( "HOLDINGS_ID" )
)