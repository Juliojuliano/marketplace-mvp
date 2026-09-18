import { Product } from "./types";

export const products: Product[] = [
  {
    id: "tenis-runner-x1",
    title: "Tênis Runner X1",
    description: "Tênis de corrida leve com amortecimento responsivo, ideal para treinos diários e longas distâncias.",
    category: "Calçados",
    images: ["https://picsum.photos/seed/runner-x1/600/600"],
    basePriceCents: 29990,
    rating: 4.6,
    reviewCount: 812,
    variants: [
      { sku: "RX1-PT-38", color: "Preto", size: "38", stock: 12, priceCents: 29990 },
      { sku: "RX1-PT-40", color: "Preto", size: "40", stock: 5, priceCents: 29990 },
      { sku: "RX1-BR-38", color: "Branco", size: "38", stock: 0, priceCents: 29990 },
      { sku: "RX1-BR-42", color: "Branco", size: "42", stock: 8, priceCents: 31990 },
    ],
  },
  {
    id: "fone-bt-max",
    title: "Fone Bluetooth Max Pro",
    description: "Fone sem fio com cancelamento ativo de ruído, 30h de bateria e estojo de carregamento rápido.",
    category: "Eletrônicos",
    images: ["https://picsum.photos/seed/fone-bt-max/600/600"],
    basePriceCents: 45900,
    rating: 4.4,
    reviewCount: 2103,
    variants: [
      { sku: "FBM-PT", color: "Preto", size: "Único", stock: 30, priceCents: 45900 },
      { sku: "FBM-AZ", color: "Azul", size: "Único", stock: 14, priceCents: 45900 },
      { sku: "FBM-BR", color: "Branco", size: "Único", stock: 3, priceCents: 47900 },
    ],
  },
  {
    id: "liquidificador-turbo",
    title: "Liquidificador Turbo 1200W",
    description: "Potência para triturar gelo e frutas congeladas, jarra de 2L em vidro temperado, 5 velocidades.",
    category: "Casa",
    images: ["https://picsum.photos/seed/liquidificador/600/600"],
    basePriceCents: 18990,
    rating: 4.2,
    reviewCount: 456,
    variants: [
      { sku: "LT12-127", color: "Prata", size: "127V", voltage: "127V", stock: 20, priceCents: 18990 },
      { sku: "LT12-220", color: "Prata", size: "220V", voltage: "220V", stock: 17, priceCents: 18990 },
    ],
  },
  {
    id: "mochila-executiva",
    title: "Mochila Executiva Antifurto",
    description: "Compartimento acolchoado para notebook até 15.6', porta USB externa e material impermeável.",
    category: "Acessórios",
    images: ["https://picsum.photos/seed/mochila/600/600"],
    basePriceCents: 15990,
    rating: 4.7,
    reviewCount: 1290,
    variants: [
      { sku: "MEA-PT", color: "Preto", size: "Único", stock: 40, priceCents: 15990 },
      { sku: "MEA-CZ", color: "Cinza", size: "Único", stock: 9, priceCents: 15990 },
    ],
  },
  {
    id: "cafeteira-express",
    title: "Cafeteira Expresso Automática",
    description: "Prepara espresso, cappuccino e latte com um toque. Reservatório de 1.5L e sistema de espuma de leite.",
    category: "Casa",
    images: ["https://picsum.photos/seed/cafeteira/600/600"],
    basePriceCents: 89990,
    rating: 4.5,
    reviewCount: 331,
    variants: [
      { sku: "CE-INOX", color: "Inox", size: "Único", stock: 6, priceCents: 89990 },
      { sku: "CE-PT", color: "Preto", size: "Único", stock: 11, priceCents: 84990 },
    ],
  },
  {
    id: "camiseta-basica",
    title: "Camiseta Básica Algodão Pima",
    description: "Malha 100% algodão pima, corte reto, caimento confortável para o dia a dia.",
    category: "Vestuário",
    images: ["https://picsum.photos/seed/camiseta/600/600"],
    basePriceCents: 6990,
    rating: 4.3,
    reviewCount: 987,
    variants: [
      { sku: "CBA-PT-P", color: "Preto", size: "P", stock: 25, priceCents: 6990 },
      { sku: "CBA-PT-M", color: "Preto", size: "M", stock: 30, priceCents: 6990 },
      { sku: "CBA-PT-G", color: "Preto", size: "G", stock: 0, priceCents: 6990 },
      { sku: "CBA-BR-M", color: "Branco", size: "M", stock: 18, priceCents: 6990 },
    ],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
