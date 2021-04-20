CREATE TABLE public.users
(
    login text NOT NULL,
    password text NOT NULL,
    PRIMARY KEY (login)
);



CREATE TABLE public.boards
(
    id integer NOT NULL,
    title text NOT NULL,
    user_id text NOT NULL,
    private boolean NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT user_id FOREIGN KEY (user_id)
        REFERENCES public.users (login) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);


CREATE TABLE public.columns
(
    id integer NOT NULL,
    name text NOT NULL,
    board_id integer NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT board_id FOREIGN KEY (board_id)
        REFERENCES public.boards (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

CREATE TABLE public.cards
(
    id integer NOT NULL,
    description text NOT NULL,
    column_id integer NOT NULL,
    "order" integer NOT NULL,
    archived boolean NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT column_id FOREIGN KEY (column_id)
        REFERENCES public.columns (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);



