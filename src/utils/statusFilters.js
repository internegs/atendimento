/**
 * Filtro para status de campanhas
 * @param {number} value - Status da campanha (0, 1, 2, 4, etc.)
 * @returns {string} HTML com badge do status
 */

export const statusFilter = (value) => {
  switch (value) {
    case 0:
      return `<span class="text-danger fw-bold">Não enviada</span>`;
    case 1:
      return `<span class="text-primary fw-bold">Enviada</span>`;
    case 2:
      return `<span class="text-warning fw-bold">Iniciada</span>`;
    case 4:
      return `<span class="text-warning fw-bold">Pausada</span>`;
    default:
      return `<span class="text-secondary fw-bold">Finalizado</span>`;
  }
}

/**
 * Filtro para status de contatos/mensagens
 * @param {string|number} value - Status do contato
 * @returns {string} HTML com status do contato
 */

export const filterContatos = (value) => {
  switch (value) {
    case 0:
      return `<span class="text-success">A enviar</span>`;
    case "RECEIVED":
      return `<span>Recebido</span>`;
    case "SENT":
      return `<span>Enviado</span>`;
    case "READ":
      return `<span>Lido</span>`;
    case "READ-SELF":
      return `<span>Leitura inativa</span>`;
    case "PLAYED":
      return `<span>Ouvida</span>`;
    case 'ERRO':
      return `<span class="text-danger">Erro no envio</span>`;
    case 'ERROZAP':
      return `<span class="text-danger">Erro numero incorreto</span>`;
    case 'ERRO SEM FONE':
      return `<span class="text-danger">Erro sem fone</span>`;
    default:
      return `<span class="text-muted">Status desconhecido</span>`;
  }
}

/**
 * Filtro para status de contatos/mensagens para uma string
 * @param {string} value
 * @returns {string}
 */

export const filterContatosString = (value) => {
  switch (value) {
    case "RECEIVED":
      return "RECEBIDO";
      
    case "PENDING":
      return "PENDENTE";

    case "OVERDUE":
      return "ATRASADO";

    default:
      return `SEM STATUS`;
  }
}

/**
 * Filtro para status de nivel
 * @param {number} value
 * @returns {string}
 */

export const nivelFilter = (value) => {
  switch (value) {
    case 0:
      return `<span class="text-danger fw-bold">Desativado</span>`;

    case 1:
      return `<span class="text-primary fw-bold">Ativo</span>`;

    default:
      return `<span class="text-secondary fw-bold">Sem Status</span>`;
  }
}

/**
 * Filtro estatistica
 * @param {number} value
 * @returns {string}
 */

export const filterEstatistica = (value) => {
  switch (value) {
    case 0:
      return `<span class="text-danger fw-bold">Não enviada</span>`;
    case 1:
      return `<span class="text-primary fw-bold">Enviada</span>`;
    case 2:
      return `<span class="text-warning fw-bold">Iniciada</span>`;
    case 4:
      return `<span class="text-warning fw-bold">Pausada</span>`;
    default:
      return `<span class="text-secondary fw-bold">Sem Status</span>`;
  }
}

/**
 * Filtro tipo de usuário
 * @param {number} value
 * @returns {string}
 */

export const filterTipoUsuario = (value) => {
  switch (value) {
    case 1:
      return `<span class="text-primary fw-bold">Administrador</span>`;

    case 2:
      return `<span class="text-warning fw-bold">Atendente</span>`;
      
    default:
      return `<span class="text-secondary fw-bold">Usuario</span>`;
  }
}