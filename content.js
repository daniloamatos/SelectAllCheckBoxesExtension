function adicionarBotoes() {
    document.querySelectorAll("tr").forEach(row => {
        if (row.dataset.botaoChamada) return;

        const checkboxes = row.querySelectorAll(
            'input[type="checkbox"]'
        );

        // Ignora linhas com 0 ou apenas 1 checkbox
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

        button.addEventListener("click", () => {
            const todasMarcadas = [...checkboxes].every(
                checkbox => checkbox.checked
            );

            checkboxes.forEach(checkbox => {
                if (todasMarcadas) {
                    if (checkbox.checked) {
                        checkbox.click();
                    }
                } else {
                    if (!checkbox.checked) {
                        checkbox.click();
                    }
                }
            });

            atualizarTexto();
        });

        td.appendChild(button);
        row.appendChild(td);
    });
}

adicionarBotoes();