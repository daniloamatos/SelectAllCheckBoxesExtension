let ativo = false;
let observer = null;
let intervalo = null;

function atualizarBotoes() {
    document
        .querySelectorAll('tr[data-botao-chamada="true"]')
        .forEach(row => {
            const checkboxes = row.querySelectorAll(
                'input[type="checkbox"]'
            );

            const button = row.querySelector(".botao-chamada");

            if (!button || checkboxes.length === 0) return;

            const todasMarcadas = [...checkboxes].every(
                checkbox => checkbox.checked
            );

            const novoTexto = todasMarcadas
                ? "✓ Desmarcar todos"
                : "＋ Marcar todos";

            if (button.textContent !== novoTexto) {
                button.textContent = novoTexto;
            }
        });
}


function adicionarBotoes() {

    // Evita adicionar o CSS várias vezes
    if (!document.getElementById("estilo-botoes-chamada")) {
        const style = document.createElement("style");

        style.id = "estilo-botoes-chamada";

        style.textContent = `
            .botao-chamada {
                margin-left: 10px;
                padding: 3px 8px;
                border: 1px solid #b8bec8;
                border-radius: 4px;
                background: #fff;
                color: #374151;
                font-size: 12px;
                cursor: pointer;
                white-space: nowrap;
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            }

            .botao-chamada:hover {
                background: #a4a5a5;
            }

            .botao-chamada:active {
                background: #e5e7eb;
            }

            .botao-chamada:focus {
                outline: none;
            }
        `;

        document.head.appendChild(style);
    }


    const rows = document.querySelectorAll("tr");

    console.log("[Chamada] TRs encontradas:", rows.length);


    rows.forEach(row => {

        // Já foi processada
        if (row.dataset.botaoChamada === "true") {
            return;
        }


        const checkboxes = row.querySelectorAll(
            'input[type="checkbox"]'
        );


        console.log(
            "[Chamada] TR:",
            row,
            "Checkboxes:",
            checkboxes.length
        );


        // Ignora TR sem checkbox
        if (checkboxes.length < 1) {
            return;
        }


        // Marca a TR como processada
        row.dataset.botaoChamada = "true";


        const td = document.createElement("td");

        const button = document.createElement("button");

        button.type = "button";
        button.className = "botao-chamada";


        function atualizarTexto() {

            const todasMarcadas = [...checkboxes].every(
                checkbox => checkbox.checked
            );

            button.textContent = todasMarcadas
                ? "✓ Desmarcar todos"
                : "＋ Marcar todos";
        }


        atualizarTexto();


        // Atualiza o texto quando algum checkbox
        // for alterado individualmente
        checkboxes.forEach(checkbox => {

            checkbox.addEventListener(
                "change",
                atualizarTexto
            );

        });


        // Botão marcar/desmarcar todos
        button.addEventListener("click", () => {

            const todasMarcadas = [...checkboxes].every(
                checkbox => checkbox.checked
            );


            if (todasMarcadas) {

                checkboxes.forEach(checkbox => {

                    if (checkbox.checked) {
                        checkbox.click();
                    }

                });

            } else {

                checkboxes.forEach(checkbox => {

                    if (!checkbox.checked) {
                        checkbox.click();
                    }

                });

            }


            atualizarTexto();

        });


        td.appendChild(button);

        row.appendChild(td);

    });

}


function iniciar() {

    // Não inicia duas vezes
    if (ativo) {
        console.log("[Chamada] Já está ativo.");
        return;
    }


    ativo = true;


    console.log(
        "[Chamada] ================================="
    );

    console.log(
        "[Chamada] ATIVADO pelo Ctrl + Shift + F10"
    );


    // Adiciona os botões existentes
    adicionarBotoes();


    // Sincroniza com alterações feitas
    // pelos próprios controles da página
    intervalo = setInterval(() => {

        atualizarBotoes();

    }, 100);


    // Continua detectando novas linhas
    // adicionadas pelo React
    observer = new MutationObserver(() => {

        adicionarBotoes();

    });


    observer.observe(document.body, {

        childList: true,
        subtree: true

    });


    console.log(
        "[Chamada] Observer iniciado"
    );

}


document.addEventListener("keydown", event => {

    if (
        event.ctrlKey &&
        event.shiftKey &&
        event.key === "F10"
    ) {

        event.preventDefault();

        console.log(
            "[Chamada] Ctrl + Shift + F10 pressionado"
        );

        iniciar();

    }

});