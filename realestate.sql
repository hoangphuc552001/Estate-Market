CREATE DATABASE  IF NOT EXISTS realestate/*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 */;
USE `realestate`;

DROP TABLE IF EXISTS `categoryparent`;
create table categoryparent
(
    id   int auto_increment
        primary key,
    name varchar(50) charset utf8 not null
);
INSERT INTO categoryparent (id, name) VALUES (1, 'Nhà đất bán');
INSERT INTO categoryparent (id, name) VALUES (2, 'Nhà đất cho thuê');

DROP TABLE IF EXISTS `category`;
create table category
(
    id     int auto_increment
        primary key,
    name   varchar(50) charset utf8 not null,
    parent int                      not null,
    constraint `category-parent`
        foreign key (parent) references categoryparent (id)
);
INSERT INTO category (id, name, parent) VALUES (1, 'Bán căn hộ chung cư', 1);
INSERT INTO category (id, name, parent) VALUES (2, 'Bán nhà riêng', 1);
INSERT INTO category (id, name, parent) VALUES (3, 'Bán nhà biệt thự', 1);
INSERT INTO category (id, name, parent) VALUES (4, 'Bán đất', 1);
INSERT INTO category (id, name, parent) VALUES (5, 'Loại khác', 1);
INSERT INTO category (id, name, parent) VALUES (6, 'Cho thuê căn hộ chung cư', 2);
INSERT INTO category (id, name, parent) VALUES (7, 'Cho thuê nhà riêng', 2);
INSERT INTO category (id, name, parent) VALUES (8, 'Cho thuê văn phòng', 2);
INSERT INTO category (id, name, parent) VALUES (9, 'Cho thuê biệt thự', 2);
INSERT INTO category (id, name, parent) VALUES (10, 'Loại khác', 2);

create index `category-category_idx`
    on category (parent);

DROP TABLE IF EXISTS `estate`;
create table estate
(
    id          int auto_increment
        primary key,
    name        varchar(45)                                not null,
    seller      int                                        not null,
    start       datetime       default current_timestamp() not null,
    end         datetime                                   not null,
    cap         float unsigned                             not null,
    current     float unsigned default 0                   not null,
    increment   float          default 0                   null,
    holder      int                                        null,
    info        varchar(45)                                null,
    bids        int unsigned   default 0                   not null,
    description longtext                                   null,
    category    int                                        null,
    image       longtext                                   not null,
    status      varchar(45)                                null,
    annoucement varchar(300)                               null,
    constraint `product-category`
        foreign key (category) references category (id)
);

create fulltext index name
    on estate (name, description);

create index `product-category_idx`
    on estate (category);

create index `product-holder_idx`
    on estate (holder, info);

create index `product-seller_idx`
    on estate (seller);
