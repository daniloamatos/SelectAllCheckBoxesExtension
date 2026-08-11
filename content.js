// ============================================================
// CHECKBOXES POR LINHA - UNIVERSAL
// Ativação: CTRL + SHIFT + F10
// ============================================================

(() => {

    "use strict";

    let ativo = false;

    const BOTAO_CLASS = "botao-chamada-universal";
    const PROCESSADO_ATTR = "data-checkbox-linha";


    // ========================================================
    // LOG
    // ========================================================

    function log(...args) {
        console.log(
            "%c[Checkbox Linha]",
            "color:#2563eb;font-weight:bold;",
            ...args
        );
    }


    // ========================================================
    // CSS
    // ========================================================

    function adicionarCSS() {

        if (document.getElementById(
            "checkbox-linha-style"
        )) {
            return;
        }

        const style = document.createElement("style");

        style.id = "checkbox-linha-style";

        style.textContent = `
            .${BOTAO_CLASS} {
                margin-left: 10px;
                padding: 3px 8px;
                border: 1px solid #b8bec8;
                border-radius: 4px;
                background: #fff;
                color: #374151;
                font-size: 12px;
                cursor: pointer;
                white-space: nowrap;
                box-shadow: 0 1px 2px rgba(0,0,0,.05);
            }

            .${BOTAO_CLASS}:hover {
                background: #a4a5a5;
            }

            .${BOTAO_CLASS}:active {
                background: #e5e7eb;
            }

            .${BOTAO_CLASS}:focus {
                outline: none;
            }
        `;

        document.head.appendChild(style);
    }


    // ========================================================
    // CHECKBOXES DE UM ELEMENTO
    // ========================================================

    function obterCheckboxes(elemento) {

        return [
            ...elemento.querySelectorAll(
                'input[type="checkbox"]'
            )
        ];

    }


    // ========================================================
    // DESCOBRIR A "LINHA"
    // ========================================================

    function encontrarLinha(checkbox) {

        // ----------------------------------------------------
        // 1. Se estiver em uma tabela, usa TR
        // ----------------------------------------------------

        const tr = checkbox.closest("tr");

        if (tr) {
            return tr;
        }


        // ----------------------------------------------------
        // 2. Para estruturas DIV/etc.
        //
        // Procura um ancestral que tenha pelo menos
        // 2 checkboxes, mas evita subir até BODY/MAIN.
        // ----------------------------------------------------

        let atual = checkbox.parentElement;

        let melhor = null;


        while (
            atual &&
            atual !== document.body &&
            atual !== document.documentElement
        ) {

            const checkboxes =
                obterCheckboxes(atual);


            // Um possível container de linha
            if (checkboxes.length >= 2) {

                melhor = atual;

            }


            // Se chegou a um elemento que contém
            // muitos checkboxes, provavelmente subimos
            // demais e estamos em um container de várias linhas.
            if (checkboxes.length > 8) {

                break;

            }


            atual = atual.parentElement;
        }


        // ----------------------------------------------------
        // 3. Se achou algum agrupador
        // ----------------------------------------------------

        if (melhor) {
            return melhor;
        }


        // ----------------------------------------------------
        // 4. Fallback:
        // usa o pai imediato
        // ----------------------------------------------------

        return checkbox.parentElement;
    }


    // ========================================================
    // ATUALIZAR TEXTO
    // ========================================================

    function atualizarTexto(botao, linha) {

        const checkboxes =
            obterCheckboxes(linha);


        if (checkboxes.length === 0) {
            return;
        }


        const todasMarcadas =
            checkboxes.every(
                checkbox => checkbox.checked
            );


        botao.textContent = todasMarcadas
            ? "✓ Desmarcar todos"
            : "＋ Marcar todos";
    }


    // ========================================================
    // CRIAR BOTÃO PARA UMA LINHA
    // ========================================================

    function adicionarBotaoLinha(linha) {

        if (!linha) {
            return;
        }


        // Já processada
        if (
            linha.getAttribute(
                PROCESSADO_ATTR
            ) === "true"
        ) {

            return;
        }


        const checkboxes =
            obterCheckboxes(linha);


        if (checkboxes.length === 0) {
            return;
        }


        // ----------------------------------------------------
        // Marca como processada
        // ----------------------------------------------------

        linha.setAttribute(
            PROCESSADO_ATTR,
            "true"
        );


        log(
            "Linha encontrada:",
            linha,
            "Checkboxes:",
            checkboxes.length
        );


        // ----------------------------------------------------
        // Botão
        // ----------------------------------------------------

        const botao =
            document.createElement("button");


        botao.type = "button";

        botao.className =
            BOTAO_CLASS;


        atualizarTexto(
            botao,
            linha
        );


        // ----------------------------------------------------
        // Alteração dos checkboxes
        // ----------------------------------------------------

        checkboxes.forEach(
            checkbox => {

                checkbox.addEventListener(
                    "change",
                    () => {

                        atualizarTexto(
                            botao,
                            linha
                        );

                    }
                );

            }
        );


        // ----------------------------------------------------
        // Clique
        // ----------------------------------------------------

        botao.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();


                const atuais =
                    obterCheckboxes(linha);


                if (atuais.length === 0) {
                    return;
                }


                const todasMarcadas =
                    atuais.every(
                        checkbox =>
                            checkbox.checked
                    );


                const novoEstado =
                    !todasMarcadas;


                log(
                    "Botão clicado.",
                    "Checkboxes:",
                    atuais.length,
                    "Novo estado:",
                    novoEstado
                );


                atuais.forEach(
                    checkbox => {

                        if (
                            checkbox.checked !==
                            novoEstado
                        ) {

                            checkbox.click();

                        }

                    }
                );


                atualizarTexto(
                    botao,
                    linha
                );

            }
        );


        // ====================================================
        // INSERIR BOTÃO
        // ====================================================

        // Se for TR, cria uma nova célula
        if (
            linha.tagName === "TR"
        ) {

            const td =
                document.createElement("td");

            td.appendChild(botao);

            linha.appendChild(td);

        }

        // Para DIV/etc., coloca no final da linha
        else {

            linha.appendChild(botao);

        }


        log(
            "✓ Botão criado para linha."
        );

    }


    // ========================================================
    // ENCONTRAR TODAS AS LINHAS
    // ========================================================

    function adicionarBotoes() {

        log(
            "Procurando checkboxes..."
        );


        const checkboxes = [
            ...document.querySelectorAll(
                'input[type="checkbox"]'
            )
        ];


        log(
            "Total de checkboxes:",
            checkboxes.length
        );


        if (checkboxes.length === 0) {

            console.warn(
                "[Checkbox Linha] Nenhum checkbox encontrado."
            );

            return;
        }


        const linhas = new Set();


        checkboxes.forEach(
            checkbox => {

                const linha =
                    encontrarLinha(checkbox);


                if (linha) {
                    linhas.add(linha);
                }

            }
        );


        log(
            "Possíveis linhas:",
            linhas.size
        );


        linhas.forEach(
            linha => {

                adicionarBotaoLinha(
                    linha
                );

            }
        );


        log(
            "Processamento concluído."
        );

    }


    // ========================================================
    // INICIAR
    // ========================================================

    function iniciar() {

        if (ativo) {

            log(
                "Já está ativado."
            );

            return;
        }


        ativo = true;


        log(
            "%cATIVADO!",
            "color:green;font-weight:bold;font-size:16px;"
        );


        adicionarCSS();

        adicionarBotoes();

    }


    // ========================================================
    // CTRL + SHIFT + F10
    // ========================================================

    log(
        "%cSCRIPT CARREGADO",
        "color:purple;font-weight:bold;font-size:16px;"
    );


    log(
        "URL:",
        location.href
    );


    log(
        "Aguardando Ctrl + Shift + F10..."
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.ctrlKey &&
                event.shiftKey &&
                (
                    event.key === "F10" ||
                    event.code === "F10"
                )
            ) {

                event.preventDefault();


                log(
                    "%cCTRL + SHIFT + F10 DETECTADO",
                    "color:red;font-weight:bold;"
                );


                iniciar();

            }

        },
        true
    );

})();