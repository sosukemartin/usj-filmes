document.addEventListener("DOMContentLoaded", () => {
  const usuarioLogado = localStorage.getItem("usuarioLogado");

  // Se não estiver logado, desativa carrinho
  const carrinhoBtn = document.querySelector('a[href="carrinho.html"]');
  if (carrinhoBtn) {
    carrinhoBtn.setAttribute("href", "#");
    carrinhoBtn.style.position = "relative";

    if (!usuarioLogado) {
      carrinhoBtn.addEventListener("click", (e) => {
        e.preventDefault();
        mostrarAvisoLogin(carrinhoBtn);
      });
      return; // não prossegue com lógica do carrinho se não está logado
    }
  }

  // Função auxiliar: mostra aviso
  function mostrarAvisoLogin(btn) {
    let aviso = btn.querySelector(".aviso-login");
    if (!aviso) {
      aviso = document.createElement("div");
      aviso.className = "aviso-login";
      aviso.textContent = "⚠️ Faça login para acessar o carrinho.";
      aviso.style.position = "absolute";
      aviso.style.top = "100%";
      aviso.style.right = "0";
      aviso.style.background = "#ffc107";
      aviso.style.color = "#000";
      aviso.style.padding = "5px 10px";
      aviso.style.borderRadius = "6px";
      aviso.style.whiteSpace = "nowrap";
      aviso.style.zIndex = "9999";
      aviso.style.fontSize = "0.85rem";
      btn.appendChild(aviso);

      setTimeout(() => {
        aviso.remove();
      }, 3000);
    }
  }

  // -----------------------------
  // CARRINHO FUNCIONAL (se logado)
  // -----------------------------

  function extrairPreco(texto) {
    const match = texto.match(/R\$ ?([\d,.]+)/);
    return match ? parseFloat(match[1].replace(",", ".")) : 0;
  }

  function adicionarAoCarrinho({ titulo, preco, imagem }) {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho.push({ titulo, preco, imagem });
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }

  document.querySelectorAll(".filme-overlay-info button").forEach(botao => {
    botao.onclick = e => {
      e.preventDefault();
      const overlay = botao.closest(".filme-overlay-info");
      const titulo = overlay.querySelector("h5").textContent;
      const preco = extrairPreco(botao.textContent);
      const imagem = overlay.parentElement.querySelector("img").getAttribute("src");

      adicionarAoCarrinho({ titulo, preco, imagem });
      atualizarMiniCarrinho();
    };
  });

  // Criação do dropdown
  const dropdown = document.createElement("div");
  dropdown.id = "miniCarrinho";
  dropdown.style.position = "absolute";
  dropdown.style.top = "100%";
  dropdown.style.right = "0";
  dropdown.style.minWidth = "280px";
  dropdown.style.maxHeight = "400px";
  dropdown.style.overflowY = "auto";
  dropdown.style.background = "rgba(0,0,0,0.95)";
  dropdown.style.zIndex = "1000";
  dropdown.style.border = "1px solid #ccc";
  dropdown.style.borderRadius = "6px";
  dropdown.style.padding = "10px";
  dropdown.style.display = "none";

  carrinhoBtn.appendChild(dropdown);

  carrinhoBtn.addEventListener("click", (e) => {
    e.preventDefault();
    atualizarMiniCarrinho();
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", (e) => {
    if (!carrinhoBtn.contains(e.target)) dropdown.style.display = "none";
  });

  function atualizarMiniCarrinho() {
    const container = document.getElementById("miniCarrinho");
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    if (!container) return;

    if (carrinho.length === 0) {
      container.innerHTML = "<p class='text-white p-2'>Seu carrinho está vazio.</p>";
      return;
    }

    let total = 0;
    let html = "<ul class='list-unstyled mb-2'>";
    carrinho.forEach(item => {
      total += item.preco;
      html += `
        <li class="d-flex align-items-center mb-2 text-white border-bottom pb-2">
          <img src="${item.imagem}" style="width:40px; height:60px; object-fit:cover; margin-right:10px; border-radius:4px;">
          <div class="flex-grow-1">
            <div style="font-size:0.9rem;">${item.titulo}</div>
            <div style="font-size:0.85rem;">R$ ${item.preco.toFixed(2).replace(".", ",")}</div>
          </div>
        </li>
      `;
    });
    html += "</ul>";
    html += `<p class="text-white fw-bold mb-2">Total: R$ ${total.toFixed(2).replace(".", ",")}</p>`;
    html += `<button class="btn btn-sm btn-danger w-100" id="limparCarrinho">🗑️ Limpar Carrinho</button>`;

    container.innerHTML = html;

    document.getElementById("limparCarrinho").onclick = () => {
      localStorage.removeItem("carrinho");
      atualizarMiniCarrinho();
    };
  }
});
