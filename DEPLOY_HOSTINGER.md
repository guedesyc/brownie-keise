# Deploy na Hostinger

## 1. Banco de dados

Banco MySQL:

```txt
u580126509_dbbrowniekeise
```

Usuario MySQL:

```txt
u580126509_browniekeise
```

Host:

```txt
localhost
```

## 2. Arquivo de configuracao

Crie o arquivo `api/config.php` na hospedagem a partir de `api/config.example.php`.

O `api/config.php` nao deve ser enviado para o GitHub, porque contem senha.

Exemplo:

```php
<?php

declare(strict_types=1);

const DB_HOST = 'localhost';
const DB_NAME = 'u580126509_dbbrowniekeise';
const DB_USER = 'u580126509_browniekeise';
const DB_PASS = 'SENHA_DO_MYSQL';

const APP_USERNAME = 'browniedakeise';
const APP_PASSWORD = 'SENHA_PARA_ABRIR_O_APP';
```

Use uma senha do app diferente da senha do MySQL.

## 3. Primeira importacao dos dados

Depois do deploy, confirme que os arquivos da API estao dentro da pasta publica do site:

```txt
public_html/api/bootstrap.php
public_html/api/login.php
public_html/api/state.php
public_html/api/config.php
```

Se a pasta `api` estiver no mesmo nivel de `public_html`, mova ou copie essa pasta para dentro de `public_html`.

Em seguida:

1. Abra o site.
2. Digite a senha definida em `APP_PASSWORD`.
3. Use o botao `Importar JSON`.
4. Selecione o backup `brownie-da-keise-dados.json`.
5. Confira as contagens de insumos, sabores, movimentos e vendas.
6. Exporte um novo JSON como conferencia.

## 4. Como os dados passam a funcionar

O navegador ainda mantem um backup local em `localStorage`, mas a fonte principal passa a ser o MySQL.

O banco guarda o estado inteiro do app como JSON em uma tabela chamada `app_state`.
