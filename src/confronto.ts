export type DocumentoSped = { linha: number; chave: string; numero?: string; valorTotal?: number; participante?: string };
export type DocumentoFiscal = { chave: string; numero?: string; valorTotal?: number; situacao: "AUTORIZADA" | "CANCELADA" | "DESCONHECIDA" };
export type Divergencia = { regra: string; severidade: "ALTA" | "MEDIA" | "BAIXA"; linha: number; chave: string; descricao: string; sped?: string; origem?: string };

const chaveNormalizada = (valor: string) => valor.replace(/\D/g, "");
const dinheiro = (valor?: number) => valor === undefined ? undefined : valor.toFixed(2);

export function confrontarDocumentos(sped: DocumentoSped[], origem: DocumentoFiscal[]): Divergencia[] {
  const porChave = new Map(origem.map((documento) => [chaveNormalizada(documento.chave), documento]));
  const divergencias: Divergencia[] = [];
  for (const registro of sped) {
    const chave = chaveNormalizada(registro.chave);
    if (chave.length !== 44) {
      divergencias.push({ regra: "CHAVE_INVALIDA", severidade: "ALTA", linha: registro.linha, chave, descricao: "Registro SPED sem chave NF-e válida." });
      continue;
    }
    const nota = porChave.get(chave);
    if (!nota) {
      divergencias.push({ regra: "DOCUMENTO_AUSENTE", severidade: "MEDIA", linha: registro.linha, chave, descricao: "NF-e do SPED não foi encontrada na base consultada." });
      continue;
    }
    if (nota.situacao === "CANCELADA") {
      divergencias.push({ regra: "NOTA_CANCELADA", severidade: "ALTA", linha: registro.linha, chave, descricao: "Documento encontrado está cancelado." });
    }
    if (registro.valorTotal !== undefined && nota.valorTotal !== undefined && Math.abs(registro.valorTotal - nota.valorTotal) > 0.01) {
      divergencias.push({ regra: "VALOR_TOTAL", severidade: "MEDIA", linha: registro.linha, chave, descricao: "Valor total diverge entre SPED e documento.", sped: dinheiro(registro.valorTotal), origem: dinheiro(nota.valorTotal) });
    }
  }
  return divergencias;
}

export function resumo(dados: Divergencia[]): Record<Divergencia["severidade"], number> {
  return dados.reduce((resultado, item) => ({ ...resultado, [item.severidade]: resultado[item.severidade] + 1 }), { ALTA: 0, MEDIA: 0, BAIXA: 0 });
}
