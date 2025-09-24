let despesas = [];

// função lambda simples (arrow function)
const formatarMoeda = (v) => "R$ " + v.toFixed(2);

// list comprehension usando map
function obterDescricoes() {
    return despesas.map(d => d.descricao);
}

// closure retorna função que usa taxa do escopo externo
function criarCalculadoraImpostos(taxa) {
    return function(valor) {
        return valor * (1 + taxa);
    };
}

// função de alta ordem recebe outra função como argumento
function processarDespesas(lista, callback) {
    return lista.map(callback);
}

function salvarDespesas() {
    localStorage.setItem("despesas", JSON.stringify(despesas));
}

function carregarDespesas() {
    const dados = localStorage.getItem("despesas");
    if (dados) {
        despesas = JSON.parse(dados);
    }
}

function adicionarDespesa() {
    const descricao = document.getElementById("descricao").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const categoria = document.getElementById("categoria").value;

    if (descricao && !isNaN(valor) && valor > 0) {
        const nova = {
            id: Date.now(),
            descricao,
            valor,
            categoria,
            data: new Date().toLocaleDateString()
        };
        despesas.push(nova);
        salvarDespesas();
        atualizarInterface();
        document.getElementById("descricao").value = "";
        document.getElementById("valor").value = "";
    } else {
        alert("Preencha tudo certo!");
    }
}

function excluirDespesa(id) {
    despesas = despesas.filter(d => d.id !== id);
    salvarDespesas();
    atualizarInterface();
}

function filtrarPorCategoria(cat) {
    const filtradas = despesas.filter(d => d.categoria === cat);
    exibirDespesas(filtradas);
    calcularEstatisticas(filtradas);
}

function mostrarTodas() {
    exibirDespesas(despesas);
    calcularEstatisticas(despesas);
}

function exibirDespesas(lista) {
    const ul = document.getElementById("lista-despesas");
    ul.innerHTML = "";

    if (lista.length === 0) {
        ul.innerHTML = "<li>Nenhuma despesa encontrada.</li>";
        return;
    }

    lista.forEach(d => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="expense-info">
                <div class="expense-details">
                    <span style="flex:2"><strong>${d.descricao}</strong></span>
                    <span style="flex:1"><span class="categoria-badge ${d.categoria}">${d.categoria}</span></span>
                    <span style="flex:1">${formatarMoeda(d.valor)}</span>
                    <span style="flex:1">${d.data}</span>
                </div>
                <div class="expense-actions">
                    <button class="btn-excluir" onclick="excluirDespesa(${d.id})">Excluir</button>
                </div>
            </div>`;
        ul.appendChild(li);
    });
}

function calcularEstatisticas(lista) {
    let total = lista.reduce((soma, d) => soma + d.valor, 0);
    let categorias = {};

    lista.forEach(d => {
        categorias[d.categoria] = (categorias[d.categoria] || 0) + d.valor;
    });

    const media = lista.length > 0 ? total / lista.length : 0;

    let textoCategorias = "";
    for (let c in categorias) {
        textoCategorias += `${c}: ${formatarMoeda(categorias[c])}; `;
    }

    document.getElementById("total-geral").textContent = "Total Geral: " + formatarMoeda(total);
    document.getElementById("total-categoria").textContent = "Total por Categoria: " + (textoCategorias || "-");
    document.getElementById("media-gastos").textContent = "Média de Gastos: " + formatarMoeda(media);
}

function atualizarInterface() {
    exibirDespesas(despesas);
    calcularEstatisticas(despesas);

    console.log("Descrições:", obterDescricoes());

    // usando a closure
    const comImposto = criarCalculadoraImpostos(0.1);
    console.log("Exemplo com imposto:", formatarMoeda(comImposto(100)));

    // usando função de alta ordem
    const formatadas = processarDespesas(despesas, d => ({
        ...d,
        valorFormatado: formatarMoeda(d.valor)
    }));
    console.log("Despesas processadas:", formatadas);
}

document.addEventListener("DOMContentLoaded", function() {
    carregarDespesas();

    if (despesas.length === 0) {
        despesas = [];
        salvarDespesas();
    }

    atualizarInterface();
});
