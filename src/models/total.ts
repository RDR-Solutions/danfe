export interface Total {
  vBC?: string;
  vICMS?: string;
  vProd?: string;
  vDesc?: string;
  vPIS?: string;
  vCOFINS?: string;
  vPISST?: string;
  vCOFINSST?: string;
  vOutro?: string;
  vNF?: string;
  vTotTrib?: string;
  /** Mapped from various total fields - valor total dos produtos */
  valorTotal?: string;
  /** Desconto */
  desconto?: string;
  /** Frete */
  valorFrete?: string;
  /** Acréscimo */
  acrescimo?: string;
  /** Valor total pago */
  valorPago?: string;
  /** Tributos totais (valotTotalTributos in Dart) */
  valotTotalTributos?: string;
}
