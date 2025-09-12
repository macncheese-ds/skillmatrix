CREATE TABLE empleado(
id INT AUTO_INCREMENT PRIMARY KEY,
nde INT not null,
link varchar(200),
fi date not null,
gaveta int not null,
nombre varchar(200) not null,
pos varchar(200) not null,
line varchar(200) not null,
op int not null,
op1 int not null,
op2 int not null,
op3 int not null,
op4 int not null,
op5 int not null,
op6 int not null,
op7 int not null,
op8 int not null,
op9 int not null,
op10 int not null,
op11 int not null,
op12 int not null,
op13 int not null,
op14 int not null,
op15 int not null,
op16 int not null,
op17 int not null,
op18 int not null
);

CREATE TABLE IF NOT EXISTS users (
  username VARCHAR(50) PRIMARY KEY,
  pass_hash VARBINARY(60) NOT NULL,
  rol ENUM('admin','guest') NOT NULL DEFAULT 'admin',
  nombre VARCHAR(100) NOT NULL
);
