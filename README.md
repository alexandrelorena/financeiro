# Finanças

Aplicação de controle de finanças

- Gastos
- Receitas (em breve...)

### 📚 Tecnologias Utilizadas

- **Backend:** Java | Spring Boot | MySQL
- **Frontend:** Angular 17+ | Typescript | Node.js
- **Empacotamento:** Arquivo `.tar.gz` para distribuição

&nbsp;&nbsp;

## Pré-requisitos

Antes de iniciar, verifique se você possui as seguintes ferramentas instaladas:

- [Java 8 ou superior](https://www.java.com/pt-BR/download/)
- [Maven](https://maven.apache.org/)
- [Node.js](https://nodejs.org/)
- [Angular CLI](https://angular.io/cli)
- [MySQL](https://dev.mysql.com/downloads/)

Verifique se as variáveis de ambiente estão configuradas corretamente.

&nbsp;

## Release

### Arquivos Disponíveis para Download

Faça o download do arquivo compactado:

- [Gastos - Linux](https://drive.google.com/file/d/11VVZCACWcZuyfMNqDkQTjDc2zF_xOEml/view?usp=drive_link)
- [Gastos - Windows](https://drive.google.com/file/d/1kgzozoEx0XZ3OEjKxafz76r7IYBS6ft9/view?usp=drive_link)

### Versão Atual

- **Versão**: 1.0.0
- **Data de Lançamento**: 26/01/2025

&nbsp;

## Instruções para o Usuário Final - Linux

> Opção 1: Usando o Script

- - DESCOMPACTAR

  - No terminal, execute:

    ```bash
    tar -xzvf instalador-gastos.tar.gz
    cd instalador
    ```

  - Inicie a aplicação com:

    ```bash
    ./gastos.sh
    ```

    A aplicação estará disponível em `http://localhost:8080`.

&nbsp;

> Opção 2: Use o instalador

&nbsp;

- **Instale o pacote**

  - Instale o pacote com o comando:

    ```bash
     sudo dpkg -i gastos-1.0.0.deb
    ```

    A aplicação estará disponível em `http://localhost:8080`.

&nbsp;&nbsp;

## Instruções para o Usuário Final - Windows

---

> Opção 1: Usando o Script

- DESCOMPACTAR

  - [Instale o 7zip](https://www.7-zip.org/)
  - [Instale o git bash](https://git-scm.com/downloads/win)

    Obs: Em variáveis de ambiente do sistema (path) adicionar o caminho do 7zip, geralmente ‘C:\Program Files (x86)\7-Zip’.

  - Abra o git bash, na pasta onde está o arquivo .7z, execute o comando para:

    ```bash
    7z x script-gastos.7z
    ```

  - Execute a Aplicação

    - Inicie a aplicação via git bash com o comando:

      ```bash
      ./gastos.sh
      ```

      A aplicação estará disponível em: http://localhost:8080

&nbsp;

> Opção 2: Instale o pacote

- ARQUIVO EXECUTÁVEL

  - Instale o pacote ‘GastosSetup.exe’
  - Crie o atalho de ‘gastos.bat’
  - Troque o ícone do atalho pelo ícone ‘pagamento’.
  - Execute o atalho.

    A aplicação estará disponível em `http://localhost:8080`.

---

### 🚀 Gastos - clique nas imagems

[![Gastos](/prints/img-small/controle-de-financas_1.png)](/prints/controle-de-financas_1.png)
[![Gastos](/prints/img-small/controle-de-financas_2.png)](/prints/controle-de-financas_2.png)

[![Gastos](/prints/img-small/controle-de-financas_3.png)](/prints/controle-de-financas_3.png)
[![Gastos](/prints/img-small/controle-de-financas_4.png)](/prints/controle-de-financas_4.png)

[![Gastos](/prints/img-small/controle-de-financas_5.png)](/prints/controle-de-financas_5.png)
[![Gastos](/prints/img-small/controle-de-financas_6.png)](/prints/controle-de-financas_6.png)

[![Gastos](/prints/img-small/controle-de-financas_7.png)](/prints/controle-de-financas_7.png)
[![Gastos](/prints/img-small/controle-de-financas_8.png)](/prints/controle-de-financas_8.png)

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="estilo.css">
</head>
<body>

<img src="https://i.imgur.com/h1q7oo1.jpg" width="785" height="5">

<div align="left">
  <img src="https://github-readme-stats.vercel.app/api/wakatime?username=@alexandrelorena&v=2&theme=react" height="125" alt="languages graph"/>
  <img src="https://github-readme-stats.vercel.app/api/top-langs?username=alexandrelorena&locale=en&hide_title=false&layout=compact&card_width=320&langs_count=5&theme=react&hide_border=false&order=2" height="125" alt="languages graph" />
  <img src="https://github-readme-stats.vercel.app/api?username=alexandrelorena&hide_title=false&hide_rank=false&show_icons=true&include_all_commits=true&count_private=true&disable_animations=false&theme=react&locale=en&hide_border=false&order=1" height="125" alt="stats graph"/>
</div>
<img src="https://i.imgur.com/h1q7oo1.jpg" width="785" height="5">

<div>
  <a href="mailto:alexandre.lorena@gmail.com" style="text-decoration: none;">
    <img src="https://cdn.simpleicons.org/gmail" alt="Gmail" width="32" height="32"></a>&nbsp;&nbsp;
  <a href="https://www.instagram.com/alexandre_lorena/" style="text-decoration: none;">
    <img src="https://cdn.simpleicons.org/instagram" alt="Instagram" width="32" height="32"></a>&nbsp;&nbsp;
  <a href="https://www.linkedin.com/in/alexandrelorena-developer/" style="text-decoration: none;">
    <img src="https://cdn.simpleicons.org/linkedin" alt="LinkedIn" width="32" height="32"></a>&nbsp;&nbsp;
  <a href="https://x.com/alefaith" style="text-decoration: none;">
    <img src="https://cdn.simpleicons.org/x" alt="Twitter" width="32" height="32"></a>&nbsp;&nbsp;
  <a href="https://www.youtube.com/@AleDevJavaPython" style="text-decoration: none;">
    <img src="https://cdn.simpleicons.org/youtube" width="32" height="32"></a>&nbsp;&nbsp;
  <a href="https://steamcommunity.com/id/alexandrelorena/" style="text-decoration: none;">
    <img src="https://cdn.simpleicons.org/steam/gray" width="32" height="32"></a>&nbsp;&nbsp;
  <a href="https://discord.com/channels/alelorena" style="text-decoration: none;">
    <img src="https://cdn.simpleicons.org/discord" width="32" height="32"></a>
</div>
</body>
</html>
