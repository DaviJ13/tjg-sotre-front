import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-grid">

        <div>
          <h3>Torcida Jovem do Galo</h3>

          <p>
            Loja oficial da maior torcida
            organizada do Treze Futebol Clube.
          </p>
        </div>

        <div>
          <h4>Contato</h4>

          <p>(83) 99999-9999</p>

          <p>
            contato@tjgstore.com.br
          </p>
        </div>

        <div>
          <h4>Endereço</h4>

          <p>
            Campina Grande - PB
          </p>

          <p>
            Sede da Torcida Jovem do Galo
          </p>
        </div>

        <div>
          <h4>Links Úteis</h4>

          <p>Início</p>

          <p>Produtos</p>

          <p>Carrinho</p>

          <p>Login</p>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 TJG STORE - Todos os direitos reservados
      </div>

    </footer>
  );
}