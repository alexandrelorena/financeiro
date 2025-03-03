# 📌 <span style="color:blue;">Controle financeiro</span>

#### <span style="color:yellow;">Aplicação de controle de finanças</span>

- Gastos
- Receitas (em breve...)

---

> [!WARNING]
> ⚖️ Copyright (c) 2025 Alexandre Lorena.
>
> - Licensed under the MIT License.
> - See <a href="LICENSE" style="text-decoration: none;">LICENSE</a> file for details.

---

## <span style="color:yellow;">⚡ Tecnologias Utilizadas</span>

- **Backend:** Java | Spring Boot | MySQL
- **Frontend:** Angular 17+ | Typescript | Node.js
- **Empacotamento:** Arquivo `.tar.gz` para distribuição

---

## <span style="color:yellow;">⚙️ Pré-requisitos</span>

Antes de iniciar, verifique se você possui as seguintes ferramentas:

![Java](https://img.shields.io/badge/Java-8%2B-orange?style=for-the-badge&logo=java&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Angular CLI](https://img.shields.io/badge/Angular_CLI-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)

Verifique se as variáveis de ambiente estão configuradas corretamente.

---

## <span style="color:yellow;">❗ Release</span>

> [!NOTE]
> **Versão**: 1.0.0
>
> **Data de Lançamento**: 26/01/2025

> [!IMPORTANT]
>
> #### Download (pacote compactado)
>
> - [Gastos - Linux](https://drive.google.com/file/d/1njSEitVp_gjIB4E-rV_MbUm7SQteJx_v/view?usp=drive_link)
> - [Gastos - Windows](https://drive.google.com/file/d/1kgzozoEx0XZ3OEjKxafz76r7IYBS6ft9/view?usp=drive_link)

---

## 🐧 <span style="color:yellow;">Instruções para o Usuário Final - Linux</span>

> Opção 1: Usando o Script

- Descompacte o ‘linux.zip’

  - No terminal, execute os seguintes comandos:

    ```bash
    unzip linux.zip

    cd linux/gastos-launcher/opt/gastos
    ```

- Execute a Aplicação

  - Inicie a aplicação com um dos comandos:

    ```bash
    ./gastos.sh  ou  java -jar gastos-0.0.1-SNAPSHOT.jar
    ```

    A aplicação estará disponível em `http://localhost:8080`.

  &nbsp;

> Opção 2: Usando o instalador

- **Instale o pacote**

  - Instale o pacote gastos-launcher.deb e siga as orientações

    ```bash
     sudo dpkg -i gastos-launcher.deb
    ```

    Após concluir a instalação digite gastos no terminal em qualquer local

    A aplicação estará disponível em `http://localhost:8080`.

&nbsp;

## 🖥️ <span style="color:yellow;">Instruções para o Usuário Final - Microsoft Windows <span>

> Opção 1: Usando o Script

- Descompactar

  - [Instale o 7zip](https://www.7-zip.org/)
  - [Instale o git bash](https://git-scm.com/downloads/win)

    Obs: Em variáveis de ambiente do sistema (path) adicionar o caminho do 7zip, geralmente ‘C:\Program Files (x86)\7-Zip’.

  - Abra o git bash, na pasta onde está o arquivo .7z, execute o comando para:

    ```bash
    7z x script-gastos.7z
    ```

  - Execute a aplicação via git bash com o comando:

    ```bash
    ./gastos.sh
    ```

  A aplicação estará disponível em `http://localhost:8080`.

&nbsp;

> Opção 2: Usando o instalador

- Arquivo executável

  - Instale o pacote ‘GastosSetup.exe’
  - Crie o atalho de ‘gastos.bat’
  - Troque o ícone do atalho pelo ícone ‘pagamento’.
  - Execute o atalho.

  A aplicação estará disponível em `http://localhost:8080`.

---

## <span style="color:yellow;">📚 Como Usar<span>

- 📊 Acesse o painel no navegador: http://localhost:8080
- 🔍 Consulte seus gastos mensais
- 📅 Cadastre, altere, pague ou remova seus gastos

---

## <span style="color:yellow;">🤝 Contribuição<span>

Contribuições são bem-vindas!

- Abra um Pull Request ou relate um problema.

---

> [!WARNING]
> ⚖️ Copyright (c) 2025 Alexandre Lorena.
>
> - Licensed under the MIT License.
> - See <a href="LICENSE" style="text-decoration: none;">LICENSE</a> file for details.

---

🤔 Dúvidas? <a href="mailto:alexandre.lorena@gmail.com" style="text-decoration: none;">Entre em contato</a>

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
