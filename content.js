function adicionarBotoes() {
    document.querySelectorAll("tr").forEach(row => {
        if (row.dataset.botaoChamada) return;

        const checkboxes = row.querySelectorAll(
            'input[type="checkbox"]'
        );

        if (checkboxes.length < 1) return;

        row.dataset.botaoChamada = "true";

        const td = document.createElement("td");

        const button = document.createElement("button");
        button.type = "button";

        function atualizarTexto() {
            const todasMarcadas = [...checkboxes].every(
                checkbox => checkbox.checked
            );

            button.textContent = todasMarcadas
                ? "Desselecionar todos"
                : "Selecionar todos";
        }

        atualizarTexto();

        // Atualiza o texto se o usuário clicar individualmente
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener("change", atualizarTexto);
        });

        button.addEventListener("click", () => {

            if (button.textContent === "Desselecionar todos") {

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

adicionarBotoes();